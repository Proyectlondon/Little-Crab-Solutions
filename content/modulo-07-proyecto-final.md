# Módulo 07: Proyecto Final — Agente de Intake (Formulario → Plan → Notion → Discord + Gloria) (20h)

## Objetivos de Aprendizaje
Al completar este módulo, serás capaz de:
- ✅ Integrar todo el stack: n8n (orquestación), Ollama (razonamiento), Hyperframes (video), Deepgram Gloria (TTS)
- ✅ Diseñar un agente end-to-end que: intake → análisis → plan técnico → documentación → notificación multicanal + video demo
- ✅ Implementar human-in-the-loop para validación crítica antes de acción irreversible
- ✅ Generar video vertical automático (Reels/TikTok) con Hyperframes + Gloria TTS
- ✅ Entregar proyecto validado: código, docs, tests, deploy, video demo, guía de uso

---

## Contexto del Proyecto: "Agente de Intake Little Crab"

**Problema real**: Clientes llenan formulario "Diagnóstico IA" → equipo pierde 2h/manual analizando, redactando plan, creando docs, notificando.

**Solución**: Agente autónomo que en < 3 min entrega:
1. **Análisis estructurado** del reto (categoría, complejidad, stack sugerido, riesgos)
2. **Plan técnico** por fases (MVP → v1 → v2) con estimación horas/costo
3. **Página Notion** lista para cliente (entregable profesional)
4. **Notificación Discord/Slack/Telegram** al equipo con resumen + enlace Notion
5. **Video vertical 45s** (Hyperframes + Gloria) explicando la propuesta → para redes/email

---

## Arquitectura Completa

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AGENTE INTAKE - FLUJO COMPLETO                       │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────┐     ┌─────────────┐     ┌──────────────┐     ┌────────────────┐
│ FORMULARIO│────▶│  VALIDACIÓN │────▶│  CLASIFICADOR│────▶│  PLANNER LLM   │
│  (Web)   │     │  (Schema,   │     │  (Ollama:    │     │  (qwen2.5:7b   │
│          │     │  Idempotent)│     │   categoria,  │     │   plan técnico │
└──────────┘     └─────────────┘     │   prioridad)  │     └───────┬────────┘
                                     └──────────────┘             │
                                                                   ▼
┌──────────────────┐     ┌─────────────────┐     ┌─────────────────────────┐
│  VIDEO DEMO      │◀────│  HYPERFRAMES    │◀────│  GENERADOR CONTENIDO    │
│  (Gloria TTS)    │     │  (Render MP4)   │     │  (Prompt → Script JSON) │
└────────┬─────────┘     └─────────────────┘     └────────────┬────────────┘
         │                                                   │
         ▼                                                   ▼
┌──────────────────┐     ┌─────────────────┐     ┌─────────────────────────┐
│  DISCORD/        │     │   NOTION API    │     │   HUMAN REVIEW GATE     │
│  SLACK/TELEGRAM  │     │   (Página       │     │   (Opcional: validar    │
│  (Notificación)  │     │    cliente)     │     │    plan antes de crear) │
└──────────────────┘     └─────────────────┘     └─────────────────────────┘
         │                                                   │
         └───────────────────────┬───────────────────────────┘
                                 ▼
                    ┌─────────────────────────┐
                    │      DLQ / LOGGING      │
                    │  (LangSmith + Postgres) │
                    └─────────────────────────┘
```

---

## Especificación Técnica Detallada

### 1. Input: Formulario Web (Ya existe en M04)
```json
POST /webhook/intake
{
  "idempotency_key": "uuid-v4",
  "nombre": "Juan Pérez",
  "email": "juan@empresa.com",
  "empresa": "LogiFast SA",
  "tamano_empresa": "10-50",
  "sector": "logística",
  "descripcion_reto": "Necesitamos automatizar la lectura de albaranes PDF que llegan por email, extraer datos (proveedor, fecha, productos, cantidades) y subirlos a nuestro ERP. Hoy lo hace una persona a tiempo completo.",
  "presupuesto_estimado": "5000-15000",
  "urgencia": "alta",
  "contacto_preferido": "email"
}
```

### 2. Clasificador (Reusa M01/M04)
```json
// Output esperado
{
  "categoria": "automatizacion",
  "subcategoria": "document_processing",
  "complejidad": "media",
  "prioridad": "alta",
  "stack_sugerido": ["n8n", "Ollama (qwen2.5:7b)", "Mindee/PDF.co API", "ERP API"],
  "riesgos": ["Calidad PDF variable", "API ERP no documentada", "Volumen picos"],
  "estimacion_horas": { "mvp": 40, "v1": 80, "v2": 120 },
  "confianza": 0.92
}
```

### 3. Planner LLM (Prompt Principal)
**Archivo**: `prompts/system/intake-planner.md`

```markdown
---
name: intake-planner
version: 2.0
model: qwen2.5:7b  # 7B para mejor razonamiento (requiere ~10GB VRAM u offload)
temperature: 0.2
max_tokens: 4096
---

# SYSTEM PROMPT — Agente Intake Little Crab Solutions

## ROL
Eres un **Arquitecto de Soluciones IA Senior** en Little Crab Solutions. Recibes un diagnóstico estructurado y produces un **Plan Técnico Completo** listo para entregar a cliente.

## ENTRADA (JSON)
```json
{
  "cliente": { "nombre", "empresa", "tamano", "sector", "presupuesto", "urgencia" },
  "reto": { "descripcion", "categoria", "subcategoria", "complejidad", "prioridad", "stack_sugerido", "riesgos", "estimacion_horas" }
}
```

## SALIDA REQUERIDA (SOLO JSON VÁLIDO)
```json
{
  "resumen_ejecutivo": "string (2-3 frases, lenguaje negocio, sin jerga técnica)",
  "analisis_tecnico": {
    "problema_central": "string",
    "solucion_propuesta": "string",
    "arquitectura_high_level": "string (descripción textual, sin diagramas)",
    "componentes_clave": [{"nombre": "", "tecnologia": "", "justificacion": ""}],
    "flujos_datos": "string (input → proceso → output → acción)"
  },
  "plan_fases": [
    {
      "fase": "MVP",
      "objetivo": "string",
      "entregables": ["string"],
      "tareas": [{"id": "", "descripcion": "", "horas": 0, "responsable": "", "dependencias": []}],
      "criterios_aceptacion": ["string"],
      "riesgos_mitigacion": [{"riesgo": "", "mitigacion": ""}],
      "horas_totales": 0,
      "costo_estimado_usd": 0
    },
    { "fase": "v1", ... },
    { "fase": "v2", ... }
  ],
  "inversion_total": { "horas": 0, "costo_usd": 0, "rango": "min-max" },
  "proxima_accion": "string (CTA claro: 'Agendar kickoff 30 min', 'Enviar NDA', etc.)",
  "video_script": {
    "hook": "string (primeros 3s: problema doloroso)",
    "solucion": "string (qué hace el agente en 1 frase)",
    "beneficio": "string (ahorro tiempo/dinero, número concreto)",
    "cta": "string ('Agenda tu diagnóstico gratis en littlecrab.solutions')",
    "duracion_estimada_seg": 45
  }
}
```

## REGLAS OBLIGATORIAS
- **SOLO JSON** — nada de markdown, explicaciones, ni texto extra
- **Números realistas** — horas basadas en complejidad (baja=20-40, media=40-80, alta=80-160)
- **Costo** — $50-75/h según senioridad; rango ±30%
- **Lenguaje cliente** — resumen ejecutivo SIN términos: RAG, embedding, vector DB, LLM, prompt engineering
- **Stack** — siempre local-first (n8n, Ollama), cloud solo si justificado
- **Video script** — máximo 45s, vertical, Gloria TTS compatible (frases cortas, pausas naturales)

## FEW-SHOTS (Ejemplos)

### Ejemplo 1: Automatización Facturas (como el caso real)
**Input**: { "cliente": {"empresa": "LogiFast", "sector": "logística", ...}, "reto": {"categoria": "automatizacion", "subcategoria": "document_processing", "complejidad": "media", "descripcion": "Leer albaranes PDF email → extraer datos → ERP", ...} }
**Output**: { "resumen_ejecutivo": "Automatizaremos la captura de albaranes PDF que llegan por email, extrayendo proveedor, fecha, productos y cantidades para subirlos directo a tu ERP. Eliminamos 40h/semana de trabajo manual.", "analisis_tecnico": { "problema_central": "Proceso manual propenso a errores y cuellos de botella en picos de volumen", "solucion_propuesta": "Pipeline n8n: IMAP → PDF parser (Mindee) → Validación LLM (Ollama) → ERP API", "arquitectura_high_level": "Email trigger → Extracción estructurada → Validación IA → Integración ERP bidireccional", "componentes_clave": [{"nombre": "Email Watcher", "tecnologia": "n8n IMAP", "justificacion": "Gratis, nativo, filtrado por remitente/asunto"}, {"nombre": "PDF Parser", "tecnologia": "Mindee API", "justificacion": "99% precisión en tablas, maneja PDFs escaneados"}, {"nombre": "Validador IA", "tecnologia": "Ollama qwen2.5:7b", "justificacion": "Local, privacidad, corrige errores OCR con contexto negocio"}], "flujos_datos": "Email entrante → Adjunto PDF → Mindee extrae JSON → LLM valida/completa → POST ERP API → Respuesta → Log + Notificación" }, "plan_fases": [{"fase": "MVP", "objetivo": "Procesar 90% albaranes estándar sin intervención humana", "entregables": ["Workflow n8n desplegado", "Credenciales Mindee/ERP configuradas", "Dashboard monitorización"], "tareas": [{"id": "T1", "descripcion": "Setup n8n + IMAP watcher filtros", "horas": 4, "responsable": "dev", "dependencias": []}, {"id": "T2", "descripcion": "Integración Mindee API + tests 20 PDFs reales", "horas": 8, "responsable": "dev", "dependencias": ["T1"]}, {"id": "T3", "descripcion": "Prompt validador LLM + few-shots errores comunes", "horas": 6, "responsable": "ia", "dependencias": ["T2"]}, {"id": "T4", "descripcion": "Connector ERP (API/DB) + mapeo campos", "horas": 12, "responsable": "dev", "dependencias": ["T1"]}, {"id": "T5", "descripcion": "End-to-end test + alertas fallos", "horas": 4, "responsable": "qa", "dependencias": ["T3", "T4"]}, {"id": "T6", "descripcion": "Documentación + handoff cliente", "horas": 6, "responsable": "pm", "dependencias": ["T5"]}], "criterios_aceptacion": ["Procesa 20 PDFs test sin errores críticos", "Latencia < 30s por albarán", "Tasa éxito > 95% en producción semana 1"], "riesgos_mitigacion": [{"riesgo": "PDFs escaneados mala calidad", "mitigacion": "Mindee OCR robusto + validación LLM + cola revisión manual"}], "horas_totales": 40, "costo_estimado_usd": 2800}, {"fase": "v1", "objetivo": "Cobertura 100% proveedores + reintento automático", "horas_totales": 40, "costo_estimado_usd": 2800}, {"fase": "v2", "objetivo": "Auto-aprendizaje: nuevos formatos sin código", "horas_totales": 40, "costo_estimado_usd": 2800}], "inversion_total": {"horas": 120, "costo_usd": 8400, "rango": "5900-11000"}, "proxima_accion": "Agendar kickoff 30 min para validar accesos ERP y 20 PDFs muestra", "video_script": {"hook": "¿Pierdes 40 horas semana leyendo albaranes a mano?", "solucion": "Nuestro agente IA lee PDFs, extrae datos y los sube a tu ERP automáticamente", "beneficio": "Ahorras 160h/mes = $3,200 en costos operativos", "cta": "Agenda tu diagnóstico gratis en littlecrab.solutions", "duracion_estimada_seg": 45} }
```

---

## 4. Generador Video Script → Hyperframes

**Sub-workflow**: `generate-video-demo`

```javascript
// Input: video_script (del planner output)
// Output: video_url (MP4), vtt_url (subtítulos)

const script = $json.video_script;

// Construir escenas para Hyperframes
const scenes = [
  { type: "text", duration: 3, content: script.hook, style: "bold-center", animation: "fade-in" },
  { type: "text", duration: 8, content: script.solucion, style: "clean-left", animation: "slide-up" },
  { type: "metric", duration: 5, content: script.beneficio, style: "big-number", animation: "count-up" },
  { type: "cta", duration: 10, content: script.cta, style: "button-pulse", animation: "pulse" },
  { type: "logo", duration: 3, content: "Little Crab Solutions", style: "footer", animation: "fade-in" }
];

// Llamar Hyperframes Bridge (MCP tool hyperframe_render_template)
// Template: "intake-demo-vertical"
// Variables: { scenes, tts_voice: "aura-2-gloria-es", bg_music: "corporate-upbeat" }
```

### Hyperframes Template (`hyperframes/templates/intake-demo-vertical.json`)
```json
{
  "name": "intake-demo-vertical",
  "aspectRatio": "9:16",
  "duration": 45,
  "fps": 30,
  "background": { "type": "gradient", "colors": ["#0f172a", "#1e293b"] },
  "scenes": [
    { "id": "hook", "start": 0, "end": 3, "elements": [{ "type": "text", "content": "{{hook}}", "style": { "fontSize": 48, "color": "#fff", "fontWeight": 700, "textAlign": "center" }, "animation": "fadeIn" }] },
    { "id": "solucion", "start": 3, "end": 11, "elements": [{ "type": "text", "content": "{{solucion}}", "style": { "fontSize": 36, "color": "#e2e8f0", "textAlign": "left" }, "animation": "slideUp" }] },
    { "id": "beneficio", "start": 11, "end": 16, "elements": [{ "type": "metric", "content": "{{beneficio}}", "style": { "fontSize": 64, "color": "#22d3ee", "fontWeight": 800 } }, { "type": "text", "content": "AHORRO MENSUAL", "style": { "fontSize": 20, "color": "#94a3b8" } }, "animation": "countUp" ] },
    { "id": "cta", "start": 16, "end": 42, "elements": [{ "type": "button", "content": "{{cta}}", "style": { "background": "#22d3ee", "color": "#0f172a", "borderRadius": 12, "padding": "16 32", "fontSize": 28, "fontWeight": 600 }, "animation": "pulse" }] },
    { "id": "logo", "start": 42, "end": 45, "elements": [{ "type": "image", "src": "assets/logo.png", "style": { "width": 120, "opacity": 0.8 } }, { "type": "text", "content": "Little Crab Solutions", "style": { "fontSize": 24, "color": "#64748b" } }, "animation": "fadeIn" }]
  ],
  "audio": {
    "tts": { "provider": "deepgram", "voice": "aura-2-gloria-es", "script": "{{hook}} {{solucion}} {{beneficio}} {{cta}} Little Crab Solutions" },
    "music": { "src": "assets/corporate-upbeat.mp3", "volume": 0.15, "loop": true }
  }
}
```

---

## 5. Notion: Crear Página Cliente (Entregable Profesional)

**Sub-workflow**: `notion-create-client-page`

```javascript
// Input: planner_output + cliente_info
// Output: notion_page_url

const properties = {
  "Nombre": { title: [{ text: { content: `${cliente.empresa} - Plan IA` } }] },
  "Cliente": { rich_text: [{ text: { content: cliente.empresa } }] },
  "Contacto": { email: cliente.email },
  "Sector": { select: { name: cliente.sector } },
  "Tamaño": { select: { name: cliente.tamano } },
  "Categoría": { select: { name: reto.categoria } },
  "Prioridad": { select: { name: reto.prioridad } },
  "Estado": { select: { name: "Propuesta Enviada" } },
  "Inversión Estimada": { number: plan.inversion_total.costo_usd },
  "URL Video Demo": { url: video_url }
};

// Children blocks: Resumen ejecutivo → Análisis técnico → Plan por fases → Próximos pasos
const children = [
  { type: "heading_1", heading_1: { rich_text: [{ text: { content: "Resumen Ejecutivo" } }] } },
  { type: "paragraph", paragraph: { rich_text: [{ text: { content: plan.resumen_ejecutivo } }] } },
  { type: "heading_1", heading_1: { rich_text: [{ text: { content: "Análisis Técnico" } }] } },
  { type: "paragraph", paragraph: { rich_text: [{ text: { content: plan.analisis_tecnico.problema_central } }] } },
  { type: "paragraph", paragraph: { rich_text: [{ text: { content: plan.analisis_tecnico.solucion_propuesta } }] } },
  // ... tabla fases, criterios, riesgos
  { type: "heading_1", heading_1: { rich_text: [{ text: { content: "Próxima Acción" } }] } },
  { type: "paragraph", paragraph: { rich_text: [{ text: { content: plan.proxima_accion } }] } },
  { type: "video", video: { type: "external", external: { url: video_url } } }
];

// POST https://api.notion.com/v1/pages
```

---

## 6. Notificación Discord (Gloria Audio + Embed)

**Webhook Discord** → Embed rico + archivo audio Gloria (opcional)

```json
{
  "embeds": [{
    "title": "🎯 Nuevo Intake: {{cliente.empresa}} ({{reto.categoria}})",
    "description": "{{plan.resumen_ejecutivo}}",
    "color": 0x22d3ee,
    "fields": [
      { "name": "👤 Contacto", "value": "{{cliente.nombre}} - {{cliente.email}}", "inline": true },
      { "name": "🏢 Sector / Tamaño", "value": "{{cliente.sector}} / {{cliente.tamano}}", "inline": true },
      { "name": "💰 Inversión Estimada", "value": "${{plan.inversion_total.costo_usd}} ({{plan.inversion_total.rango}})", "inline": true },
      { "name": "⏱️ Horas Totales", "value": "{{plan.inversion_total.horas}}h", "inline": true },
      { "name": "🎬 Video Demo", "value": "[Ver 45s]({{video_url}})", "inline": true },
      { "name": "📄 Plan en Notion", "value": "[Abrir página]({{notion_url}})", "inline": true }
    ],
    "footer": { "text": "Little Crab Solutions • Agente Intake v2.0" },
    "timestamp": "{{$now.toISO()}}"
  }]
}
```

---

## Ejercicio Guiado: Proyecto Final Integrado (20h = 5 sesiones de 4h)

### Sesión 1: Planner LLM + Prompt Engineering (4h)
**Objetivo**: Prompt `intake-planner` validado con 10 casos golden set ≥ 90% exact match.

1. Crear `prompts/system/intake-planner.md` (basado en especificación arriba)
2. Probar en OpenWebUI con 5 casos reales variados
3. Crear dataset LangSmith `intake-planner-golden` (10 casos)
4. Ejecutar evaluación → ajustar prompt hasta ≥ 90%
5. Versionar en Git: `prompts/system/intake-planner.v2.0.md`

### Sesión 2: Workflow n8n Orquestador Principal (4h)
**Objetivo**: Workflow `intake-agent` end-to-end funcional (sin video/Notion aún).

1. Importar/crear workflow `n8n/workflows/intake-agent.json`
2. Nodos: Webhook → Validación → Clasificador → Planner (HTTP Ollama) → Parse JSON → Set (estructurar)
3. Test con 3 casos reales → verificar JSON salida válido + campos requeridos
4. Añadir Error Handling: Catch → DLQ → Alert Discord
5. Idempotencia: Idempotency-Key + Upsert leads

### Sesión 3: Integraciones Notion + Discord + Human Gate (4h)
**Objetivo**: Sub-workflows `notion-create-client-page`, `notify-discord`, `human-review-gate`.

1. Notion: Integration token + Database ID → sub-workflow probado independientemente
2. Discord: Webhook URL → embed rico probado
3. Human Gate (opcional): IF prioridad=alta AND confianza<0.9 → Pause workflow → Notify "Revisión requerida" → Wait for manual continue (n8n Wait node + webhook resume)
4. Integrar en workflow principal: Planner → (Human Gate?) → Notion → Discord → Respond

### Sesión 4: Video Demo Hyperframes + Gloria TTS (4h)
**Objetivo**: Video vertical 45s generado automáticamente y adjunto en Notion/Discord.

1. Configurar Hyperframes Bridge local (`http://localhost:5555`)
2. Crear template `intake-demo-vertical` en Hyperframes
3. Sub-workflow `generate-video-demo`: recibe `video_script` → llama Hyperframes → espera render → sube MP4 a storage (R2/S3/local) → devuelve URL + VTT
4. Probar TTS Gloria (Deepgram API key en n8n credentials)
5. Integrar: Planner → generate-video-demo → Notion (embed video) → Discord (link)

### Sesión 5: Testing, Docs, Deploy, Entrega (4h)
**Objetivo**: Proyecto validado, documentado, desplegado en staging, video demo final.

1. **Tests**: Ejecutar golden set completo (10 casos) → LangSmith eval → screenshots resultados
2. **Load test**: k6 50 RPS 1 min → sin errores, P95 < 10s
3. **Documentación**:
   - `README.md` proyecto (arquitectura, setup, variables, troubleshooting)
   - `prompts/system/intake-planner.md` (versionado)
   - `n8n/workflows/intake-agent.json` (exportado)
   - `hyperframes/templates/intake-demo-vertical.json`
4. **Deploy Staging**: Railway staging + DNS `intake-staging.littlecrab.solutions`
5. **Video Demo Final**: Generar con caso real → subir a assets/video/demo.mp4
6. **Entregables Checklist**:
   - [ ] Código en Git (main branch)
   - [ ] Docs completas
   - [ ] Tests pasando (LangSmith + k6)
   - [ ] Staging funcionando
   - [ ] Video demo < 60s vertical + subtítulos
   - [ ] Guía uso cliente (próximo archivo)

---

## Recursos Verificados (Validados 2026-08-15)

| URL | Título | Descripción | Validación |
|-----|--------|-------------|------------|
| https://docs.hyperframe.dev/ | Hyperframes Docs | Templates, CLI, rendering, audio | 200 OK |
| https://developers.deepgram.com/docs/text-to-speech | Deepgram TTS | Voces Aura 2 (Gloria: `aura-2-gloria-es`) | 200 OK |
| https://developers.notion.com/reference/post-page | Notion API Create Page | Propiedades, children blocks, video embed | 200 OK |
| https://discord.com/developers/docs/resources/webhook | Discord Webhook | Embeds, files, allowed mentions | 200 OK |
| https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-base.wait/ | n8n Wait Node | Human-in-the-loop, webhook resume | 200 OK |
| https://docs.smith.langchain.com/evaluation/how_to_guides/ | LangSmith Evaluation | Datasets, evaluators, CI integration | 200 OK |

---

## Checkpoint de Autoevaluación (Proyecto Final)

1. **Integración**: ¿Cuál es el orden correcto de ejecución de sub-workflows en el agente intake?
2. **Human Gate**: ¿Cuándo tiene sentido pausar para revisión humana vs automatizar todo?
3. **Video**: ¿Qué 3 elementos del `video_script` son obligatorios para que Hyperframes + Gloria funcionen?
4. **Notion**: ¿Cómo estructuras bloques anidados (tabla fases → filas → celdas) en API Notion?
5. **Entrega**: Lista los 6 entregables obligatorios para dar por terminado el módulo 07.

---

### Respuestas

1. **Orden**: Clasificador → Planner → (Human Gate?) → generate-video-demo → Notion → Discord → Respond Webhook. Video ANTES de Notion para embed URL.
2. **Human Gate**: (a) Decisiones irreversibles (gasto > $5k, acceso prod), (b) Confianza LLM < 0.85, (c) Categoría "otro" o ambigua, (d) Cliente VIP flag. NO para todo: añade latencia y fricción.
3. **Video Script**: `hook` (3s), `solucion` (8s), `beneficio` (5s con número), `cta` (10s), `duracion_estimada_seg` ≤ 45. Gloria necesita frases cortas, puntos y coma para pausas.
4. **Notion Blocks**: Tabla = `table` block → `table_row` children → cada celda `rich_text`. Fases = `heading_2` + `bulleted_list_item` por tarea. Más simple: renderizar plan como Markdown en `paragraph` blocks.
5. **Entregables**: (1) Workflow n8n exportado JSON, (2) Prompt planner versionado, (3) Hyperframes template, (4) LangSmith eval results (≥90%), (5) Staging URL funcionando, (6) Video demo MP4 + VTT (< 60s).

---

## 🎓 ¡FELICITACIONES! Has Completado la Learning Path IA

**Resumen de lo construido**:
- ✅ **M01**: Fundamentos IA aplicada → criterio decisión local vs cloud
- ✅ **M02**: Stack técnico → n8n + Ollama + Docker + Git versionado
- ✅ **M03**: Primer agente → Prompt-to-Action con tools nativas
- ✅ **M04**: Automatización producción → Forms → IA → Multicanal + DLQ
- ✅ **M05**: Observabilidad → LangSmith traces + evals + Grafana alerts
- ✅ **M06**: Deploy real → Railway + HTTPS + RunPod GPU + Backups testados
- ✅ **M07**: Proyecto final → Agente Intake end-to-end + Video IA

**Próximos pasos para ti**:
1. **Portfolio**: Publica el proyecto en GitHub (repo público sanitizado) + case study en LinkedIn
2. **Cliente real**: Usa el agente intake con 3 prospectos reales → itera prompt + plan
3. **Especialización**: Profundiza en M03 (agentes multi-paso) o M05 (evals avanzados)
4. **Comunidad**: Comparte en Discord Little Crab → feedback + siguientes cohortes

---

## Certificación AI Solution Builder

Al completar todos los checkpoints con ≥ 80% aciertos y entregar M07 validado:
- **Badge digital**: "AI Solution Builder - Little Crab Solutions" (Verifiable Credential)
- **Acceso**: Plantillas avanzadas, comunidad alumni, referidos clientes
- **Próximo nivel**: "AI Solution Architect" (diseño sistemas multi-agente, governance, security)

> *"No aprendiste a usar herramientas. Aprendiste a RESOLVER PROBLEMAS con IA local, privada y escalable. Eso es lo que valora el mercado."* — Doug, lc-solution-architect