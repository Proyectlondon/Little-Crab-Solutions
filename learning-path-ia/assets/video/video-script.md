# Video Demo Script - Learning Path IA (60s vertical 9:16)

## Meta
- **Duración**: 60 segundos exactos
- **Formato**: Vertical 9:16 (1080x1920)
- **TTS**: Gloria (Deepgram) - modelo `aura-hera-es`
- **Subtítulos**: Español (.vtt)
- **Música**: Suave, corporativa, sin derechos (o silencio)
- **Estilo**: Clean, minimal, brand colors (coral/teal)

---

## Guión por escenas

### ESCENA 1: Hook (0-5s)
**Visual**: Pantalla dividida - izquierda: formulario Google Forms llenándose solo (animación rápida), derecha: logo Little Crab pulsando
**Texto en pantalla**: "De brief a plan automático en 60 segundos"
**Gloria (TTS)**: "De brief a plan automático en sesenta segundos."
**Animación**: Formulario se autocompleta → botón Submit brilla → transición swipe a escena 2

---

### ESCENA 2: Input (5-15s)
**Visual**: Captura real del formulario (nombre, empresa, problema, objetivo). Cursor escribe "Acme Corp" → "Automatizar lead gen WhatsApp"
**Texto en pantalla**: "Cliente rellena brief → Webhook a n8n"
**Gloria (TTS)**: "El cliente rellena su brief. Un webhook lo envía directo a n8n."
**Animación**: Flecha animada formulario → icono n8n (nodo webhook)

---

### ESCENA 3: Procesamiento (15-35s)
**Visual**: Editor n8n workflow corriendo (sped up 4x). Nodos se iluminan en secuencia: Webhook → Set → Ollama → Function → Notion → Deepgram → Discord
**Texto en pantalla**: 
- "n8n orquesta"
- "Ollama genera plan (Prompt-to-Action)"
- "Notion crea tickets"
**Gloria (TTS)**: "n8n orquesta el flujo. Ollama genera el plan estructurado con el patrón Prompt-to-Action. Notion crea la página y los tasks automáticamente."
**Animación**: Nodos parpadean en verde al completarse. Zoom en nodo Ollama → muestra JSON output brevemente.

---

### ESCENA 4: Output + Audio (35-50s)
**Visual**: Split screen - arriba: Notion página creada con plan (scroll rápido), abajo: Discord mensaje con embed + onda de audio reproduciéndose
**Texto en pantalla**: "Discord notifica al equipo + Audio con voz de Gloria"
**Gloria (TTS)**: "Discord notifica al equipo con el resumen. Y aquí estoy yo, Gloria, leyendo el intake en español natural."
**Animación**: Onda de audio animada → play button → barra de progreso. Subtítulos sincronizados.

---

### ESCENA 5: CTA + Brand (50-60s)
**Visual**: Fondo brand (bg-glow). Logo Little Crab grande (animación claw cierra/abre). Texto aparece con reveal.
**Texto en pantalla**: 
- "¿Quieres automatizar tu intake?"
- "Agenda diagnóstico gratis"
- "littlecrabsolutions.com"
**Gloria (TTS)**: "¿Quieres automatizar tu proceso de intake? Agenda tu diagnóstico gratuito en little crab solutions punto com."
**Animación**: Claw animation (como en hero). Botón CTA pulse. Fade out con tagline "Hecho con precisión de cangrejo"

---

## Subtítulos (.vtt) - Tiempo exacto

```vtt
WEBVTT

00:00.000 --> 00:05.000
De brief a plan automático en sesenta segundos.

00:05.000 --> 00:10.000
El cliente rellena su brief.

00:10.000 --> 00:15.000
Un webhook lo envía directo a n8n.

00:15.000 --> 00:20.000
n8n orquesta el flujo.

00:20.000 --> 00:25.000
Ollama genera el plan estructurado

00:25.000 --> 00:30.000
con el patrón Prompt-to-Action.

00:30.000 --> 00:35.000
Notion crea la página y los tasks automáticamente.

00:35.000 --> 00:40.000
Discord notifica al equipo con el resumen.

00:40.000 --> 00:45.000
Y aquí estoy yo, Gloria,

00:45.000 --> 00:50.000
leyendo el intake en español natural.

00:50.000 --> 00:55.000
¿Quieres automatizar tu proceso de intake?

00:55.000 --> 00:60.000
Agenda tu diagnóstico gratuito en little crab solutions punto com.
```

---

## Notas de producción Hyperframes

```yaml
# config para hyperframe_text_to_video
scenes:
  - id: hook
    duration: 5
    background: gradient(coral, teal)
    elements:
      - type: text
        content: "De brief a plan automático en 60 segundos"
        animation: fade-in-up
      - type: animation
        asset: form-autofill
  - id: input
    duration: 10
    background: screen-recording(form-fill)
    elements:
      - type: overlay
        content: "Cliente rellena brief → Webhook a n8n"
  - id: processing
    duration: 20
    background: screen-recording(n8n-workflow)
    elements:
      - type: highlight
        targets: [webhook, ollama, notion]
      - type: text
        content: "n8n orquesta → Ollama genera → Notion crea"
  - id: output
    duration: 15
    background: split-screen(notion, discord)
    elements:
      - type: audio-wave
        sync: tts
      - type: text
        content: "Discord + Audio Gloria"
  - id: cta
    duration: 10
    background: brand-gradient
    elements:
      - type: logo
        animation: claw
      - type: cta-button
        text: "Agendar diagnóstico gratis"
        link: "https://littlecrabsolutions.com"

tts:
  voice: "gloria"
  provider: "deepgram"
  model: "aura-hera-es"
  speed: 1.0

subtitles:
  language: "es"
  format: "vtt"
  position: "bottom"
  style: "white on semi-transparent dark, rounded"

output:
  format: "mp4"
  codec: "h264"
  resolution: "1080x1920"
  fps: 30
  bitrate: "2M"
  max_size_mb: 10
```

---

## Checklist pre-generación
- [ ] Guión aprobado por Doug (arquitectura) y Ristow (contenido)
- [ ] Deepgram API key configurada en n8n/secrets
- [ ] Hyperframes template creado y testeado
- [ ] Capturas de pantalla reales (n8n, Notion, Discord) grabadas
- [ ] Subtítulos .vtt generados y sincronizados
- [ ] Video renderizado < 10 MB
- [ ] Poster.jpg extraído (frame 00:02)
- [ ] Video subido a `assets/video/learning-path-demo.mp4`
- [ ] Referenciado en `learning-path-ia.html` (video section)