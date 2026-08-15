# Video Demo Script — Learning Path IA (Hyperframes + Gloria TTS)

**Duración objetivo**: < 60 segundos (vertical 9:16)  
**Formato**: Reels / TikTok / Shorts  
**TTS**: Deepgram Aura 2 — **Gloria** (`aura-2-gloria-es`)  
**Música**: Corporate upbeat, volumen 0.15, loop  
**Estilo**: Little Crab Solutions — azul/cian (#22d3ee) sobre dark (#0f172a)

---

## Guión Completo (Timing Exacto)

| Tiempo | Escena | Texto Gloria (TTS) | Visual (Hyperframes) | Animación |
|--------|--------|-------------------|----------------------|-----------|
| **0:00-0:03** | **HOOK** | "¿Pierdes horas en tareas que la IA ya resuelve?" | Texto centrado, grande, bold. Fondo gradient dark→blue. | `fadeIn` 0.3s |
| **0:03-0:11** | **PROBLEMA** | "Formularios que nadie lee. Datos en silos. Decisiones a ciegas." | 3 iconos animados: formulario📄 → base datos🗄️ → vendado🙈. Texto abajo. | `slideUp` escalonado 0.2s c/u |
| **0:11-0:19** | **SOLUCIÓN** | "Learning Path IA: construyes agentes que leen, clasifican, actúan y avisan. En local. Privado. Tuyo." | Diagrama simple: Input → n8n → Ollama → Acción. Nodos se encienden en secuencia. | `drawPath` 2s + `pulse` nodos |
| **0:19-0:27** | **STACK** | "n8n para flujos. Ollama para modelos. Hyperframes para video. Todo en tu máquina." | Logos apilados: n8n 🟠, Ollama 🦙, Hyperframes ⚡, Docker 🐳. | `stackReveal` bottom→top |
| **0:27-0:35** | **RESULTADO** | "De 'tengo un problema' a plan técnico + video demo + página Notion + aviso en Discord. En 3 minutos." | Split screen: ANTES (caos) → DESPUÉS (dashboard limpio con métricas). | `wipeTransition` L→R |
| **0:35-0:43** | **BENEFICIO** | "Ahorras 20h/semana. Cero coste cloud. Control total. Escalable cuando crezcas." | Métrica grande: "20h/sem 💰" con count-up. Badges: "Local", "Privado", "Open Source". | `countUp` 2s + `badgePop` |
| **0:43-0:52** | **CTA** | "Inicia tu ruta gratis en littlecrab.solutions. Diagnóstico IA en 5 minutos." | Botón pulsante: "INICIAR RUTA GRATIS" → URL littlecrab.solutions abajo. | `pulse` loop 1s + `fadeIn` URL |
| **0:52-1:00** | **BRAND** | "Little Crab Solutions. IA para PYMEs que sí funciona." | Logo animado + tagline. Fade out suave. | `logoReveal` + `fadeOut` 2s |

---

## Texto Completo para Deepgram (Una sola llamada TTS)

```
¿Pierdes horas en tareas que la IA ya resuelve? ... Formularios que nadie lee. Datos en silos. Decisiones a ciegas. ... Learning Path IA: construyes agentes que leen, clasifican, actúan y avisan. En local. Privado. Tuyo. ... n8n para flujos. Ollama para modelos. Hyperframes para video. Todo en tu máquina. ... De 'tengo un problema' a plan técnico + video demo + página Notion + aviso en Discord. En 3 minutos. ... Ahorras 20 horas semana. Cero coste cloud. Control total. Escalable cuando crezcas. ... Inicia tu ruta gratis en littlecrab punto solutions. Diagnóstico IA en 5 minutos. ... Little Crab Solutions. IA para PYMEs que sí funciona.
```

**Notas para TTS**:
- `...` = pausa 0.5s (Deepgram respeta comas/puntos, añade `...` para pausas dramáticas)
- "littlecrab punto solutions" = se pronuncia claro
- Velocidad: 1.0 (normal), Gloria voz cálida y profesional

---

## Especificación Hyperframes Template (`intake-demo-vertical`)

```json
{
  "name": "intake-demo-vertical",
  "aspectRatio": "9:16",
  "duration": 60,
  "fps": 30,
  "background": {
    "type": "gradient",
    "colors": ["#0f172a", "#1e293b", "#0f172a"],
    "angle": 135
  },
  "scenes": [
    {
      "id": "hook",
      "start": 0,
      "end": 3,
      "elements": [
        {
          "type": "text",
          "content": "¿Pierdes horas en tareas que la IA ya resuelve?",
          "style": {
            "fontSize": 52,
            "color": "#ffffff",
            "fontWeight": 800,
            "textAlign": "center",
            "lineHeight": 1.2,
            "maxWidth": "90%"
          },
          "position": { "x": "50%", "y": "50%", "anchor": "center" },
          "animation": { "type": "fadeIn", "duration": 0.5, "easing": "easeOut" }
        }
      ]
    },
    {
      "id": "problema",
      "start": 3,
      "end": 11,
      "elements": [
        { "type": "icon", "src": "assets/icons/form.png", "style": { "width": 80 }, "position": { "x": "20%", "y": "30%" }, "animation": { "type": "slideUp", "delay": 0 } },
        { "type": "icon", "src": "assets/icons/silo.png", "style": { "width": 80 }, "position": { "x": "50%", "y": "30%" }, "animation": { "type": "slideUp", "delay": 0.2 } },
        { "type": "icon", "src": "assets/icons/blind.png", "style": { "width": 80 }, "position": { "x": "80%", "y": "30%" }, "animation": { "type": "slideUp", "delay": 0.4 } },
        {
          "type": "text",
          "content": "Formularios que nadie lee. Datos en silos. Decisiones a ciegas.",
          "style": { "fontSize": 28, "color": "#e2e8f0", "textAlign": "center" },
          "position": { "x": "50%", "y": "70%", "anchor": "center" },
          "animation": { "type": "fadeIn", "delay": 0.6 }
        }
      ]
    },
    {
      "id": "solucion",
      "start": 11,
      "end": 19,
      "elements": [
        {
          "type": "diagram",
          "nodes": [
            { "id": "input", "label": "INPUT", "x": 100, "y": 300, "color": "#22d3ee" },
            { "id": "n8n", "label": "n8n", "x": 300, "y": 300, "color": "#f97316" },
            { "id": "ollama", "label": "Ollama", "x": 500, "y": 300, "color": "#8b5cf6" },
            { "id": "action", "label": "ACCIÓN", "x": 700, "y": 300, "color": "#22c55e" }
          ],
          "edges": [["input", "n8n"], ["n8n", "ollama"], ["ollama", "action"]],
          "animation": { "type": "drawPath", "duration": 2, "stagger": 0.3 }
        },
        {
          "type": "text",
          "content": "En local. Privado. Tuyo.",
          "style": { "fontSize": 32, "color": "#22d3ee", "fontWeight": 700, "textAlign": "center" },
          "position": { "x": "50%", "y": "85%", "anchor": "center" },
          "animation": { "type": "fadeIn", "delay": 2.5 }
        }
      ]
    },
    {
      "id": "stack",
      "start": 19,
      "end": 27,
      "elements": [
        { "type": "image", "src": "assets/logos/n8n.png", "style": { "width": 100 }, "position": { "x": "50%", "y": "20%" }, "animation": { "type": "popIn", "delay": 0 } },
        { "type": "image", "src": "assets/logos/ollama.png", "style": { "width": 100 }, "position": { "x": "50%", "y": "40%" }, "animation": { "type": "popIn", "delay": 0.15 } },
        { "type": "image", "src": "assets/logos/hyperframes.png", "style": { "width": 100 }, "position": { "x": "50%", "y": "60%" }, "animation": { "type": "popIn", "delay": 0.3 } },
        { "type": "image", "src": "assets/logos/docker.png", "style": { "width": 100 }, "position": { "x": "50%", "y": "80%" }, "animation": { "type": "popIn", "delay": 0.45 } }
      ]
    },
    {
      "id": "resultado",
      "start": 27,
      "end": 35,
      "elements": [
        {
          "type": "split",
          "left": {
            "label": "ANTES",
            "color": "#ef4444",
            "content": "📋 Formulario → 🕳️ Silencio → 😰 Estrés"
          },
          "right": {
            "label": "DESPUÉS",
            "color": "#22c55e",
            "content": "🤖 Agente → 📊 Plan + 🎬 Video + 📄 Notion + 🔔 Discord"
          },
          "animation": { "type": "wipeLeftToRight", "duration": 1.5 }
        }
      ]
    },
    {
      "id": "beneficio",
      "start": 35,
      "end": 43,
      "elements": [
        {
          "type": "metric",
          "value": "20h/sem",
          "suffix": " 💰",
          "style": { "fontSize": 72, "color": "#22d3ee", "fontWeight": 900 },
          "position": { "x": "50%", "y": "40%", "anchor": "center" },
          "animation": { "type": "countUp", "duration": 2, "from": 0 }
        },
        {
          "type": "badges",
          "items": ["🔒 Local", "🛡️ Privado", "📦 Open Source", "📈 Escalable"],
          "style": { "fontSize": 20, "background": "rgba(34,211,238,0.1)", "border": "1px solid #22d3ee", "borderRadius": 8, "padding": "8 16", "gap": 12 },
          "position": { "x": "50%", "y": "70%", "anchor": "center" },
          "animation": { "type": "staggerPop", "delay": 0.1 }
        }
      ]
    },
    {
      "id": "cta",
      "start": 43,
      "end": 52,
      "elements": [
        {
          "type": "button",
          "content": "INICIAR RUTA GRATIS",
          "style": { "background": "linear-gradient(135deg, #22d3ee, #06b6d4)", "color": "#0f172a", "fontSize": 32, "fontWeight": 700, "padding": "20 40", "borderRadius": 16, "boxShadow": "0 0 30px rgba(34,211,238,0.4)" },
          "position": { "x": "50%", "y": "50%", "anchor": "center" },
          "animation": { "type": "pulse", "duration": 1, "repeat": true, "scale": 1.05 }
        },
        {
          "type": "text",
          "content": "littlecrab.solutions",
          "style": { "fontSize": 24, "color": "#94a3b8" },
          "position": { "x": "50%", "y": "75%", "anchor": "center" },
          "animation": { "type": "fadeIn", "delay": 2 }
        }
      ]
    },
    {
      "id": "brand",
      "start": 52,
      "end": 60,
      "elements": [
        { "type": "image", "src": "assets/logo.png", "style": { "width": 140 }, "position": { "x": "50%", "y": "45%", "anchor": "center" }, "animation": { "type": "zoomIn", "duration": 1 } },
        { "type": "text", "content": "Little Crab Solutions", "style": { "fontSize": 28, "color": "#e2e8f0", "fontWeight": 600 }, "position": { "x": "50%", "y": "65%", "anchor": "center" }, "animation": { "type": "fadeIn", "delay": 1 } },
        { "type": "text", "content": "IA para PYMEs que sí funciona", "style": { "fontSize": 20, "color": "#64748b" }, "position": { "x": "50%", "y": "75%", "anchor": "center" }, "animation": { "type": "fadeIn", "delay": 1.5 } }
      ]
    }
  ],
  "audio": {
    "tts": {
      "provider": "deepgram",
      "voice": "aura-2-gloria-es",
      "script": "¿Pierdes horas en tareas que la IA ya resuelve? ... Formularios que nadie lee. Datos en silos. Decisiones a ciegas. ... Learning Path IA: construyes agentes que leen, clasifican, actúan y avisan. En local. Privado. Tuyo. ... n8n para flujos. Ollama para modelos. Hyperframes para video. Todo en tu máquina. ... De 'tengo un problema' a plan técnico + video demo + página Notion + aviso en Discord. En 3 minutos. ... Ahorras 20 horas semana. Cero coste cloud. Control total. Escalable cuando crezcas. ... Inicia tu ruta gratis en littlecrab punto solutions. Diagnóstico IA en 5 minutos. ... Little Crab Solutions. IA para PYMEs que sí funciona."
    },
    "music": {
      "src": "assets/audio/corporate-upbeat.mp3",
      "volume": 0.15,
      "loop": true,
      "fadeIn": 1,
      "fadeOut": 2
    },
    "masterVolume": 0.9
  },
  "output": {
    "format": "mp4",
    "codec": "h264",
    "crf": 20,
    "preset": "medium",
    "subtitles": true,
    "subtitleStyle": { "fontSize": 24, "color": "#ffffff", "outline": 2, "outlineColor": "#000000", "position": "bottom", "margin": 60 }
  }
}
```

---

## Assets Requeridos (Preparar ANTES de render)

```
hyperframes/templates/intake-demo-vertical.json  ← Este archivo
assets/
├── logos/
│   ├── n8n.png           (100x100, transparente)
│   ├── ollama.png        (100x100)
│   ├── hyperframes.png   (100x100)
│   └── docker.png        (100x100)
├── icons/
│   ├── form.png          (80x80)
│   ├── silo.png          (80x80)
│   └── blind.png         (80x80)
├── logo.png              (300x300, logo Little Crab)
├── audio/
│   └── corporate-upbeat.mp3  (30s loop, royalty-free)
└── fonts/                (Opcional: Inter, Space Grotesk)
```

---

## Comando Render (Hyperframes CLI)

```bash
# 1. Instalar Hyperframes CLI
npm install -g @hyperframes/cli

# 2. Configurar Deepgram API Key
export DEEPGRAM_API_KEY=tu_key_aqui

# 3. Render (genera MP4 + VTT en ./output/)
npx hyperframe render \
  --template hyperframes/templates/intake-demo-vertical.json \
  --output ./output/demo-vertical.mp4 \
  --subtitles ./output/demo-vertical.vtt

# 4. Verificar
ffprobe ./output/demo-vertical.mp4  # Duración ~60s, 1080x1920, 30fps
```

---

## Checklist Pre-Publicación

- [ ] Duración ≤ 60s (ffprobe confirma)
- [ ] Resolución 1080x1920 (9:16)
- [ ] Audio: Gloria clara, música fondo sutil (0.15)
- [ ] Subtítulos .vtt sincronizados (quemados + archivo separado)
- [ ] CTA URL legible: `littlecrab.solutions`
- [ ] Branding: Logo + tagline final
- [ ] Sin marcas de agua, sin errores visuales
- [ ] Probado en móvil (vertical, sonido ON/OFF)

---

## Variantes (Para A/B Test)

| Variante | Cambio | Hipótesis |
|----------|--------|-----------|
| **A (Control)** | Guión arriba | Baseline |
| **B (Caso Real)** | Hook: "LogiFast ahorró 160h/mes con nuestro agente" | Social proof > pain point |
| **C (Técnico)** | Hook: "n8n + Ollama + Hyperframes = stack IA completo local" | Atrae perfiles técnicos |
| **D (Corto 30s)** | Cortar stack + beneficio, solo hook→solución→CTA | Retención > completitud |

---

## Métricas de Éxito (Post-Publicación)

| Métrica | Objetivo 7 días | Herramienta |
|---------|-----------------|-------------|
| **Views** | > 5,000 | Instagram/TikTok/YouTube Analytics |
| **Watch time avg** | > 35s (58%) | Platform insights |
| **CTA clicks** | > 100 | UTM params + GA4 |
| **Signups diagnóstico** | > 20 | n8n webhook `/diagnostico-ia` |
| **Compartidos** | > 50 | Platform insights |

---

## Próximos Videos (Serie)

1. **Ep 2**: "Cómo clasifica nuestro agente tu reto en 2 segundos" (demo clasificador)
2. **Ep 3**: "De prompt a plan técnico: el cerebro del agente" (planner LLM)
3. **Ep 4**: "Video generado por IA en 1 click: Hyperframes + Gloria" (meta-demo)
4. **Ep 5**: "Deploy real en Railway: HTTPS + GPU cloud + backups" (M06)
5. **Ep 6**: "Casos reales: 3 PYMEs que automatizaron con Learning Path IA" (testimonios)

---

**Versión**: 1.0  
**Autor**: Little Crab Solutions Team  
**Fecha**: 2026-08-15  
**Estado**: Listo para render y publicación