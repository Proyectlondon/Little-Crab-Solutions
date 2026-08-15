# Módulo 01: Fundamentos de IA Aplicada (4-6h)

## Objetivos de Aprendizaje
Al completar este módulo, serás capaz de:
- ✅ Explicar la diferencia entre IA tradicional, ML, DL y GenAI con ejemplos de negocio
- ✅ Identificar cuándo usar cada tipo de IA según el problema (clasificación, generación, predicción, razonamiento)
- ✅ Evaluar riesgos: alucinaciones, sesgo, privacidad, dependencia de proveedores
- ✅ Seleccionar el modelo correcto (local vs cloud, tamaño, licencia) para un caso de uso dado
- ✅ Dibujar el flujo de datos de una solución IA end-to-end (input → preprocessing → modelo → post-proc → output)

---

## Contenido Teórico-Práctico

### 1. ¿Qué es IA Aplicada? (No solo chatbots)
La IA Aplicada es la capa que conecta **modelos** con **problemas de negocio reales**. No se trata de "usar ChatGPT", sino de diseñar sistemas donde la IA es un componente más: recibe datos, produce salidas, y esas salidas disparan acciones (guardar en BD, notificar, generar documento, llamar API).

**Analogía visual**: Piensa en la IA como un "motor de razonamiento" que enchufas en tu flujo de trabajo, igual que enchufas una base de datos o un servicio de email.

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────────┐
│   DATOS     │────▶│  PREPROCESS  │────▶│   MODELO    │────▶│  POST-PROC   │
│  (Entrada)  │     │  (Limpieza,  │     │  (Razonam.) │     │  (Formato,   │
│             │     │  Chunking,   │     │             │     │  Validación, │
│             │     │  Embedding)  │     │             │     │  Acción)     │
└─────────────┘     └──────────────┘     └─────────────┘     └──────────────┘
                                                                       │
                                                                       ▼
                                                                ┌──────────────┐
                                                                │  ACCIÓN REAL │
                                                                │  (Slack, BD, │
                                                                │  Email, API) │
                                                                └──────────────┘
```

### 2. Taxonomía Rápida para Decidir Qué Usar

| Tipo | Qué hace | Cuándo usarlo | Ejemplo negocio |
|------|----------|---------------|-----------------|
| **Clasificación** | Etiquetar: A, B, C | Triage tickets, detectar spam, sentiment | "Clasificar leads: caliente/tibio/frío" |
| **Extracción** | Sacar campos estructurados | Facturas, contratos, CVs | "Extraer: proveedor, monto, fecha, IVA" |
| **Generación** | Crear texto/código/imagen | Redactar emails, propuestas, código | "Escribir propuesta comercial a partir de brief" |
| **RAG (Retrieval-Augmented)** | Responder con tus datos | Chat interno, base de conocimiento | "¿Cuál es nuestra política de gastos?" |
| **Agentes (Tool-use)** | Planificar + ejecutar pasos | Automatizaciones multi-paso | "Leer formulario → buscar en Notion → crear task → notificar" |

### 3. Modelos Locales vs Cloud: Decisión Práctica

| Factor | Local (Ollama/LM Studio) | Cloud (OpenAI/Anthropic/Gemini) |
|--------|---------------------------|----------------------------------|
| **Privacidad** | 100% tus datos | Sale de tu red |
| **Costo** | Hardware once (GPU) | Por token / suscripción |
| **Latencia** | ~50-500ms (GPU) | ~200-2000ms (red) |
| **Control versión** | Tú decides cuándo actualizar | Proveedor decide |
| **Capacidad** | Limitado a tu VRAM/RAM | Casi ilimitada |
| **Setup** | 15 min + descarga modelo | API key inmediata |

**Regla de oro para AI Solution Builder**: Empieza **local** (Ollama + OpenWebUI). Si el modelo local no resuelve, sube a cloud *solo para esa tarea*. Herramienta: `n8n` decide ruteo automático.

### 4. Prompt Engineering Esencial (No magia, ingeniería)

**Estructura universal de prompt efectivo**:
```
ROL: "Eres un analista de requisitos senior..."
CONTEXTO: "Trabajamos en Little Crab Solutions, PYMEs Latam..."
TAREA: "Clasifica esta solicitud en: [lista]"
FORMATO: "Responde SOLO JSON: {\"categoria\": \"\", \"confianza\": 0.0}"
EJEMPLOS: (2-3 few-shots)
RESTRICCIONES: "No inventes categorías. Si dudas, 'otro'."
```

**Truco visual para no-devs**: Usa **OpenWebUI** → pestaña "Prompts" → guarda plantillas → reusa con variables `{{input}}`.

### 5. Riesgos que Debes Gestionar (Checklist mental)

- [ ] **Alucinación**: El modelo inventa datos → Mitigación: RAG + validación schema + "no sé" permitido
- [ ] **Sesgo**: Respuestas sesgadas por entrenamiento → Mitigación: Prompts neutrales, revisión humana en decisiones críticas
- [ ] **Fuga de datos**: Enviar info sensible a cloud → Mitigación: Local-first, anonimización previa
- [ ] **Dependencia proveedor**: Modelo deja de existir / sube precio → Mitigación: Abstracción via n8n/Ollama, modelos abiertos (Llama, Qwen, Gemma)
- [ ] **Costo oculto**: Tokens de entrada/salida, embeddings → Mitigación: Caché semántico, chunking inteligente, modelos pequeños

---

## Ejercicio Guiado: Tu Primer Clasificador Local (30 min)

**Objetivo**: Crear en n8n un flujo que reciba un texto, lo clasifique con modelo local (Ollama), y guarde resultado en Google Sheets / Notion / CSV.

### Prerrequisitos (verifica antes de empezar)
- [ ] Ollama corriendo en `http://localhost:11434` → `ollama list` muestra `llama3.2:3b` o `qwen2.5:3b`
- [ ] n8n corriendo en `http://localhost:5678`
- [ ] OpenWebUI en `http://localhost:9120` (opcional, para probar prompts)

### Paso 1: Probar el modelo en OpenWebUI (5 min)
1. Abre `http://localhost:9120`
2. Selecciona modelo `qwen2.5:3b` (rápido, 2GB VRAM)
3. Pega este prompt en System Prompt:
   ```
   Eres un clasificador de solicitudes de PYMEs. Categorías válidas:
   - automatizacion
   - analisis_datos
   - contenido_marketing
   - atencion_cliente
   - otro
   
   Responde SOLO JSON: {"categoria": "...", "confianza": 0.0, "razon": "..."}
   ```
4. Prueba con: *"Necesito que los leads de mi web vayan automático a mi CRM y me avisen por WhatsApp"*
5. Verifica que responde JSON válido

### Paso 2: Crear workflow en n8n (15 min)
1. En n8n: **New Workflow** → nombre: `Clasificador Solicitudes IA`
2. Añade nodo **Webhook** → path: `clasificar` → método POST
3. Añade nodo **HTTP Request** (o Ollama node si lo tienes):
   - URL: `http://host.docker.internal:11434/api/generate` (Docker) o `http://localhost:11434/api/generate`
   - Method: POST
   - Headers: `Content-Type: application/json`
   - Body (JSON):
     ```json
     {
       "model": "qwen2.5:3b",
       "prompt": "={{ $json.body.texto }}",
       "system": "Eres un clasificador de solicitudes de PYMEs. Categorías válidas: automatizacion, analisis_datos, contenido_marketing, atencion_cliente, otro. Responde SOLO JSON: {\"categoria\": \"...\", \"confianza\": 0.0, \"razon\": \"...\"}",
       "stream": false,
       "format": "json"
     }
     ```
4. Añade nodo **Set** para limpiar respuesta:
   - `categoria` = `{{ JSON.parse($json.response).categoria }}`
   - `confianza` = `{{ JSON.parse($json.response).confianza }}`
   - `razon` = `{{ JSON.parse($json.response).razon }}`
   - `texto_original` = `{{ $json.body.texto }}`
   - `timestamp` = `{{ $now }}`
5. Añade nodo **Google Sheets** / **Notion** / **Write Binary File** (CSV) para guardar
6. Conecta: Webhook → HTTP Request → Set → Guardar
7. **Save** → **Activate** (toggle arriba a la derecha)

### Paso 3: Probar end-to-end (5 min)
```bash
curl -X POST http://localhost:5678/webhook/clasificar \
  -H "Content-Type: application/json" \
  -d '{"texto": "Quiero automatizar facturas: que lean PDF, saquen datos y suban a contabilidad"}'
```
Deberías ver JSON con categoría `automatizacion` y confianza > 0.8.

### Paso 4: Documentar tu ejercicio (5 min)
Crea archivo `modulo-01-ejercicio-clasificador.md` en tu carpeta del curso con:
- Captura del workflow n8n (Export → copiar JSON → pegar aquí)
- 3 ejemplos de entrada + salida real
- Qué cambiarías para producción (autenticación, rate limit, logging)

---

## Recursos Verificados (Validados 2026-08-15)

| URL | Título | Descripción | Validación |
|-----|--------|-------------|------------|
| https://ollama.com/library/qwen2.5 | Qwen2.5 en Ollama | Modelo 3B/7B/14B/32B, multilingüe, bueno en razonamiento | 200 OK, descarga verificada |
| https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-base.httprequest/ | n8n HTTP Request Node | Docs oficiales para llamar APIs (incluye Ollama) | 200 OK |
| https://github.com/open-webui/open-webui | OpenWebUI GitHub | Interfaz web para modelos locales, prompts, RAG | 200 OK, stars 80k+ |
| https://cookbook.openai.com/examples/classification | OpenAI Classification Cookbook | Patrones de clasificación aplicables a cualquier modelo | 200 OK |
| https://huggingface.co/docs/transformers/en/llm_tutorial | HF LLM Tutorial | Fundamentos teóricos: tokenización, sampling, chat templates | 200 OK |

---

## Checkpoint de Autoevaluación

**Responde por escrito (3-5 min) y verifica con las respuestas abajo:**

1. **Diferencia clave**: ¿Por qué "IA Aplicada" ≠ "usar ChatGPT"?
2. **Decisión modelo**: Tu cliente tiene datos médicos sensibles y 0 presupuesto cloud. ¿Local o cloud? ¿Qué modelo Ollama recomiendas?
3. **Prompt structure**: Escribe el prompt SYSTEM para un extractor de datos de facturas (campos: proveedor, monto, fecha, IVA, moneda). Formato: JSON estricto.
4. **Riesgo alucinación**: En tu clasificador del ejercicio, ¿cómo detectarías si el modelo inventa una categoría que no existe?
5. **Arquitectura n8n**: En el ejercicio, ¿qué nodo hace de "post-procesamiento" y por qué es necesario?

---

### Respuestas (Auto-corrección)

1. **IA Aplicada** = sistema completo (datos → preproc → modelo → post-proc → acción real). "Usar ChatGPT" = solo el modelo, sin integración ni control.
2. **Local obligatorio** (datos médicos). Modelo: `llama3.2:3b` o `qwen2.5:3b` (caben en 8GB VRAM, buenos en español). Si necesitas más precisión: `llama3.1:8b` (requiere ~10GB VRAM o offload CPU).
3. ```text
   Eres un extractor de datos de facturas en español. Extrae EXACTAMENTE estos campos:
   - proveedor (string)
   - monto_total (number, solo dígitos y punto decimal)
   - fecha (ISO 8601: YYYY-MM-DD)
   - iva (number, porcentaje ej: 21.0)
   - moneda (ISO 4217: EUR, USD, COP, MXN)
   
   Si un campo no aparece, usa null. NO inventes. Responde SOLO JSON válido.
   ```
4. Validar schema JSON de salida (n8n: node **Validate JSON** o **IF** comprobando `categoria` en lista permitida). Si no está en lista → flag `revision_humana: true`.
5. Nodo **Set** = post-procesamiento. Limpia la respuesta cruda de Ollama (que trae `response`, `done`, `context`) y extrae solo campos útiles tipados para la siguiente acción (guardar, notificar, decidir).

---

## Siguiente Paso
→ **Módulo 02**: Stack Técnico Básico (n8n, Ollama, Docker, Git) — instala, configura y versiona tu entorno de trabajo.