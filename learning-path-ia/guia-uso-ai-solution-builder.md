# Guía de Uso — AI Solution Builder

> **Versión:** 1.0  
> **Fecha:** 2026-08-15  
> **Autor:** Little Crab Solutions  
> **Perfil objetivo:** Analista de IT / Diseñador visual (no desarrollador)

---

## 🎯 Propósito

Esta guía explica cómo usar el **Learning Path IA** para convertirte en **AI Solution Builder**: alguien que diseña, construye y despliega agentes de IA que automatizan procesos de negocio reales, sin necesidad de escribir backend complejo.

El camino está pensado para perfiles **analíticos/visuales** que ya manejan herramientas como Excel, Notion, Figma, n8n o Google Workspace, y quieren dar el salto a **IA aplicada**.

---

## 🗺️ Estructura del Learning Path

| Módulo | Título | Duración estimada | Foco |
|--------|--------|-------------------|------|
| 01 | Fundamentos de IA aplicada | 4–6 h | Conceptos, prompting, RAG, agentes |
| 02 | Stack técnico básico | 8 h | n8n, Ollama, Next.js, Docker |
| 03 | Tu primer agente | 12 h | Pattern Prompt-to-Action, OpenWebUI + n8n |
| 04 | Automatización con n8n | 10 h | Flujos reales: Forms → clasificación → Slack/Telegram |
| 05 | Testing y observabilidad | 6 h | LangSmith, W&B, métricas de agentes |
| 06 | Despliegue y escalado | 6 h | Docker Compose, Railway/Render, dominios |
| 07 | Proyecto final: Agente de Intake | — | Integración completa + demo video + docs |

**Total estimado:** ~46–50 horas (auto-guiado, a tu ritmo)

---

## 🧭 Cómo usar esta guía

### 1. Empieza por el módulo 01
No saltes módulos. Cada uno construye sobre el anterior. Si ya dominas un tema, haz el **checkpoint** al final del módulo para validar y continuar.

### 2. Completa los ejercicios guiados
Cada módulo tiene una sección **Ejercicio** con pasos concretos. Hazlos en tu máquina. No solo leas: **ejecuta**.

### 3. Usa los recursos verificados
En la sección **Recursos** de cada módulo encontrarás enlaces validados (HTTP 200) con fecha de validación. Son tu fuente de verdad.

### 4. Registra tu progreso
El sistema guarda tu avance en `localStorage` del navegador. Al llegar al **Checkpoint** de cada módulo, se marca como completado automáticamente.

### 5. Proyecto final = tu portafolio
El módulo 07 no tiene ejercicios aislados: **es el proyecto final**. Entregables:
- Agente de Intake funcionando (formulario → plan → Notion → Discord + voz Gloria)
- Demo en video vertical (Reels/TikTok) generado con Hyperframes
- Documentación en Notion

Esto es lo que muestras a clientes o empleadores.

---

## 🛠️ Stack que vas a usar

| Herramienta | Para qué | Curva de aprendizaje |
|-------------|----------|---------------------|
| **n8n** | Orquestación visual de flujos | Baja (visual, no-code) |
| **Ollama** | LLMs locales (privacidad, costo $0) | Media (CLI + API) |
| **OpenWebUI** | Interfaz chat para probar prompts | Baja |
| **Deepgram (Gloria)** | TTS español natural | Baja (API key) |
| **Hyperframes** | Video vertical automático | Media (prompt-to-video) |
| **Docker / Docker Compose** | Levantar stack local/prod | Media |
| **LangSmith / W&B** | Observabilidad de agentes | Media |
| **Notion API** | Base de conocimiento / tickets | Baja |
| **Git / GitHub** | Versionado y deploy | Media |

> **Nota:** No necesitas saber programar en Python/Node/Go. El 90% es configuración visual (n8n), prompting y conexión de APIs.

---

## 📦 Requisitos previos

Antes de empezar el **Módulo 02**, ten listo:

- [ ] Cuenta de **GitHub** (gratuita)
- [ ] **Docker Desktop** instalado y corriendo
- [ ] **Node.js 18+** (para Next.js y tooling)
- [ ] Cuenta **Google Workspace** (o Gmail personal para Forms/Sheets)
- [ ] Cuenta **Deepgram** (para TTS Gloria — plan gratuito da 200 min/mes)
- [ ] **Discord** (webhooks para notificaciones)
- [ ] **Notion** (workspace propio, API token)

> Si algo falla en la instalación, revisa la sección **Troubleshooting** al final de cada módulo.

---

## 🎥 Video Demo — Qué esperar

El video demo (vertical 9:16, < 60s) muestra:
1. **Overview visual** de la ruta (45s): animaciones de cada módulo + stack
2. **CTA final** (15s): "Iniciar ruta gratis" + enlace a Módulo 01

Está generado con **Hyperframes + TTS Gloria (Deepgram)**. Subtítulos quemados + archivo `.vtt` para accesibilidad.

---

## ♿ Accesibilidad

Este Learning Path cumple **WCAG 2.1 AA**:
- Contraste de colores verificado
- Navegación 100% por teclado
- ARIA labels en elementos interactivos
- Subtítulos en video (quemados + VTT)
- Semántica HTML correcta
- Focus visible en todos los interactivos

Si encuentras una barrera, reporta en: `contacto@littlecrabsolutions.com`

---

## 🔗 Integración con Little Crab Solutions

Este Learning Path es parte del ecosistema **Little Crab Solutions**:

- **Sitio principal:** `little-crab-solutions.html` — Servicios, proceso, stack, contacto
- **Ruta IA:** `learning-path-ia.html` — Esta guía + landing + módulos
- **Automatizaciones internas:** n8n workflows para deploy, validación de enlaces, generación de video
- **Control plane:** Hermes Desktop + JJ (orquestador local)

---

## 📞 Soporte

| Canal | Para qué |
|-------|----------|
| `contacto@littlecrabsolutions.com` | Dudas técnicas, accesibilidad, bugs |
| Discord (webhook en Módulo 03) | Comunidad, dudas rápidas, show & tell |
| Notion (template en Módulo 07) | Documentación de tu proyecto final |

---

## 📝 Changelog

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | 2026-08-15 | Versión inicial — estructura, módulos 1-7, video, deploy |

---

## ✅ Checklist de inicio rápido

- [ ] Leer esta guía completa
- [ ] Abrir `learning-path-ia.html` en navegador
- [ ] Ver video demo (hero)
- [ ] Clic en **"Iniciar ruta gratis"** → ancla a Módulo 01
- [ ] Completar prerequisitos del Módulo 02
- [ ] Empezar Módulo 01: Fundamentos

---

> **"No vendemos software genérico. Construimos sobre lo que ya usa su equipo."**  
> — Little Crab Solutions