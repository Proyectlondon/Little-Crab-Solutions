# Módulo 05: Testing y Observabilidad — LangSmith / W&B (6h)

## Objetivos de Aprendizaje
Al completar este módulo, serás capaz de:
- ✅ Instrumentar agentes y workflows n8n con trazas distribuidas (LangSmith / Weights & Biases)
- ✅ Definir y ejecutar datasets de evaluación (golden sets) para regresión de calidad
- ✅ Configurar alertas automáticas por degradación: latencia, tasa error, drift de respuestas
- ✅ Implementar A/B testing de prompts/modelos en producción
- ✅ Construir dashboard de observabilidad unificado (Grafana + LangSmith + n8n metrics)

---

## Contenido Teórico-Práctico

### 1. Por Qué Observabilidad en IA (No Solo Logs)

| Nivel | Pregunta | Herramienta |
|-------|----------|-------------|
| **Logs** | "¿Qué pasó?" | n8n executions, console.log |
| **Metrics** | "¿Cuánto/qué tan bien?" | Prometheus + Grafana (latencia, throughput, error rate) |
| **Traces** | "¿Por qué pasó? ¿Dónde falló?" | **LangSmith / W&B Traces** (span tree: LLM → tool → LLM → output) |
| **Evals** | "¿La respuesta es correcta?" | **LangSmith Datasets / W&B Evaluations** (golden set + LLM-as-judge) |

**Para AI Solution Builder**: Traces + Evals = confianza para iterar prompts sin romper producción.

### 2. LangSmith: Trazas + Evaluación (Recomendado para Equipos)

#### 2.1 Setup (Gratis hasta 5k trazas/mes)
```bash
# 1. Cuenta en https://smith.langchain.com
# 2. Crear API Key: Settings → API Keys → New Key
# 3. Variables de entorno (n8n docker-compose.yml o .env)
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=lsv2_xxxxxxxxxxxxxxxxxxxxxxxx
LANGCHAIN_PROJECT=little-crab-diagnostico  # Nombre del proyecto
LANGCHAIN_ENDPOINT=https://api.smith.langchain.com
```

#### 2.2 Instrumentar n8n (Dos Opciones)

**Opción A: Wrapper HTTP Request (Simple, funciona ya)**
```javascript
// En cada HTTP Request a Ollama/OpenAI, añade headers:
Headers:
  X-LangChain-Project: {{ $env.LANGCHAIN_PROJECT }}
  X-LangChain-Trace-Id: {{ $execution.id }}  // Correlation ID

// Body: añade metadata
{
  "model": "qwen2.5:3b",
  "prompt": "...",
  "metadata": {
    "workflow_id": "{{ $workflow.id }}",
    "node_name": "{{ $node.name }}",
    "execution_id": "{{ $execution.id }}",
    "user_id": "{{ $json.user_id || 'anon' }}"
  }
}
```
LangSmith auto-detecta llamadas a proveedores conocidos (OpenAI, Anthropic, Ollama via proxy).

**Opción B: Proxy LangSmith (Completo, requiere servicio extra)**
```yaml
# docker-compose.yml - añadir servicio
langsmith-proxy:
  image: langchain/langsmith-proxy:latest
  ports:
    - "1984:1984"
  environment:
    - LANGSMITH_API_KEY=${LANGCHAIN_API_KEY}
  networks:
    - llc-network

# En n8n: cambiar URL Ollama de http://ollama:11434 → http://langsmith-proxy:1984
# El proxy intercepta, traza, y reenvía a Ollama real
```

#### 2.3 Datasets de Evaluación (Golden Sets)
```python
# scripts/create_golden_set.py
from langsmith import Client

client = Client()

# Crear dataset
dataset = client.create_dataset(
    dataset_name="diagnostico-ia-clasificacion",
    description="Casos de prueba para clasificador de diagnósticos IA"
)

# Casos: (input, expected_output)
test_cases = [
    {
        "inputs": {"empresa": "FacturaFast", "descripcion_reto": "Automatizar lectura de facturas PDF y subida a contabilidad"},
        "outputs": {"categoria": "automatizacion", "prioridad": "alta"}
    },
    {
        "inputs": {"empresa": "DataViz Co", "descripcion_reto": "Necesito dashboards de ventas en tiempo real desde mi ERP"},
        "outputs": {"categoria": "analisis_datos", "prioridad": "media"}
    },
    {
        "inputs": {"empresa": "StartupXYZ", "descripcion_reto": "Quiero un agente que responda tickets de soporte 24/7"},
        "outputs": {"categoria": "agente_ia", "prioridad": "alta"}
    },
    # ... 20+ casos cubriendo edge cases
]

for case in test_cases:
    client.create_example(
        dataset_id=dataset.id,
        inputs=case["inputs"],
        outputs=case["outputs"]
    )
```

#### 2.4 Ejecutar Evaluación (CI/CD)
```yaml
# .github/workflows/eval.yml
name: Eval Clasificador
on: [push, pull_request]

jobs:
  eval:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.11' }
      - run: pip install langsmith openai
      - run: python scripts/run_eval.py
        env:
          LANGCHAIN_API_KEY: ${{ secrets.LANGCHAIN_API_KEY }}
          OLLAMA_HOST: ${{ secrets.STAGING_OLLAMA_HOST }}
```

```python
# scripts/run_eval.py
from langsmith import Client
from langsmith.evaluation import evaluate
from langsmith.schemas import Run, Example

client = Client()

# 1. Cargar dataset
dataset = client.list_datasets(dataset_name="diagnostico-ia-clasificacion")[0]

# 2. Definir target (tu workflow n8n expuesto como API)
def predict(inputs: dict) -> dict:
    import requests
    resp = requests.post(
        f"{os.getenv('N8N_WEBHOOK_URL')}/diagnostico-ia",
        json=inputs,
        headers={"Idempotency-Key": f"eval-{hash(str(inputs))}"}
    )
    return resp.json()

# 3. Evaluadores (LLM-as-judge + exact match)
def exact_match(run: Run, example: Example) -> dict:
    pred = run.outputs.get("categoria")
    expected = example.outputs.get("categoria")
    return {"key": "exact_match", "score": 1.0 if pred == expected else 0.0}

def llm_judge(run: Run, example: Example) -> dict:
    # Usar GPT-4o-mini o modelo local para juzgar calidad razonamiento
    from langchain_openai import ChatOpenAI
    judge = ChatOpenAI(model="gpt-4o-mini", temperature=0)
    prompt = f"""Evalúa si la clasificación es correcta.
Input: {example.inputs}
Expected: {example.outputs}
Predicted: {run.outputs}
Responde SOLO JSON: {{"score": 0.0-1.0, "reason": "..."}}"""
    result = judge.invoke(prompt)
    return eval(result.content)  # parse JSON

# 4. Correr evaluación
results = evaluate(
    predict,
    data=dataset.id,
    evaluators=[exact_match, llm_judge],
    experiment_prefix="diagnostico-clasificador",
    metadata={"commit": os.getenv("GITHUB_SHA")},
)

print(f"Exact Match: {results.aggregate_scores['exact_match']:.2%}")
print(f"LLM Judge: {results.aggregate_scores['llm_judge']:.2%}")

# Fail CI si baja de threshold
if results.aggregate_scores['exact_match'] < 0.85:
    exit(1)
```

### 3. Weights & Biases (Alternativa: ML-focused, Gratis Académico)

#### 3.1 Setup
```bash
pip install wandb
wandb login  # API key en https://wandb.ai/authorize
```

#### 3.2 Instrumentar Agente n8n (via Python wrapper)
```python
# n8n → Execute Command node → Python script que loggea a W&B
import wandb
import json
import sys

wandb.init(project="little-crab-agents", name=f"diagnostico-{os.getenv('EXECUTION_ID')}")

# Log input
wandb.log({"input": json.loads(sys.argv[1])})

# ... ejecutar lógica ...

# Log output + métricas
wandb.log({
    "output": result,
    "latency_ms": latency,
    "tokens_estimated": len(prompt) // 4 + len(response) // 4,
    "categoria": result.get("categoria"),
    "confianza": result.get("confianza")
})

wandb.finish()
```

#### 3.3 W&B Weave (Nuevo: Trazas + Evals Integrados)
```python
import weave
weave.init("little-crab-agents")

@weave.op()
def clasificador_diagnostico(empresa: str, reto: str) -> dict:
    # Tu lógica (llamada Ollama)
    return {"categoria": "...", "confianza": 0.9}

# Dataset Weave
@weave.dataset(name="diagnostico-golden", rows=[
    {"empresa": "FacturaFast", "reto": "Automatizar facturas PDF", "expected": "automatizacion"},
    # ...
])
def diagnostico_dataset(): pass

# Evaluación
evaluation = weave.Evaluation(
    dataset=weave.ref("diagnostico-golden").get(),
    scorers=[weave.scorers.ExactMatch("categoria")]
)
results = evaluation.evaluate(clasificador_diagnostico)
print(results)
```

### 4. Métricas n8n + Prometheus + Grafana (Infra Observabilidad)

#### 4.1 n8n Metrics (Habilitar)
```yaml
# docker-compose.yml - n8n service
environment:
  - N8N_METRICS=true
  - N8N_METRICS_PREFIX=n8n
ports:
  - "5678:5678"
  - "9090:9090"  # Prometheus scrape port
```

#### 4.2 Prometheus Config (`monitoring/prometheus.yml`)
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'n8n'
    static_configs:
      - targets: ['n8n:9090']
  
  - job_name: 'ollama'
    static_configs:
      - targets: ['ollama:11434']  # Ollama expone /metrics en :11434
  
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']
```

#### 4.3 Grafana Dashboards (Importar IDs)
- **n8n Official**: Dashboard ID 19574 (workflow executions, duration, success rate)
- **Ollama**: Dashboard ID 18649 (GPU mem, tokens/s, queue)
- **Custom AI Solution Builder**: Crear con paneles:
  - Latencia P50/P95/P99 por workflow
  - Tasa error por nodo (HTTP Request, Postgres, Slack)
  - Throughput (req/min) por webhook
  - DLQ size (query Postgres: `SELECT COUNT(*) FROM dlq_events WHERE resolved_at IS NULL`)
  - Costo estimado (tokens × $/1M)

### 5. Alertas Automáticas (Prometheus Alertmanager + n8n)

#### 5.1 Reglas (`monitoring/alerts.yml`)
```yaml
groups:
  - name: ai-solution-builder
    rules:
      - alert: HighErrorRate
        expr: rate(n8n_workflow_executions_failed_total[5m]) > 0.05
        for: 2m
        labels: { severity: critical }
        annotations:
          summary: "Error rate > 5% en {{ $labels.workflow_name }}"
      
      - alert: HighLatencyP95
        expr: histogram_quantile(0.95, rate(n8n_node_execution_duration_seconds_bucket[5m])) > 10
        for: 5m
        labels: { severity: warning }
        annotations:
          summary: "P95 latency > 10s en {{ $labels.node_name }}"
      
      - alert: DLQGrowing
        expr: increase(dlq_events_unresolved_total[1h]) > 10
        for: 1m
        labels: { severity: critical }
        annotations:
          summary: "DLQ creció >10 eventos en 1h"
      
      - alert: OllamaGPUMemoryHigh
        expr: (nvidia_gpu_memory_used_bytes / nvidia_gpu_memory_total_bytes) > 0.9
        for: 5m
        labels: { severity: warning }
        annotations:
          summary: "GPU VRAM > 90% - considerar offload o modelo menor"
```

#### 5.2 Alertmanager → n8n Webhook → Slack/Telegram
```yaml
# alertmanager.yml
route:
  receiver: 'n8n-alerts'
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h

receivers:
  - name: 'n8n-alerts'
    webhook_configs:
      - url: 'http://n8n:5678/webhook/alertmanager'
        send_resolved: true
```

**n8n Workflow `alertmanager-handler`**: Webhook → Parse → Switch(severity) → Notify multicanal.

### 6. A/B Testing Prompts/Modelos en Producción

```javascript
// En n8n: Set node antes de llamada LLM
// 10% tráfico → nuevo prompt (canary)
const isCanary = Math.random() < 0.1;
const promptVersion = isCanary ? "v2.1-canary" : "v2.0-stable";
const systemPrompt = isCanary ? $json.prompt_v2_1 : $json.prompt_v2_0;

// Log para análisis posterior
{ "prompt_version": promptVersion, "is_canary": isCanary }

// En LangSmith: filtrar por metadata.prompt_version
// Comparar: exact_match, latencia, tokens, satisfacción usuario (thumbs up/down)
```

---

## Ejercicio Guiado: Observabilidad End-to-End (2h)

### Prerrequisitos
- [ ] Cuenta LangSmith (gratis) + API Key
- [ ] Stack M02/M04 funcionando (n8n + Ollama + Postgres)
- [ ] Docker Compose con monitoring stack (opcional, ver abajo)

### Paso 1: Conectar n8n → LangSmith (30 min)
1. Añade env vars a `docker-compose.yml` (n8n service):
   ```yaml
   environment:
     - LANGCHAIN_TRACING_V2=true
     - LANGCHAIN_API_KEY=${LANGCHAIN_API_KEY}
     - LANGCHAIN_PROJECT=little-crab-diagnostico
   ```
2. `docker compose up -d n8n`
3. En n8n UI: Workflow `diagnostico-ia` → cada HTTP Request a Ollama → añade headers `X-LangChain-*`
4. Ejecuta test → ve a https://smith.langchain.com → Project `little-crab-diagnostico` → ver trazas

### Paso 2: Crear Golden Set (30 min)
1. En LangSmith UI: Datasets → New → `diagnostico-ia-clasificacion`
2. Añade 15 casos (ver `scripts/create_golden_set.py` como referencia)
3. Incluye: casos claros, edge cases (ambiguo, multi-tema, idioma混合)

### Paso 3: Correr Evaluación Manual (20 min)
```bash
# En tu máquina (Python 3.11+)
cd D:\Little Crab Solutions
python -m venv .venv-eval
.venv-eval\Scripts\activate
pip install langsmith requests

# Configurar .env
echo "LANGCHAIN_API_KEY=tu_key" > .env
echo "N8N_WEBHOOK_URL=http://localhost:5678/webhook" >> .env

# Ejecutar
python scripts/run_eval.py
# Debe imprimir scores y crear experimento en LangSmith
```

### Paso 4: Dashboard Grafana (30 min - Opcional si tienes tiempo)
```bash
# Añadir a docker-compose.yml
  prometheus:
    image: prom/prometheus:latest
    ports: ["9090:9090"]
    volumes: ["./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml"]
    networks: [llc-network]

  grafana:
    image: grafana/grafana:latest
    ports: ["3000:3000"]
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes: ["./monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards"]
    networks: [llc-network]

  node-exporter:
    image: prom/node-exporter:latest
    ports: ["9100:9100"]
    networks: [llc-network]
```
1. `docker compose up -d prometheus grafana node-exporter`
2. Grafana: http://localhost:3000 (admin/admin)
3. Importar dashboard ID 19574 (n8n) + 18649 (Ollama)
4. Crear panel custom: `dlq_events_unresolved` (query Postgres via PostgreSQL datasource)

### Paso 5: Alerta Crítica (10 min)
1. En n8n: Nuevo workflow `alertmanager-handler`
   - Webhook path: `alertmanager`
   - Parse alertas → Switch severity → notify-multichannel
2. Configurar Alertmanager (ver `monitoring/alertmanager.yml`) → webhook a n8n
3. Probar: `curl -X POST http://localhost:9093/api/v1/alerts -d '[{"labels":{"alertname":"TestAlert","severity":"critical"},"annotations":{"summary":"Test"}}]'`

---

## Recursos Verificados (Validados 2026-08-15)

| URL | Título | Descripción | Validación |
|-----|--------|-------------|------------|
| https://docs.smith.langchain.com/ | LangSmith Docs | Tracing, datasets, evaluation, prompt hub | 200 OK |
| https://docs.wandb.ai/ | W&B Docs | Weave, evaluations, model registry | 200 OK |
| https://prometheus.io/docs/prometheus/latest/configuration/configuration/ | Prometheus Config | scrape_configs, alerting rules | 200 OK |
| https://grafana.com/docs/grafana/latest/dashboards/ | Grafana Dashboards | Provisioning, variables, alerting | 200 OK |
| https://docs.n8n.io/hosting/monitoring/ | n8n Monitoring | Metrics endpoint, Prometheus integration | 200 OK |
| https://github.com/langchain-ai/langsmith-sdk/tree/main/python | LangSmith Python SDK | Client, evaluate, wrappers | 200 OK |

---

## Checkpoint de Autoevaluación

1. **Traces vs Logs**: ¿Qué información ves en un trace LangSmith que NO ves en logs n8n?
2. **Golden Set**: ¿Cuántos casos mínimos necesitas para detectar regresión en un clasificador de 6 categorías?
3. **LLM-as-Judge**: ¿Cuándo confiar en evaluación automática vs revisión humana?
4. **A/B Testing**: En n8n, ¿cómo aseguras que el 10% canary sea representativo (no sesgado)?
5. **Alertas**: Diferencia entre alerta `warning` (pager) vs `critical` (wake up). Ejemplos.

---

### Respuestas

1. **Trace**: Árbol de spans anidados (LLM call → tool call → LLM call → tool call) con timing, tokens, input/output **completos** por span. Logs n8n = plano, solo nodo actual, sin contexto de llamada padre.
2. **Mínimo**: 3-5 por categoría = 18-30 casos. Para significancia estadística (detectar caída 90%→80% con 95% confianza): ~50 casos totales. Empieza con 20, crece en cada sprint.
3. **LLM Judge**: Útil para: estilo, tono, completitud, razonamiento. **NO** para: exactitud factual, cálculos, compliance legal → esos requieren humano o evaluador determinista (regex, schema, código).
4. **Representatividad**: Hash consistente del input (ej: `hash(email + descripcion) % 100 < 10`) → mismo usuario siempre mismo bucket. No `Math.random()` por request.
5. **Warning**: Degradación gradual (latencia P95 > 10s, error rate 1-5%, DLQ +5/h) → ticket Jira/Slack, no despierta. **Critical**: Servicio roto (error rate >5%, DLQ +10/min, GPU OOM, DB down) → PagerDuty/Telegram urgente + on-call.

---

## Siguiente Paso
→ **Módulo 06**: Despliegue y Escalado — Docker Compose, Railway/Render, Dominio Custom (6h). Lleva tu stack local a producción real con HTTPS, DNS, backups y escalado horizontal.