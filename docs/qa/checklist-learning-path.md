# QA Checklist — Learning Path IA

**Producto:** Learning Path IA (Ruta de Aprendizaje IA)  
**Versión:** 1.0  
**Fecha validación:** 2026-08-15  
**Responsable QA:** Lilis (lc-qa-engineer)  
**Entorno:** Local (http://localhost:8080/learning-path-ia.html)  

---

## Resumen Ejecutivo

| Criterio | Estado | Observaciones |
|----------|--------|---------------|
| Enlaces externos (10 validados) | ✅ PASS | 10/10 HTTP 200 OK — ver `link_validation_final.csv` |
| Enlaces internos (navegación + módulos) | ✅ PASS | Landing + 7 módulos enlazados correctamente |
| WCAG 2.1 AA (Lighthouse) | ⚠️ PARTIAL | Accessibility 95+ target — requiere verificación manual completa |
| Performance (Lighthouse) | ❌ FAIL | FCP/LCP 2.8s > 2.5s threshold; video assets 404 |
| W3C Validator | ⏳ PENDING | Por ejecutar |
| Consola navegador | ❌ FAIL | 3 errores 404: poster.jpg, learning-path-demo.mp4, favicon.ico |
| Cross-browser | ⏳ PENDING | Por ejecutar (Chrome/Firefox/Safari/Edge + mobile) |
| Video demo | ❌ MISSING | Assets no generados aún (Hyperframes + Gloria TTS pendiente) |
| Checklist firmado | 📝 IN PROGRESS | Este documento |

---

## 1. Checklist de Validación de Enlaces

### 1.1 Enlaces Externos (Validados 2026-08-15)

| # | URL | Descripción | Status | Final URL | Responsable |
|---|-----|-------------|--------|-----------|-------------|
| 1 | https://deepgram.com/ | Deepgram - TTS y Speech-to-Text (Gloria) | 200 OK | https://deepgram.com/ | Lilis |
| 2 | https://fonts.googleapis.com/... | Google Fonts CSS | 200 OK | (mismo) | Lilis |
| 3 | https://github.com/NousResearch/hermes-agent | Repositorio Hermes | 200 OK | (mismo) | Lilis |
| 4 | https://hermes-agent.nousresearch.com/docs | Documentación Hermes | 200 OK | (mismo) | Lilis |
| 5 | https://huggingface.co/course | Hugging Face Course | 200 OK | https://huggingface.co/learn/llm-course/chapter1/1 | Lilis |
| 6 | https://learn.deeplearning.ai/ | DeepLearning.AI Short Courses | 200 OK | (mismo) | Lilis |
| 7 | https://docs.n8n.io | n8n Documentation | 200 OK | (mismo) | Lilis |
| 8 | https://ollama.com/ | Ollama Modelos | 200 OK | (mismo) | Lilis |
| 9 | https://www.langsmith.com/ | LangSmith Observabilidad | 200 OK | https://www.langchain.com/langsmith-platform | Lilis |
| 10 | https://render.com/docs | Render Deploy Docs | 200 OK | (mismo) | Lilis |

**Estado:** ✅ 100% validados (10/10 HTTP 200 OK)

### 1.2 Enlaces Internos (Navegación)

| Origen | Destino | Estado |
|--------|---------|--------|
| Landing → Módulo 01 | `learning-path-ia/modulo-01/modulo-01-fundamentos.html` | ✅ Existe |
| Landing → Módulo 02 | `learning-path-ia/modulo-02/modulo-02-stack-tecnico.html` | ✅ Existe |
| Landing → Módulo 03 | `learning-path-ia/modulo-03/modulo-03-primer-agente.html` | ✅ Existe |
| Landing → Módulo 04 | `learning-path-ia/modulo-04/modulo-04-automatizacion-n8n.html` | ✅ Existe |
| Landing → Módulo 05 | `learning-path-ia/modulo-05/modulo-05-testing-observabilidad.html` | ✅ Existe |
| Landing → Módulo 06 | `learning-path-ia/modulo-06/modulo-06-despliegue-escalado.html` | ✅ Existe |
| Landing → Módulo 07 | `learning-path-ia/modulo-07/modulo-07-proyecto-final.html` | ✅ Existe |
| Módulo N → Módulo N+1 | Navegación prev/next + overview | ✅ Implementada |
| Módulo N → Overview | `../learning-path-ia.html` | ✅ Implementada |
| Nav → Ruta IA | `learning-path-ia.html` | ✅ Implementada |

**Estado:** ✅ Navegación completa funcional

### 1.3 Enlaces Rotos / Pendientes

| Recurso | Error | Acción Requerida |
|---------|-------|------------------|
| `assets/video/poster.jpg` | 404 Not Found | Generar thumbnail del video demo |
| `assets/video/learning-path-demo.mp4` | 404 Not Found | Generar video con Hyperframes + Gloria TTS |
| `favicon.ico` | 404 Not Found | Añadir favicon o link rel="icon" |

---

## 2. Testing de Accesibilidad (WCAG 2.1 AA)

### 2.1 Contraste (Ratio ≥ 4.5:1 normal / ≥ 3:1 large)

| Elemento | Color Texto | Color Fondo | Ratio | Estado |
|----------|-------------|-------------|-------|--------|
| Headlines (Space Grotesk) | #F2EFE6 | #0A0F0D | ~15:1 | ✅ PASS |
| Body text (Inter) | #F2EFE6 | #0A0F0D | ~15:1 | ✅ PASS |
| Texto dim (#8A9490) | #8A9490 | #0A0F0D | ~5.8:1 | ✅ PASS |
| Botón primary (coral) | #1A0A05 | #E8623D | ~4.8:1 | ✅ PASS |
| Botón ghost (borde) | #F2EFE6 | transparent | N/A | ⚠️ VERIFICAR |
| Links teal (#7FD9C4) | #7FD9C4 | #0A0F0D | ~6.2:1 | ✅ PASS |
| Focus ring (teal 40%) | outline | #0A0F0D | N/A | ✅ VISIBLE |

**Nota:** Verificación manual con WAVE/axe-core pendiente para confirmar 0 violaciones críticas.

### 2.2 Navegación Teclado

| Criterio | Estado | Observaciones |
|----------|--------|---------------|
| Skip link "Saltar al contenido principal" | ✅ IMPLEMENTADO | `.skip-link` en CSS/HTML |
| Focus visible en todos los interactivos | ✅ IMPLEMENTADO | `box-shadow: var(--focus-ring)` |
| Orden lógico Tab (nav → main → footer) | ⏳ PENDING | Por validar manual |
| Escape cierra modales/overlays | N/A | No hay modales |
| Enter/Space activan botones/links | ⏳ PENDING | Por validar manual |

### 2.3 ARIA y Semántica

| Criterio | Estado | Observaciones |
|----------|--------|---------------|
| Landmarks (nav, main, footer, section) | ✅ IMPLEMENTADO | HTML5 semántico |
| Labels en botones sin texto visible | ✅ IMPLEMENTADO | `aria-label` en video play btn |
| Roles correctos (button, link, progressbar) | ✅ IMPLEMENTADO | `role="progressbar"` en módulos |
| Headings jerárquicos (h1→h2→h3) | ✅ IMPLEMENTADO | Estructura consistente |
| Alt text en imágenes/SVGs informativos | ⚠️ PARTIAL | SVGs decorativos `aria-hidden="true"`, figuras con `figcaption` |
| Video: subtítulos .vtt + transcript | ❌ MISSING | Video no generado aún |

### 2.4 Herramientas Automatizadas

| Herramienta | Score Objetivo | Estado |
|-------------|----------------|--------|
| Lighthouse Accessibility | ≥ 95 | ⏳ PENDING (último run: no reportado) |
| axe-core (violaciones críticas) | 0 | ⏳ PENDING |
| WAVE (errores) | 0 | ⏳ PENDING |

---

## 3. Testing de Performance

### 3.1 Lighthouse (Último run: 2026-08-15T22:20:20Z)

| Métrica | Score | Valor | Objetivo | Estado |
|---------|-------|-------|----------|--------|
| **Performance** | 55 | — | ≥ 90 | ❌ FAIL |
| **Accessibility** | (no reportado) | — | ≥ 95 | ⏳ PENDING |
| **Best Practices** | (no reportado) | — | ≥ 90 | ⏳ PENDING |
| **SEO** | (no reportado) | — | ≥ 90 | ⏳ PENDING |

### 3.2 Core Web Vitals

| Métrica | Valor | Objetivo | Estado |
|---------|-------|----------|--------|
| **LCP** (Largest Contentful Paint) | 2.8 s | < 2.5 s | ❌ FAIL |
| **FID** (First Input Delay) / TBT | 0 ms / 0 ms | < 100 ms | ✅ PASS |
| **CLS** (Cumulative Layout Shift) | 0 | < 0.1 | ✅ PASS |
| **FCP** (First Contentful Paint) | 2.8 s | < 1.8 s | ❌ FAIL |
| **TTI** (Time to Interactive) | 2.8 s | < 3.5 s | ✅ PASS |

### 3.3 Oportunidades de Mejora (Lighthouse)

1. **Eliminar recursos bloqueantes de renderizado** — Fonts Google Fonts (preconnect ya presente)
2. **Imágenes de tamaño adecuado** — Video poster faltante, considerar lazy-load
3. **Minificar CSS/JS** — Actualmente inline + archivos separados sin minificar
4. **Caché eficiente** — Headers de caché por configurar en hosting (GitHub Pages)

### 3.4 Mobile vs Desktop

| Dispositivo | Performance | Accesibilidad | Estado |
|-------------|-------------|---------------|--------|
| Desktop (simulado) | 55 | — | ❌ FAIL |
| Mobile (simulado moto g power) | (no reportado separado) | — | ⏳ PENDING |

---

## 4. Validación HTML/CSS/JS

### 4.1 W3C Validator

| Página | Errores | Warnings Críticos | Estado |
|--------|---------|-------------------|--------|
| `learning-path-ia.html` | ⏳ PENDING | ⏳ PENDING | ⏳ PENDING |
| `modulo-01-fundamentos.html` | ⏳ PENDING | ⏳ PENDING | ⏳ PENDING |
| `modulo-02-stack-tecnico.html` | ⏳ PENDING | ⏳ PENDING | ⏳ PENDING |
| `modulo-03-primer-agente.html` | ⏳ PENDING | ⏳ PENDING | ⏳ PENDING |
| `modulo-04-automatizacion-n8n.html` | ⏳ PENDING | ⏳ PENDING | ⏳ PENDING |
| `modulo-05-testing-observabilidad.html` | ⏳ PENDING | ⏳ PENDING | ⏳ PENDING |
| `modulo-06-despliegue-escalado.html` | ⏳ PENDING | ⏳ PENDING | ⏳ PENDING |
| `modulo-07-proyecto-final.html` | ⏳ PENDING | ⏳ PENDING | ⏳ PENDING |

### 4.2 Consola Navegador (Localhost)

| Error/Warning | Fuente | Severidad | Acción |
|---------------|--------|-----------|--------|
| `Failed to load resource: 404 (File not found)` | `assets/video/poster.jpg` | ERROR | Generar poster o remover referencia |
| `Failed to load resource: 404 (File not found)` | `assets/video/learning-path-demo.mp4` | ERROR | Generar video demo |
| `Failed to load resource: 404 (File not found)` | `favicon.ico` | ERROR | Añadir favicon |
| Mixed Content | — | — | ❌ NINGUNO (local HTTP) |

**Estado consola:** ❌ 3 ERRORES CRÍTICOS (assets de video faltantes)

---

## 5. Testing Cross-Browser

| Navegador | Versión | Landing | Módulos | Video | Estado |
|-----------|---------|---------|---------|-------|--------|
| Chrome | Última 2 | ⏳ PENDING | ⏳ PENDING | ❌ N/A | ⏳ PENDING |
| Firefox | Última 2 | ⏳ PENDING | ⏳ PENDING | ❌ N/A | ⏳ PENDING |
| Safari | Última 2 | ⏳ PENDING | ⏳ PENDING | ❌ N/A | ⏳ PENDING |
| Edge | Última 2 | ⏳ PENDING | ⏳ PENDING | ❌ N/A | ⏳ PENDING |
| iOS Safari | Última 2 | ⏳ PENDING | ⏳ PENDING | ❌ N/A | ⏳ PENDING |
| Chrome Android | Última 2 | ⏳ PENDING | ⏳ PENDING | ❌ N/A | ⏳ PENDING |

**Nota:** Video no disponible para testing cross-browser hasta generación.

---

## 6. Testing de Usabilidad (Perfil AI Solution Builder)

### 6.1 Recorrido Completo

| Paso | Descripción | Tiempo Estimado | Tiempo Real | Estado |
|------|-------------|-----------------|-------------|--------|
| 1 | Landing → Hero + Video demo | 2 min | — | ⏳ PENDING |
| 2 | Landing → Overview ruta (7 pasos) | 3 min | — | ⏳ PENDING |
| 3 | Módulo 01: Fundamentos | 4–6 h | — | ✅ CONTENT READY |
| 4 | Módulo 02: Stack técnico | 8 h | — | ✅ CONTENT READY |
| 5 | Módulo 03: Primer agente | 12 h | — | ✅ CONTENT READY |
| 6 | Módulo 04: Automatización n8n | 10 h | — | ✅ CONTENT READY |
| 7 | Módulo 05: Testing observabilidad | 6 h | — | ✅ CONTENT READY |
| 8 | Módulo 06: Despliegue escalado | 6 h | — | ✅ CONTENT READY |
| 9 | Módulo 07: Proyecto final | Proyecto | — | ✅ CONTENT READY |

### 6.2 Criterios Cualitativos

| Aspecto | Evaluación | Observaciones |
|---------|------------|---------------|
| Claridad ejercicios | ✅ BUENA | Pasos concretos, comandos copiables, checkpoints |
| Checkpoints autoevaluación | ✅ BUENA | 3-5 preguntas por módulo, feedback inmediato JS |
| Recursos verificados con fecha | ✅ EXCELENTE | `data-validated` / `resource-meta` con fecha |
| Navegación entre módulos | ✅ BUENA | Prev/Next + Overview, progress tracking localStorage |
| Video demo integración | ❌ FALTANTE | Placeholder sin video real |

---

## 7. Issues Identificados

### 7.1 Críticos (Bloqueantes para Release)

| ID | Descripción | Impacto | Responsable | Estado |
|----|-------------|---------|-------------|--------|
| CR-01 | Video demo assets faltantes (poster.jpg + learning-path-demo.mp4) | Console errors 404, Lighthouse performance, UX incompleta | lc-fullstack-dev (Hyperframes) | 🔴 OPEN |
| CR-02 | LCP/FCP 2.8s > 2.5s threshold | Performance FAIL, Core Web Vitals | lc-fullstack-dev (optimización) | 🔴 OPEN |
| CR-03 | Favicon.ico 404 | Console error, SEO minor | lc-fullstack-dev | 🔴 OPEN |

### 7.2 Mayores

| ID | Descripción | Impacto | Responsable | Estado |
|----|-------------|---------|-------------|--------|
| MJ-01 | Validación W3C pendiente en 9 páginas | Compliance, posibles errores HTML | lc-qa-engineer | 🟡 PENDING |
| MJ-02 | Cross-browser testing pendiente | Compatibilidad desconocida | lc-qa-engineer | 🟡 PENDING |
| MJ-03 | Lighthouse Accessibility/Best Practices/SEO no reportados | Scores desconocidos | lc-qa-engineer | 🟡 PENDING |
| MJ-04 | axe-core/WAVE audit manual pendiente | Accesibilidad compliance | lc-qa-engineer | 🟡 PENDING |

### 7.3 Menores / Mejoras

| ID | Descripción | Impacto | Responsable | Estado |
|----|-------------|---------|-------------|--------|
| MN-01 | CSS/JS minificación para producción | Performance marginal | lc-fullstack-dev | 🟢 BACKLOG |
| MN-02 | Headers de caché en GitHub Pages | Performance repeat visits | lc-fullstack-dev (n8n deploy) | 🟢 BACKLOG |
| MN-03 | Service Worker para offline-first | PWA capabilities | lc-fullstack-dev (v2) | 🟢 BACKLOG |

---

## 8. Veredicto Final

### Criterios de Aceptación (del Kanban t_b87c3be4)

| Criterio | Estado | Evidencia |
|----------|--------|-----------|
| 100% enlaces externos validados (200 OK) | ✅ PASS | `link_validation_final.csv` — 10/10 OK |
| WCAG 2.1 AA: 0 violaciones críticas, ≤ 5 menores | ⏳ PENDING | Requiere axe-core/WAVE + validación manual |
| Lighthouse scores ≥ umbrales (Perf≥90, A11y≥95, BP≥90, SEO≥90) | ❌ FAIL | Performance 55 (LCP/FCP 2.8s) |
| W3C Validator clean | ⏳ PENDING | 9 páginas por validar |
| Consola limpia | ❌ FAIL | 3 errores 404 (video assets + favicon) |
| Cross-browser OK | ⏳ PENDING | 6 navegadores por testear |
| Checklist firmado y archivado | 🟡 IN PROGRESS | Este documento |

### Decisión QA

> **QA STATUS: CONDITIONAL PASS — BLOQUEADO POR IMPLEMENTACIÓN**
>
> El contenido educativo (7 módulos + landing + guía) está **completo y bien estructurado**. La navegación, semántica, accesibilidad base y recursos verificados cumplen.
>
> **NO SE PUEDE APROBAR PARA PRODUCCIÓN HASTA QUE:**
> 1. Se generen los assets de video (Hyperframes + Gloria TTS) — **bloqueante CR-01**
> 2. Se optimice performance LCP/FCP < 2.5s — **bloqueante CR-02**
> 3. Se resuelva favicon.ico 404 — **bloqueante CR-03**
> 4. Se completen auditorías W3C, axe-core, WAVE, cross-browser y Lighthouse completo
>
> **Próxima acción:** Reanudar validación completa cuando t_cf5cf1c5 (implementación) marque done y t_7eb4c309 (tarea QA correcta con dependencias) pase a ready.

---

## 9. Firma

| Rol | Nombre | Fecha | Firma |
|-----|--------|-------|-------|
| **QA Engineer** | **Lilis (lc-qa-engineer)** | **2026-08-15** | ✅ **Firmado condicionalmente** |
| Product Owner | — | — | ⏳ Pendiente |
| Tech Lead | — | — | ⏳ Pendiente |

---

**Observaciones finales:**
- Este checklist corresponde a la tarea **t_b87c3be4** (QA prematura sin dependencias correctas).
- La tarea QA canónica con dependencias correctas es **t_7eb4c309** (depende de t_cf5cf1c5).
- Validación completa se ejecutará en t_7eb4c309 cuando la implementación esté lista.
- Hallazgos documentados aquí sirven como baseline para la validación final.

---

*Documento generado automáticamente como parte del proceso QA Little Crab Solutions. Versión 1.0 — 2026-08-15*