# Módulo 04: Automatización Flujos n8n — Forms → Clasificación → Slack/Telegram (10h)

## Objetivos de Aprendizaje
Al completar este módulo, serás capaz de:
- ✅ Diseñar workflows n8n de producción: triggers, error handling, reintentos, idempotencia
- ✅ Construir pipeline completo: Formulario web → Clasificación IA → Enrutamiento → Notificación multicanal
- ✅ Implementar patrón "Dead Letter Queue" para fallos y reprocesamiento manual
- ✅ Versionar, testear y documentar workflows con n8n CLI y Git
- ✅ Configurar credenciales seguras (n8n credentials, variables de entorno, secretos)

---

## Contenido Teórico-Práctico

### 1. Anatomía de un Workflow de Producción

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────────┐
│   TRIGGER   │────▶│  VALIDACIÓN  │────▶│  PROCESO    │────▶│  ACCIÓN /    │
│  (Webhook,  │     │  (Schema,    │     │  (IA, DB,   │     │  NOTIFICACIÓN│
│  Schedule,  │     │  Rate limit, │     │  API, LLM)  │     │  (Slack,     │
│  Form)      │     │  Auth)       │     │             │     │  Telegram,   │
└─────────────┘     └──────────────┘     └─────────────┘     │  Email)      │
                                                               └──────────────┘
                                      │                │
                                      ▼                ▼
                              ┌─────────────┐   ┌─────────────┐
                              │  ERROR      │   │  SUCCESS    │
                              │  HANDLING   │   │  LOGGING    │
                              │  (Retry,    │   │  (Metrics,  │
                              │  DLQ, Alert)│   │  Audit)     │
                              └─────────────┘   └─────────────┘
```

**Diferencia clave hobby vs producción**:
| Aspecto | Hobby | Producción |
|---------|-------|------------|
| Error handling | Ninguno / "Fail" | Retry exponencial + DLQ + Alert |
| Idempotencia | No | Keys únicas + upsert |
| Credenciales | Hardcoded | n8n Credentials / Vault |
| Testing | Manual | Unit + Integration + Load |
| Observabilidad | Console.log | Structured logs + Metrics |
| Deploy | Copy-paste | Git + CI/CD (n8n workflow deploy) |

### 2. Pipeline: Formulario → Clasificación → Notificación

**Caso real**: Landing page Little Crab → Formulario "Diagnóstico IA" → Clasifica intención → Ruta a equipo correcto → Notifica Slack/Telegram → Guarda en Notion/CRM.

#### 2.1 Trigger: Formulario Web (n8n Form Trigger / Webhook)
```json
// Webhook node config
{
  "path": "diagnostico-ia",
  "method": "POST",
  "responseMode": "onReceived",  // Respuesta inmediata al usuario
  "options": {
    "rawBody": false,
    "allowUnauthorized": true  // Público
  }
}

// Validación Schema (Set + IF node)
{
  "required": ["nombre", "email", "empresa", "descripcion_reto"],
  "types": { "email": "email", "nombre": "string", "empresa": "string", "descripcion_reto": "string" },
  "maxLength": { "descripcion_reto": 2000 }
}
```

#### 2.2 Proceso: Clasificación IA (Reusa M01/M03)
```javascript
// HTTP Request → Ollama (qwen2.5:3b)
{
  "model": "qwen2.5:3b",
  "system": "Clasifica solicitud de diagnóstico IA en: automatizacion, analisis_datos, agente_ia, contenido, formacion, otro. Responde SOLO JSON: {\"categoria\": \"\", \"confianza\": 0.0, \"razon\": \"\", \"prioridad\": \"alta|media|baja\"}",
  "prompt": "Empresa: {{ $json.empresa }}\nReto: {{ $json.descripcion_reto }}",
  "format": "json",
  "stream": false
}
```

#### 2.3 Enrutamiento: Switch por Categoría + Prioridad
```
Switch (categoria) → Cases:
  ├─ automatizacion     → Slack #automatizacion + Asignar: Juan (dev)
  ├─ analisis_datos     → Slack #datos + Asignar: Ana (data)
  ├─ agente_ia          → Slack #ia-agents + Asignar: Pedro (IA)
  ├─ contenido          → Slack #marketing + Asignar: Laura (content)
  ├─ formacion          → Slack #academia + Asignar: Doug (architect)
  └─ otro               → Slack #general + Asignar: John (founder)

IF (prioridad === "alta") → También: Telegram urgente + Email founder
```

#### 2.4 Notificación Multicanal (Plantilla Reutilizable)
**Sub-workflow: `notify-multichannel`**
```yaml
# Inputs: canal[], mensaje, prioridad, metadata
# Nodos:
1. Switch (canal)
   ├─ slack     → Slack Node (channel, text, blocks)
   ├─ telegram  → Telegram Node (chatId, text, parse_mode: Markdown)
   ├─ email     → Send Email Node (to, subject, html)
   └─ notion    → HTTP Request → Notion API (create page en DB "Leads")
2. Merge (wait for all)
3. Respond: { "notified": ["slack", "telegram"], "failed": [] }
```

### 3. Error Handling de Producción

#### 3.1 Retry Policy (Config por nodo)
```json
// En cualquier nodo HTTP Request / Database / Custom
"retryOnFail": true,
"maxTries": 3,
"waitBetweenTries": 5000,  // 5s base
"exponentialBackoff": true  // 5s → 10s → 20s
```

#### 3.2 Dead Letter Queue (DLQ) Pattern
```
Workflow Principal
       │
       ├── Success → Continue
       │
       └── Error (Catch node) → Set (error_info) → HTTP Request → DLQ Webhook
                                    │
                                    ▼
                            ┌─────────────────┐
                            │  DLQ Storage    │
                            │  (Postgres table│
                            │  dlq_events)    │
                            └────────┬────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    ▼                ▼                ▼
              Reprocesar       Alertar            Dashboard
              (Manual/Auto)    (Slack/Email)     (Admin UI)
```

**Tabla DLQ (Postgres)**:
```sql
CREATE TABLE dlq_events (
  id BIGSERIAL PRIMARY KEY,
  workflow_id VARCHAR(100),
  workflow_name VARCHAR(200),
  execution_id VARCHAR(100),
  node_name VARCHAR(100),
  error_message TEXT,
  error_stack TEXT,
  input_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolved_by VARCHAR(100),
  resolution_notes TEXT
);
CREATE INDEX idx_dlq_unresolved ON dlq_events (resolved_at) WHERE resolved_at IS NULL;
```

#### 3.3 Alertas Críticas (Slack + Telegram)
```javascript
// Nodo Set: preparar alerta
{
  "alert_level": "critical",
  "workflow": "{{ $workflow.name }}",
  "execution": "{{ $execution.id }}",
  "node": "{{ $node.name }}",
  "error": "{{ $json.error.message }}",
  "input_preview": "{{ JSON.stringify($json.input_data).slice(0, 500) }}",
  "timestamp": "{{ $now.toISO() }}"
}
// → notify-multichannel (canales: ["slack-alerts", "telegram-oncall"])
```

### 4. Idempotencia: Evitar Duplicados

**Problema**: Webhook se reenvía (retry cliente, timeout) → mismo lead procesado 2x.

**Solución**: Idempotency Key en headers + Upsert en BD.
```javascript
// 1. Cliente envía: Header "Idempotency-Key: <uuid-v4>"
// 2. n8n: Webhook node → "Options → Raw Body: true" → extraer header
// 3. Set node: idempotency_key = {{ $request.headers["idempotency-key"] }}

// 4. Postgres: UPSERT (INSERT ... ON CONFLICT DO NOTHING)
INSERT INTO leads (idempotency_key, nombre, email, empresa, descripcion, categoria, created_at)
VALUES ({{ $json.idempotency_key }}, {{ $json.nombre }}, {{ $json.email }}, {{ $json.empresa }}, {{ $json.descripcion_reto }}, {{ $json.categoria }}, NOW())
ON CONFLICT (idempotency_key) DO NOTHING
RETURNING id;

// 5. IF (rowCount === 0) → "Ya procesado" → Respond 200 OK { "status": "duplicate" }
//    ELSE → Continuar pipeline normal
```

### 5. Testing Workflows n8n

#### 5.1 Unit Testing (n8n CLI + Jest)
```bash
# Instalar n8n CLI
npm install -g n8n-cli

# Exportar workflow para tests
n8n export:workflow --id=<workflow_id> --output=workflows/diagnostico-ia.json

# Test structure (workflows/__tests__/diagnostico-ia.test.js)
const { executeWorkflow } = require('n8n-workflow-test-utils');

test('diagnostico-ia: formulario válido → clasificación → notificación', async () => {
  const input = {
    nombre: "Test User",
    email: "test@example.com",
    empresa: "Test Corp",
    descripcion_reto: "Necesito automatizar facturas entrantes"
  };
  
  const result = await executeWorkflow('diagnostico-ia', input, {
    mockNodes: {
      'HTTP Request Ollama': { response: { categoria: 'automatizacion', confianza: 0.92 } },
      'Slack': { success: true },
      'Notion': { success: true }
    }
  });
  
  expect(result.categoria).toBe('automatizacion');
  expect(result.notified).toContain('slack');
  expect(result.lead_id).toBeDefined();
});
```

#### 5.2 Integration Testing (Entorno Staging)
```bash
# Levantar stack staging (docker-compose.staging.yml)
docker compose -f docker-compose.staging.yml up -d

# Ejecutar suite de tests contra staging
npm run test:integration

# Tests cubren:
# - Webhook público responde 200
# - Clasificación IA coincide con golden set (10 casos)
# - Notificaciones llegan a canales test
# - DLQ captura errores simulados
# - Idempotencia: mismo key → 1 solo lead
```

#### 5.3 Load Testing (k6)
```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },  // Ramp up
    { duration: '1m', target: 50 },   // Stay at 50 RPS
    { duration: '30s', target: 0 }    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],  // 95% < 2s
    http_req_failed: ['rate<0.01']      // < 1% errors
  }
};

export default function() {
  const payload = JSON.stringify({
    nombre: `Load Test ${__VU}`,
    email: `load${__VU}@test.com`,
    empresa: "Load Test Inc",
    descripcion_reto: "Prueba de carga automatizada"
  });
  
  const headers = { 
    'Content-Type': 'application/json',
    'Idempotency-Key': `load-${__VU}-${__ITER}`
  };
  
  const res = http.post('http://staging:5678/webhook/diagnostico-ia', payload, { headers });
  check(res, { 'status 200': (r) => r.status === 200 });
  sleep(1);
}
```

### 6. Versionado y Deploy (Git + n8n CLI)

#### 6.1 Estructura Repo
```
D:\Little Crab Solutions\
├── n8n/
│   ├── workflows/
│   │   ├── diagnostico-ia.json           # Producción
│   │   ├── diagnostico-ia.staging.json   # Staging (overrides)
│   │   ├── notify-multichannel.json      # Sub-workflow compartido
│   │   └── dlq-handler.json              # Workflow DLQ
│   ├── credentials-template.json         # Sin secretos (plantilla)
│   ├── docker-compose.yml
│   ├── docker-compose.staging.yml
│   └── package.json                      # Scripts deploy
```

#### 6.2 Scripts Deploy (package.json)
```json
{
  "scripts": {
    "deploy:staging": "n8n import:workflow --input=workflows/diagnostico-ia.staging.json --url=http://staging:5678 --token=$N8N_STAGING_TOKEN",
    "deploy:prod": "n8n import:workflow --input=workflows/diagnostico-ia.json --url=https://n8n.littlecrab.solutions --token=$N8N_PROD_TOKEN",
    "export:all": "n8n export:workflow --all --output=workflows/",
    "test": "jest",
    "test:integration": "jest --config=jest.integration.config.js",
    "load": "k6 run load-test.js"
  }
}
```

#### 6.3 GitOps Flow
```bash
# 1. Desarrollas en local (n8n UI local)
# 2. Exportas: npm run export:all
# 3. Commit + Push
git add n8n/workflows/
git commit -m "feat(diagnostico): añade prioridad alta → telegram urgente
- Switch node: nuevo case prioridad.alta
- Sub-workflow notify-multichannel: soporta canal telegram-urgente
- Tests: 3 casos nuevos en golden set"
git push origin feature/diagnostico-prioridad-alta

# 4. PR → Review → Merge a main
# 5. GitHub Action / n8n workflow deploy → Staging automático
# 6. Smoke test en staging → Deploy manual a prod (botón en n8n UI o script)
```

---

## Ejercicio Guiado: Pipeline Completo "Diagnóstico IA" (4h)

### Prerrequisitos
- [ ] Stack M02 funcionando (n8n + Ollama + Postgres)
- [ ] Cuenta Slack + Bot Token + Canales: #automatizacion, #datos, #ia-agents, #marketing, #academia, #general, #alerts
- [ ] Bot Telegram + Chat IDs (canal normal + canal urgente)
- [ ] Notion API Token + Database ID "Leads"
- [ ] Postgres: tabla `leads` + `dlq_events` creadas (ver SQL abajo)

### Paso 1: Preparar Base de Datos (15 min)
```sql
-- En Postgres (n8n database o aparte)
CREATE TABLE leads (
  id BIGSERIAL PRIMARY KEY,
  idempotency_key VARCHAR(100) UNIQUE NOT NULL,
  nombre VARCHAR(200),
  email VARCHAR(200),
  empresa VARCHAR(200),
  descripcion TEXT,
  categoria VARCHAR(50),
  prioridad VARCHAR(20),
  confianza DECIMAL(3,2),
  razon TEXT,
  creado_en TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_leads_categoria ON leads(categoria);
CREATE INDEX idx_leads_creado_en ON leads(creado_en DESC);

-- DLQ table (ver sección 3.2)
```

### Paso 2: Crear Credenciales en n8n (15 min)
1. n8n UI → Credentials → New
2. **Postgres**: Host `postgres`, Port `5432`, DB `n8n`, User `n8n`, Password `n8n_password`
3. **Slack API**: Bot Token (xoxb-...), scopes: `chat:write, channels:read`
4. **Telegram API**: Bot Token (desde @BotFather)
5. **Notion API**: Integration Token (secret_xxx)
6. **Ollama API**: Ninguna (HTTP Request directo)

### Paso 3: Construir Workflow Principal (90 min)
**Nodos en orden**:
1. **Webhook** → `diagnostico-ia`, POST, responseMode: onReceived
2. **Set** → Validar + Extraer `idempotency_key` de header
3. **IF** → ¿idempotency_key existe? No → Respond 400 "Missing Idempotency-Key"
4. **Postgres** → UPSERT leads (ON CONFLICT DO NOTHING) → `lead_id`, `is_new`
5. **IF** → `is_new === false` → Respond 200 `{ "status": "duplicate", "lead_id": ... }`
6. **HTTP Request** → Ollama clasificación (ver sección 2.2)
7. **Set** → Limpiar respuesta Ollama → `categoria`, `confianza`, `prioridad`
8. **Switch** (categoria) → 6 branches → cada una: **Set** (asignar responsable, canal Slack)
9. **Merge** (Wait for all) → Datos unificados
10. **Execute Workflow** → `notify-multichannel` (canales: slack + notion + telegram si prioridad alta)
11. **Respond Webhook** → `{ "status": "ok", "lead_id": ..., "categoria": ..., "prioridad": ... }`

### Paso 4: Sub-workflow `notify-multichannel` (45 min)
1. **Webhook** (internal) → inputs: `canales[]`, `mensaje`, `lead_data`
2. **Split In Batches** (item: canal) → Loop sobre cada canal
3. **Switch** (canal) → Slack / Telegram / Notion / Email
4. **Merge** → Recopilar resultados `{ "notified": [], "failed": [] }`
5. **Respond** → Resultado

### Paso 5: Error Handling + DLQ (30 min)
1. **Catch** node (conectado a TODOS los nodos que pueden fallar: Ollama, Slack, Notion, Telegram, Postgres)
2. **Set** → Preparar `dlq_event` (workflow, execution, node, error, input_data)
3. **Postgres** → INSERT INTO dlq_events
4. **Execute Workflow** → `notify-multichannel` (canales: ["slack-alerts", "telegram-oncall"])
5. **Respond Webhook** (error) → `{ "status": "error", "message": "Procesado en background, equipo notificado" }`

### Paso 6: Tests y Validación (30 min)
```bash
# Test 1: Formulario válido
curl -X POST http://localhost:5678/webhook/diagnostico-ia \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: test-$(date +%s)-1" \
  -d '{"nombre":"Juan Test","email":"juan@test.com","empresa":"Test SA","descripcion_reto":"Automatizar facturas PDF"}'

# Test 2: Duplicado (mismo key)
curl -X POST ... -H "Idempotency-Key: test-12345-1" -d '{...}'

# Test 3: Prioridad alta → Telegram urgente
curl ... -H "Idempotency-Key: test-12345-2" -d '{"descripcion_reto":"URGENTE: Se cayó producción, necesito agente que monitorée 24/7"}'

# Verificar:
# - Lead en Postgres (SELECT * FROM leads ORDER BY creado_en DESC LIMIT 5)
# - Mensaje en Slack canal correcto
# - Página en Notion "Leads"
# - Telegram normal + urgente según prioridad
# - DLQ vacía (SELECT * FROM dlq_events WHERE resolved_at IS NULL)
```

---

## Recursos Verificados (Validados 2026-08-15)

| URL | Título | Descripción | Validación |
|-----|--------|-------------|------------|
| https://docs.n8n.io/workflows/error-handling/ | n8n Error Handling | Catch node, retry, continue on fail | 200 OK |
| https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-base.executecommand/ | Execute Workflow Node | Llamar sub-workflows, pasar datos | 200 OK |
| https://docs.n8n.io/integrations/builtin/credentials/ | n8n Credentials | Gestión segura: Postgres, Slack, Telegram, etc. | 200 OK |
| https://developers.notion.com/reference/post-page | Notion Create Page | API para tool Notion | 200 OK |
| https://core.telegram.org/bots/api#sendmessage | Telegram sendMessage | Parámetros: chat_id, text, parse_mode | 200 OK |
| https://api.slack.com/methods/chat.postMessage | Slack chat.postMessage | Blocks, threads, channel | 200 OK |
| https://grafana.com/docs/k6/latest/ | k6 Load Testing | Scripting, thresholds, CI integration | 200 OK |

---

## Checkpoint de Autoevaluación

1. **Idempotencia**: ¿Por qué `ON CONFLICT DO NOTHING` + `RETURNING` es mejor que `SELECT` previo?
2. **DLQ**: ¿Qué 3 campos MÍNIMOS debe tener un evento DLQ para ser reprocesable?
3. **Retry vs Catch**: ¿Cuándo usar `retryOnFail` en el nodo vs nodo `Catch` separado?
4. **Testing**: En test unitario, ¿qué nodos mockeas y cuáles NO?
5. **Deploy**: Diferencia entre `n8n import:workflow` (CLI) y importar desde UI.

---

### Respuestas

1. **Atómico**: `SELECT` + `INSERT` = race condition (dos requests simultáneos pasan el SELECT). `UPSERT` es atómico en PG. `RETURNING` te da el `id` sin query extra.
2. **Mínimos**: `input_data` (JSON completo para reprocesar), `error_message` + `error_stack` (diagnóstico), `workflow_id` + `node_name` (dónde falló). Opcionales: `execution_id`, `created_at`.
3. `retryOnFail`: errores transitorios de red/timeout (HTTP 5xx, DB lock, DNS). `Catch`: errores de lógica, validación, auth, formato — requieren intervención humana o ruta alternativa.
4. **Mockeas**: Externos (Ollama, Slack, Notion, Telegram, HTTP APIs). **NO mockeas**: Lógica interna (IF, Switch, Set, Merge, Postgres UPSERT si usas test DB real).
5. CLI = automatizable en CI/CD, idempotente, versionado. UI = manual, interactivo, útil para one-offs. CLI sobrescribe por defecto; UI pregunta.

---

## Siguiente Paso
→ **Módulo 05**: Testing y Observabilidad — LangSmith / W&B (6h). Instrumenta, traza, evalúa y mejora tus agentes y workflows con métricas reales.