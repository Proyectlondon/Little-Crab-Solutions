# Módulo 03: Primer Agente — Prompt-to-Action con OpenWebUI + n8n (12h)

## Objetivos de Aprendizaje
Al completar este módulo, serás capaz de:
- ✅ Diseñar un agente con arquitectura Prompt → Herramientas → Acción (ReAct simplificado)
- ✅ Configurar OpenWebUI como playground de prompts y biblioteca de plantillas versionadas
- ✅ Construir en n8n un agente que: recibe input → razona con LLM local → llama herramientas → devuelve resultado
- ✅ Implementar 3 herramientas nativas: búsqueda web, consulta SQL, envío notificación (Slack/Telegram/Email)
- ✅ Añadir guardrails: validación schema, timeouts, fallback a humano, logging estructurado

---

## Contenido Teórico-Práctico

### 1. Qué es un Agente (vs Workflow vs Prompt)

| Concepto | Definición | Ejemplo |
|----------|------------|---------|
| **Prompt** | Instrucción estática → una salida | "Resume este texto" |
| **Workflow** | Pasos fijos predefinidos (A→B→C) | Formulario → Clasificar → Guardar → Notificar |
| **Agente** | **Loop**: Observar → Pensar (LLM) → Actuar (Tool) → Repetir hasta objetivo | "Investiga competidor X, extrae pricing, genera comparativa, guárdala en Notion, avísame" |

**Arquitectura Prompt-to-Action (nuestro patrón base)**:
```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────────┐
│   INPUT     │────▶│   PLANNER    │────▶│   TOOLS     │────▶│   OUTPUT     │
│  (Usuario,  │     │  (LLM Local) │     │  (n8n nodes)│     │  (Respuesta, │
│  Webhook,   │     │  Decide qué  │     │  HTTP Req,  │     │  Acción real)│
│  Schedule)  │     │  herramienta │     │  SQL, File, │     │              │
│             │     │  usar y con  │     │  Slack...)  │     │              │
│             │     │  qué params  │     │             │     │              │
└─────────────┘     └──────────────┘     └─────────────┘     └──────────────┘
                           │                   ▲
                           │                   │
                           ▼                   │
                    ┌──────────────┐           │
                    │   MEMORIA    │───────────┘
                    │  (Contexto,  │
                    │  Historial,  │
                    │  Estado)     │
                    └──────────────┘
```

**Clave para no-devs**: El "cerebro" (LLM) solo decide **qué herramienta** y **con qué parámetros**. La **ejecución** la hace n8n (determinista, auditable, con reintentos).

### 2. OpenWebUI: Tu Laboratorio de Prompts

**Por qué OpenWebUI y no solo n8n**:
- Iteración rápida de prompts (chat interface)
- Biblioteca de plantillas con variables `{{variable}}`
- RAG integrado (sube PDFs, consulta tus docs)
- Historial de conversaciones = dataset para few-shots
- Modelos locales (Ollama) + cloud (OpenAI) en misma UI

**Setup rápido (ya hecho en M02)**:
```bash
# Si no lo tienes:
docker run -d -p 9120:8080 -v openwebui:/app/backend/data --name openwebui ghcr.io/open-webui/open-webui:main
# Accede: http://localhost:9120
```

**Estructura de plantillas recomendada**:
```
OpenWebUI → Workspace → Prompts
├── system/
│   ├── agent-planner.md          # Prompt principal del agente
│   ├── classifier.md             # Clasificador (M01)
│   └── extractor.md              # Extractor (M01)
├── tools/
│   ├── web-search.md             # Prompt para tool búsqueda
│   └── sql-query.md              # Prompt para tool SQL
└── few-shots/
    ├── intake-examples.json      # Ejemplos entrada→salida
    └── edge-cases.json           # Casos límite
```

### 3. El Prompt Planner (Cerebro del Agente)

**Plantilla base** (`prompts/system/agent-planner.md`):
```markdown
---
name: agent-planner
version: 1.0
model: qwen2.5:3b
temperature: 0.1
---

# SYSTEM PROMPT — Agente Prompt-to-Action

## ROL
Eres un planificador de acciones para un agente de automatización. Recibes una solicitud en lenguaje natural y decides QUÉ herramienta usar y CON QUÉ PARÁMETROS.

## HERRAMIENTAS DISPONIBLES
1. **web_search** — Buscar información en internet
   Parámetros: { "query": "string", "max_results": 5 }
   
2. **sql_query** — Consultar base de datos PostgreSQL (solo SELECT)
   Parámetros: { "query": "string", "params": [] }
   
3. **send_notification** — Enviar mensaje a Slack/Telegram/Email
   Parámetros: { "channel": "slack|telegram|email", "to": "string", "message": "string" }
   
4. **file_operation** — Leer/escribir archivos locales
   Parámetros: { "operation": "read|write|append", "path": "string", "content": "string?" }
   
5. **http_request** — Llamar API REST externa
   Parámetros: { "method": "GET|POST", "url": "string", "headers": {}, "body": {} }

6. **handoff_human** — Escalar a humano cuando no puedes resolver
   Parámetros: { "reason": "string", "context": {} }

## REGLAS OBLIGATORIAS
- **SOLO** responde con JSON válido en el formato exacto de abajo
- **NUNCA** inventes herramientas no listadas
- Si la solicitud es ambigua → usa `handoff_human` con reason="ambiguo"
- Si necesitas info externa → usa `web_search` ANTES de actuar
- Máximo 3 pasos por solicitud (evita loops infinitos)
- Temperature 0.1 = determinista

## FORMATO DE RESPUESTA (SOLO JSON)
```json
{
  "thought": "Razona paso a paso qué necesitas hacer",
  "tool": "nombre_herramienta",
  "parameters": { /* params según herramienta */ },
  "confidence": 0.0-1.0,
  "next_action": "continue|respond|handoff"
}
```

## EJEMPLOS (Few-shots)

### Ejemplo 1: Búsqueda + Notificación
**Input**: "Busca el precio actual de la suscripción n8n cloud y avísame por Slack"
**Output**:
```json
{
  "thought": "Usuario quiere precio actual n8n cloud + notificación Slack. Paso 1: buscar web. Paso 2: notificar.",
  "tool": "web_search",
  "parameters": { "query": "n8n cloud pricing 2024", "max_results": 3 },
  "confidence": 0.95,
  "next_action": "continue"
}
```

### Ejemplo 2: Consulta BD
**Input**: "¿Cuántos leads entraron ayer por el formulario web?"
**Output**:
```json
{
  "thought": "Necesito count de leads con fecha ayer. Tabla: leads. Campo: created_at. Uso sql_query.",
  "tool": "sql_query",
  "parameters": { "query": "SELECT COUNT(*) FROM leads WHERE DATE(created_at) = CURRENT_DATE - INTERVAL '1 day'", "params": [] },
  "confidence": 0.9,
  "next_action": "continue"
}
```

### Ejemplo 3: Ambigüedad → Humano
**Input**: "Arréglalo"
**Output**:
```json
{
  "thought": "Solicitud 'arréglalo' sin contexto ni objeto. Ambigüedad total. Escalo a humano.",
  "tool": "handoff_human",
  "parameters": { "reason": "ambiguo", "context": { "original_input": "Arréglalo" } },
  "confidence": 0.99,
  "next_action": "handoff"
}
```
```

### 4. Implementar en n8n: Arquitectura del Agente

**Estructura del Workflow** (`n8n/workflows/agent-prompt-to-action.json`):

```
┌─────────────┐
│  Webhook    │  (POST /webhook/agent)
│  "input"    │
└──────┬──────┘
       ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Set:       │────▶│  HTTP Request│────▶│  IF:        │
│  Preparar   │     │  → Ollama    │     │  tool !=    │
│  prompt     │     │  (Planner)   │     │  "respond"  │
└─────────────┘     └──────────────┘     └──────┬──────┘
                                                 │
                    ┌──────────────┐     ┌──────┴──────┐
                    │  Switch      │◀────│  (continue) │
                    │  (tool name) │     └─────────────┘
                    └──────┬───────┘
           ┌──────────────┼──────────────┐
           ▼              ▼              ▼
      ┌─────────┐   ┌──────────┐   ┌────────────┐
      │HTTP Req │   │Postgres  │   │ Slack/     │
      │(web_s.) │   │(sql_q.)  │   │Telegram    │
      └────┬────┘   └────┬─────┘   └─────┬──────┘
           │             │               │
           └─────────────┼───────────────┘
                         ▼
                  ┌─────────────┐
                  │  Merge:     │
                  │  Resultados │
                  └──────┬──────┘
                         ▼
                  ┌─────────────┐
                  │  HTTP Req   │  (Loop back to Planner)
                  │  → Ollama   │
                  └──────┬──────┘
                         │
                    ┌────┴────┐
                    ▼         ▼
               (respond)  (continue)
                    │         │
                    ▼         ▼
               Respond     Loop
               Webhook     (max 3)
```

**Nodos clave explicados**:

1. **Webhook** → Recibe `{"input": "texto usuario", "session_id": "opcional"}`
2. **Set "Preparar Prompt"** → Construye prompt completo:
   ```javascript
   // En n8n Set node, campo "full_prompt":
   `{{ $json.system_prompt }}

   HISTORIAL:
   {{ $json.history || "Sin historial previo" }}

   SOLICITUD ACTUAL: {{ $json.input }}

   RESPONDE SOLO JSON:`
   ```
3. **HTTP Request → Ollama** → Llama `/api/generate` con `format: "json"`
4. **IF "tool != respond"** → Si planner dice `next_action: "respond"`, salta a respuesta final
5. **Switch (tool name)** → Enruta a la herramienta correcta (web_search, sql_query, etc.)
6. **Herramientas** → Cada una es un sub-workflow o nodo HTTP Request/Postgres/Slack
7. **Merge** → Combina resultado de herramienta + historial
8. **Loop back** → Vuelve al Planner con nuevo contexto (máx 3 iteraciones via contador)
9. **Respond Webhook** → Devuelve respuesta final al usuario

### 5. Herramientas Nativas (Implementación Real)

#### 5.1 Web Search (via SerpAPI / DuckDuckGo HTML / Brave Search API)
**Opción gratis: DuckDuckGo HTML scraping** (n8n HTTP Request + HTML Extract):
```json
// HTTP Request node
{
  "url": "https://html.duckduckgo.com/html/?q={{ encodeURIComponent($json.query) }}",
  "method": "GET",
  "responseFormat": "string"
}
// HTML Extract node → selector: ".result__snippet" → max 5
```

#### 5.2 SQL Query (Postgres n8n)
**Nodo Postgres** (ya configurado en M02):
- Credentials: `n8n-postgres` (host: postgres, port: 5432, db: n8n)
- Query: `{{ $json.parameters.query }}`
- Parameters: `{{ $json.parameters.params }}`
- **SOLO SELECT** — validar en IF previo: `{{ !$json.parameters.query.toUpperCase().includes('INSERT') && !$json.parameters.query.toUpperCase().includes('UPDATE') && !$json.parameters.query.toUpperCase().includes('DELETE') && !$json.parameters.query.toUpperCase().includes('DROP') }}`

#### 5.3 Send Notification (Slack / Telegram / Email)
**Slack**: n8n Slack node (requiere Bot Token + Channel ID)
**Telegram**: n8n Telegram node (requiere Bot Token + Chat ID)
**Email**: n8n Send Email node (SMTP)

**Unificación via Switch**:
```javascript
// Set node antes del Switch: canal = $json.parameters.channel
// Switch: cases = "slack", "telegram", "email" → cada uno a su nodo
```

---

## Ejercicio Guiado: Agente "Analista de Leads" (3h)

**Objetivo**: Agente que recibe: "Investiga la empresa X, dime sector, tamaño aprox, y si usan n8n. Guarda en Notion y avísame por Telegram."

### Prerrequisitos
- [ ] Stack M02 funcionando (n8n + Ollama + Postgres)
- [ ] OpenWebUI accesible
- [ ] Cuenta Notion + API token (integración interna)
- [ ] Bot Telegram + Chat ID

### Paso 1: Crear Plantillas en OpenWebUI (30 min)
1. Abre OpenWebUI → Workspace → Prompts → New
2. Crea `system/agent-planner` pegando el prompt de sección 3
3. Crea `tools/web-search` con prompt:
   ```
   Eres un buscador web. Recibes query y devuelves SOLO JSON:
   {"results": [{"title": "", "url": "", "snippet": ""}, ...]}
   ```
4. Guarda ambos. Prueba en chat: selecciona `agent-planner` como system prompt, escribe test.

### Paso 2: Workflow Base en n8n (60 min)
1. Importa `n8n/workflows/agent-prompt-to-action.json` (ver repo) o construye paso a paso:
   - Webhook → Set (preparar prompt) → HTTP Request (Ollama) → IF → Switch → Tools → Merge → Loop
2. Configura credenciales: Ollama (HTTP), Postgres, Telegram, Notion
3. **Test unitario**: Webhook con `{"input": "Hola", "session_id": "test-1"}` → debe responder JSON con tool o respond

### Paso 3: Implementar Tool Web Search (30 min)
1. Sub-workflow `tool-web-search`:
   - Input: `query`, `max_results`
   - HTTP Request → DuckDuckGo HTML
   - HTML Extract → snippets
   - Set → formato JSON estándar
   - Respond Webhook
2. En Switch principal, case `web_search` → Execute Workflow `tool-web-search`

### Paso 4: Implementar Tool Notion (30 min)
1. Sub-workflow `tool-notion-create-page`:
   - Input: `parent_id`, `title`, `properties`, `children`
   - HTTP Request → Notion API `POST /v1/pages`
   - Headers: `Authorization: Bearer {{ $credentials.notionApiKey }}`, `Notion-Version: 2022-06-28`
   - Respond Webhook

### Paso 5: Test End-to-End (30 min)
```bash
curl -X POST http://localhost:5678/webhook/agent \
  -H "Content-Type: application/json" \
  -d '{"input": "Investiga Little Crab Solutions, dime sector y tamaño. Guarda en Notion y avísame por Telegram", "session_id": "test-lead-1"}'
```
Verifica:
- [ ] Busca web (logs n8n muestran HTTP a DuckDuckGo)
- [ ] Planner decide tool `notion_create` 
- [ ] Página creada en Notion
- [ ] Mensaje Telegram recibido
- [ ] Respuesta final JSON con resumen

### Paso 6: Guardrails y Logging (30 min)
1. **Timeout**: En cada HTTP Request → Options → Timeout: 30000ms
2. **Retry**: En HTTP Request → Options → Retry on fail: 2x, wait 5s
3. **Validación Schema**: Nodo **Validate JSON** después de cada tool (schema en `schemas/tool-result.json`)
4. **Contador de loops**: Set node `loop_count = {{ $json.loop_count + 1 }}` → IF `loop_count > 3` → Respond error + handoff_human
5. **Logging estructurado**: Nodo **Write Binary File** → append a `logs/agent-{{$now.format('YYYYMMDD')}}.jsonl`

---

## Recursos Verificados (Validados 2026-08-15)

| URL | Título | Descripción | Validación |
|-----|--------|-------------|------------|
| https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-base.executecommand/ | n8n Execute Workflow Node | Llamar sub-workflows como herramientas | 200 OK |
| https://developers.notion.com/reference/post-page | Notion API Create Page | Docs oficiales para tool Notion | 200 OK |
| https://core.telegram.org/bots/api | Telegram Bot API | Referencia completa para tool Telegram | 200 OK |
| https://html.duckduckgo.com/html/?q=test | DuckDuckGo HTML | Endpoint gratis para scraping búsqueda | 200 OK |
| https://github.com/open-webui/open-webui/blob/main/docs/prompts.md | OpenWebUI Prompts | Sintaxis variables, versionado, export | 200 OK |
| https://docs.n8n.io/workflows/components/ | n8n Workflow Components | IF, Switch, Merge, Loop over items | 200 OK |

---

## Checkpoint de Autoevaluación

1. **Arquitectura**: En el patrón Prompt-to-Action, ¿quién decide QUÉ herramienta y quién la EJECUTA?
2. **Loop control**: ¿Cómo evitas loops infinitos en el agente? Nombra 2 mecanismos.
3. **Seguridad SQL**: El planner genera SQL. ¿Qué validación OBLIGATORIA antes de ejecutar?
4. **Few-shots**: ¿Por qué los ejemplos en el system prompt son críticos para modelos 3B locales?
5. **Observabilidad**: ¿Qué 3 métricas mínimas deberías loggear por ejecución de agente?

---

### Respuestas

1. **LLM (Planner) decide** → n8n (Switch + Tool nodes) **ejecuta**. Separación: razonamiento estocástico vs ejecución determinista.
2. (a) Contador `loop_count` max 3 iteraciones, (b) Timeout por nodo (30s), (c) `next_action: "respond"` rompe el loop, (d) `handoff_human` por ambigüedad.
3. **Solo SELECT** — validar que query NO contiene INSERT/UPDATE/DELETE/DROP/TRUNCATE/ALTER. Mejor: allowlist de tablas/columnas.
4. Modelos 3B (qwen2.5:3b, llama3.2:3b) tienen capacidad de razonamiento limitada. Few-shots (3-5 ejemplos) "anclan" el formato JSON y patrones de decisión. Sin ellos: JSON inválido, tools inventadas, alucinaciones.
5. (a) Latencia total (ms), (b) Iteraciones hasta respuesta, (c) Tool success rate (%), (d) Handoff rate (%), (e) Token usage (approx via chars).

---

## Siguiente Paso
→ **Módulo 04**: Automatización Flujos n8n — Forms → Clasificación → Slack/Telegram (10h). Workflows de producción: triggers, error handling, versionado, testing.