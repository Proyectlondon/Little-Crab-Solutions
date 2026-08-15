# ADR-0001: Arquitectura del Producto Educativo "Learning Path IA"

## Status
Accepted

## Date
2026-08-15

## Deciders
@lc-solution-architect (Doug)

## Context
Necesitamos convertir `learning-path-ia.html` (página estática con diseño base) en un **producto educativo completo** para el perfil "AI Solution Builder" (analista IT + diseñador visual, no desarrollador). 

El producto debe incluir:
1. Contenido validado por expertos (arquitectura, QA, desarrollo)
2. Recursos verificados y enlaces funcionales
3. Video demo vertical (Reels/TikTok) con Hyperframes + TTS Gloria (Deepgram)
4. Integración en el sitio principal `little-crab-solutions.html` (nav/footer)
5. Documentación para el equipo y cliente final (guía de uso, ADR, checklist QA)

Stack acordado: HTML/CSS/JS vanilla (sin frameworks), Hyperframes para video, n8n para automatización de despliegue, ecosistema JJ (Ollama, ComfyUI, Hermes).

## Decision Drivers
- **Local-first y privacidad por defecto** — sin dependencias externas innecesarias
- **Mantenibilidad** — código vanilla, modular, sin build step
- **Accesibilidad** — WCAG 2.1 AA obligatorio
- **Performance** — carga < 2s en móvil/desktop
- **Integración coherente** — mismo design system que sitio principal
- **Despliegue simple** — GitHub Pages / Netlify / Railway (decisión de deploy separada)

## Considered Options

### Option 1: Single-page application (SPA) con routing client-side
- **Pros**: Navegación fluida, estado compartido
- **Contras**: Complejidad JS innecesaria, SEO peor, build step, overkill para contenido mayormente estático

### Option 2: Múltiples páginas HTML estáticas enlazadas
- **Pros**: Simple, SEO nativo, cacheable, sin JS obligatorio, deployment trivial
- **Contras**: Duplicación de header/footer/nav (mitigado con includes via n8n/build o SSI)

### Option 3: Single HTML con secciones + scroll navigation (actual)
- **Pros**: Ya existe, performance excelente, simple, funciona sin JS (progressive enhancement)
- **Contras**: Largo si crece mucho contenido, anclas profundas

### Option 4: Static Site Generator (Astro, Eleventy, Hugo)
- **Pros**: Includes, layouts, markdown para contenido, optimizaciones automáticas
- **Contras**: Build step, dependencias, learning curve para equipo no-dev, overkill actual

## Decision
**Option 3 mejorado**: Mantener single-page `learning-path-ia.html` como página de entrada/landing, pero **extraer contenido educativo detallado a páginas satélite** (`learning-path-ia/modulo-*.html`) enlazadas desde la ruta principal. 

Esto permite:
- Landing page rápida (< 2s) con overview y CTA
- Módulos profundos en páginas separadas (cargan bajo demanda)
- Cada módulo validable independientemente por QA
- Video demo embebido en landing + versión completa en página dedicada
- Nav/footer compartido via include en build n8n o SSI en hosting

**Deploy target**: **GitHub Pages** (gratuito, HTTPS automático, CDN global, integra con Actions para n8n build). Decisión de Doug.

## Architecture Components

```
D:\Little Crab Solutions\
├── learning-path-ia.html          # Landing page (overview + CTA + video demo)
├── learning-path-ia/
│   ├── index.html                 # Redirect o overview extendido
│   ├── modulo-01-fundamentos.html
│   ├── modulo-02-stack-tecnico.html
│   ├── modulo-03-primer-agente.html
│   ├── modulo-04-automatizacion-n8n.html
│   ├── modulo-05-testing-observabilidad.html
│   ├── modulo-06-despliegue-escalado.html
│   ├── modulo-07-proyecto-final.html
│   ├── assets/
│   │   ├── css/learning-path.css  # Estilos compartidos (extraídos del inline)
│   │   ├── js/learning-path.js    # JS compartido (reveal, claw, navigation)
│   │   └── video/demo.mp4         # Video demo vertical (Hyperframes output)
│   └── guia-uso-ai-solution-builder.md
├── little-crab-solutions.html     # Sitio principal (actualizar nav/footer)
├── docs/
│   ├── adr/
│   │   └── 0001-learning-path-ia-architecture.md  # Este ADR
│   └── qa/
│       └── checklist-learning-path.md             # Checklist QA (Lilis)
├── n8n/
│   └── workflows/
│       └── deploy-learning-path.json              # Workflow n8n deploy
└── scripts/
    └── build-includes.js          # Script simple para inyectar nav/footer compartidos
```

## Shared Nav/Footer Strategy
- **Build-time include**: Script Node.js simple (`scripts/build-includes.js`) que lee `partials/nav.html` y `partials/footer.html` e inyecta en todas las páginas HTML antes de deploy
- n8n workflow ejecuta este script + push a `gh-pages` branch
- Zero runtime dependencies, funciona en GitHub Pages nativo

## Content Architecture

### Landing Page (`learning-path-ia.html`)
- Hero con value prop + video demo embebido (muted, autoplay, loop)
- Ruta visual resumida (7 pasos con iconos + tiempo estimado)
- Stat strip con métricas validadas
- CTA principal → "Iniciar ruta gratis" (ancla a módulo 1 o formulario)
- CTA secundario → "Agendar diagnóstico"

### Módulos (`learning-path-ia/modulo-XX-*.html`)
Cada módulo sigue template consistente:
- Header con progreso (paso X de 7)
- Objetivos de aprendizaje (3-5 bullets)
- Contenido teórico-práctico (texto + diagramas SVG/imágenes)
- Ejercicio guiado (pasos concretos, capturas de pantalla)
- Recursos verificados (enlaces 200 OK, fecha validación)
- Checkpoint de autoevaluación (3-5 preguntas)
- Navegación prev/next + volver a overview

### Video Demo (`learning-path-ia/assets/video/demo.mp4`)
- Duración: < 60s (vertical 9:16)
- Generado con **Hyperframes** (`hyperframe_text_to_video`)
- TTS: **Gloria (Deepgram)** español
- Subtítulos ES quemados + archivo .vtt para accesibilidad
- Guión: Overview de la ruta en 45s + CTA final 15s

## Integration with Main Site (`little-crab-solutions.html`)
- **Nav**: Añadir enlace "Ruta IA" → `learning-path-ia.html` (posición: después de "Stack" o antes de "Hablemos")
- **Footer**: Añadir enlace en columna "Recursos" o nueva columna "Academia"
- **Design system**: Mismas variables CSS, fuentes, paleta, componentes (btn-primary, service-card, reveal)

## Consequences

### Positive
- **Performance**: Landing < 2s, módulos lazy-load
- **Mantenibilidad**: Contenido modular, validable por separado
- **SEO**: Cada módulo indexable independientemente
- **Equipo no-dev**: Editar contenido = editar HTML simple, sin build local
- **Escalabilidad**: Añadir módulos nuevos sin tocar landing
- **Deploy**: GitHub Pages gratuito, n8n automatiza todo

### Negative
- **Duplicación nav/footer**: Mitigado con build-time includes
- **Estado compartido**: Sin progreso persistente entre módulos (aceptable v1, v2 puede usar localStorage)
- **Video hosting**: GitHub Pages límite 100MB/file, video < 50MB (vertical 60s ~ 10-20MB)

### Risks
- **Enlaces rotos**: Validación automática en n8n workflow (check HTTP 200)
- **Accesibilidad**: Audit manual + axe-core en CI
- **Video generation**: Hyperframes + Deepgram API requieren credenciales (n8n secrets)

## Implementation Plan

| Fase | Responsable | Entregable |
|------|-------------|------------|
| 1. Arquitectura y ADR | Doug (architect) | ✅ Este ADR |
| 2. Estructura de carpetas + partials nav/footer | Johncho (fullstack) | Carpeta `learning-path-ia/`, `partials/`, `scripts/build-includes.js` |
| 3. Landing page mejorada (video, stats validadas) | Johncho | `learning-path-ia.html` final |
| 4. Módulos 1-7 (contenido + ejercicios) | Johncho + Ristow (contenido) | 7 archivos HTML en `learning-path-ia/` |
| 5. Video demo (Hyperframes + Gloria) | Johncho | `assets/video/demo.mp4` + `.vtt` |
| 6. Integración nav/footer sitio principal | Johncho | `little-crab-solutions.html` actualizado |
| 7. QA Checklist + validación enlaces/accesibilidad | Lilis (qa) | `docs/qa/checklist-learning-path.md` firmado |
| 8. Guía de uso AI Solution Builder | Doug + Ristow | `learning-path-ia/guia-uso-ai-solution-builder.md` |
| 9. n8n deploy workflow | Johncho | `n8n/workflows/deploy-learning-path.json` |
| 10. Deploy a GitHub Pages + validación producción | Johncho | URL pública funcionando |

## Related Decisions
- ADR-0002: Deploy Target Selection (GitHub Pages) — *pending, same decision*
- ADR-0003: Shared Design System Tokens — *implicit in current CSS variables*

## References
- [Hyperframes Documentation](https://hermes-agent.nousresearch.com/docs/tools#hyperframe_text_to_video)
- [Deepgram TTS Gloria](https://developers.deepgram.com/docs/text-to-speech)
- [WCAG 2.1 AA Checklist](https://www.w3.org/WAI/WCAG21/quickref/)
- [GitHub Pages Limits](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages#usage-limits)

---

**Firmado**: Doug (lc-solution-architect) — 2026-08-15