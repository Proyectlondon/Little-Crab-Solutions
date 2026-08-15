# Guía de Uso — AI Solution Builder (Learning Path IA)

**Versión**: 1.0  
**Fecha**: 2026-08-15  
**Audiencia**: Analista IT + Diseñador Visual (NO desarrollador)  
**Tiempo total estimado**: 46-62 horas (7 módulos + proyecto final)

---

## 1. ¿Qué es el AI Solution Builder?

El **AI Solution Builder** es un perfil profesional que **diseña, construye y despliega soluciones de IA aplicada** para PYMEs **sin escribir código backend complejo**.

**Tu superpoder**: Conectas **problemas de negocio** con **herramientas de IA local** (n8n, Ollama, Hyperframes) para entregar valor en días, no meses.

| Lo que NO necesitas | Lo que SÍ usas |
|---------------------|----------------|
| ❌ Python, Node.js, React | ✅ n8n (visual workflow builder) |
| ❌ Kubernetes, Terraform | ✅ Docker Compose (un archivo) |
| ❌ Cloud APIs caras (OpenAI $) | ✅ Ollama (modelos locales, gratis, privados) |
| ❌ ML Ops complejo | ✅ LangSmith / W&B (observabilidad simple) |
| ❌ Video editing pro | ✅ Hyperframes + Gloria TTS (video IA en minutos) |

---

## 2. Prerrequisitos (Antes de Empezar)

### 2.1 Hardware Mínimo
| Componente | Mínimo | Recomendado |
|------------|--------|-------------|
| **GPU** | RTX 3060 12GB / 4060 8GB | RTX 4070 12GB+ / 4090 24GB |
| **RAM** | 16 GB | 32-64 GB |
| **Disco** | 100 GB libre (SSD/NVMe) | 500 GB+ NVMe |
| **OS** | Windows 10/11 (WSL2) | Windows 11 Pro + WSL2 Ubuntu 22.04 |

> 💡 **Nota**: Si no tienes GPU dedicada, puedes usar modelos cuantizados (GGUF) en CPU via Ollama, pero será lento. Opción: RunPod cloud GPU ($0.44/h).

### 2.2 Software Base (Instalar EN ORDEN)
```powershell
# 1. Git
winget install Git.Git

# 2. Docker Desktop (habilitar WSL2 Integration + GPU)
# https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe

# 3. Ollama (nativo Windows - mejor rendimiento GPU)
winget install Ollama.Ollama
ollama pull qwen2.5:3b
ollama pull llama3.2:3b

# 4. VS Code (editor recomendado)
winget install Microsoft.VisualStudioCode

# 5. Node.js 20+ (para n8n CLI, Hyperframes)
winget install OpenJS.NodeJS.LTS
```

### 2.3 Cuentas Gratuitas (Crear AHORA)
- [ ] **GitHub** (repo privado + Actions)
- [ ] **LangSmith** (https://smith.langchain.com — 5k trazas gratis/mes)
- [ ] **Deepgram** (https://console.deepgram.com — $200 créditos gratis → Gloria TTS)
- [ ] **Notion** (plan gratis + integration token)
- [ ] **Discord/Slack/Telegram** (webhook URLs para notificaciones)
- [ ] **Railway / Render / Fly.io** (deploy gratis tier)

---

## 3. Cómo Seguir la Ruta (Metodología)

### 3.1 Orden de Módulos (SECUENCIAL - No saltear)
```
M01 (4-6h) → M02 (8h) → M03 (12h) → M04 (10h) → M05 (6h) → M06 (6h) → M07 (20h)
   │           │           │           │           │           │           │
Fundamentos  Stack      Primer     Automat.   Observab.   Deploy     Proyecto
IA Aplicada  Técnico    Agente     Producción              Real       Final
```

**Por qué orden fijo**: Cada módulo construye sobre el anterior. M03 usa stack de M02. M04 usa agente de M03. M07 integra TODO.

### 3.2 Ritmo Recomendado
| Perfil | Sesiones/semana | Duración/sesión | Tiempo total |
|--------|-----------------|-----------------|--------------|
| **Intensivo** | 3-4 | 4h | 3-4 semanas |
| **Compatibilizado** | 1-2 | 4h | 8-12 semanas |
| **Fin de semana** | 1 | 8h | 6-8 semanas |

> ⚠️ **No hagas maratones de 12h**. La IA aplicada requiere asimilación. Mejor 4h enfocadas + sueño.

### 3.3 Definition of Done por Módulo
Antes de pasar al siguiente, **DEBES** tener:
- [ ] Contenido teórico leído y comprendido
- [ ] **Ejercicio guiado completado end-to-end** (verificado con comandos de test)
- [ ] Checkpoint de autoevaluación ≥ 80% (4/5 correctas)
- [ ] Artefactos guardados en Git (workflows, prompts, scripts)
- [ ] Commit semántico: `git commit -m "feat(m03): planner agent functional + golden set 90%"`

---

## 4. Setup del Entorno (Paso a Paso)

### 4.1 Clonar Repo Base
```bash
cd D:\
git clone https://github.com/Proyectlondon/little-crab-learning-path.git Little Crab Solutions
cd "Little Crab Solutions"
```

### 4.2 Levantar Stack Local (M02)
```bash
cd n8n
cp .env.dev.example .env.dev
# Edita .env.dev con tus passwords
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Verificar
curl http://localhost:5678/healthz  # n8n
curl http://localhost:11434/api/tags  # Ollama
```

### 4.3 Configurar n8n Primera Vez
1. Abre `http://localhost:5678`
2. Login: `admin` / password de `.env.dev`
3. Settings → Workflows → **Enable "Save manual executions"**
4. Credentials → New → **Postgres** (host: postgres, port: 5432, db: n8n, user/pass de .env)
5. Credentials → New → **Slack / Telegram / Notion** (tokens de tus cuentas)

### 4.4 Configurar OpenWebUI
```bash
docker run -d -p 9120:8080 -v openwebui:/app/backend/data --name openwebui ghcr.io/open-webui/open-webui:main
# Abre http://localhost:9120 → crea admin → selecciona modelo qwen2.5:3b
```

### 4.5 Variables de Entorno Globales (`.env.global`)
```bash
# Copia y edita
cp .env.global.example .env.global

# Contenido mínimo:
N8N_HOST=localhost
N8N_PROTOCOL=http
WEBHOOK_URL=http://localhost:5678/
OLLAMA_HOST=http://localhost:11434
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=tu_langsmith_key
LANGCHAIN_PROJECT=little-crab-learning
DEEPGRAM_API_KEY=tu_deepgram_key
NOTION_TOKEN=secret_xxx
NOTION_DATABASE_ID=xxx
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxx
TELEGRAM_BOT_TOKEN=xxx
TELEGRAM_CHAT_ID=xxx
```

---

## 5. Qué Esperar en Cada Módulo (Resumen Rápido)

| Módulo | Entregable Principal | Tiempo Real (con pruebas) | Dificultad |
|--------|---------------------|---------------------------|------------|
| **M01** | Clasificador local funcionando (curl + JSON) | 4-5h | ⭐⭐ |
| **M02** | Stack Docker arriba + workflow versionado en Git | 7-8h | ⭐⭐⭐ |
| **M03** | Agente Prompt-to-Action con 3 tools (web, SQL, notify) | 10-12h | ⭐⭐⭐⭐ |
| **M04** | Pipeline Forms→IA→Multicanal + DLQ + tests | 9-10h | ⭐⭐⭐⭐ |
| **M05** | LangSmith traces + golden set eval ≥85% + Grafana dashboard | 5-6h | ⭐⭐⭐ |
| **M06** | Deploy Railway + HTTPS + RunPod Ollama + backup testado | 5-6h | ⭐⭐⭐⭐ |
| **M07** | Agente Intake completo + Video demo + Notion + Discord | 18-20h | ⭐⭐⭐⭐⭐ |

---

## 6. Soporte y Comunidad

### 6.1 Cuando Te Atasques (Protocolo)
1. **Relee el ejercicio guiado** — 80% de errores son saltarse pasos
2. **Verifica prerrequisitos** — ¿Ollama corriendo? ¿n8n healthy? ¿GPU detectada?
3. **Logs**: `docker compose logs -f n8n` / `docker compose logs ollama`
4. **Busca en issues del repo** — `git log --oneline --grep="tu_error"`
5. **Pregunta en Discord** — Canal `#learning-path-ia` (equipo + alumni)

### 6.2 Canales de Ayuda
| Canal | Para qué | Respuesta típica |
|-------|----------|------------------|
| **Discord #learning-path-ia** | Dudas técnicas, bloqueos, compartir logros | < 2h (equipo + alumni) |
| **GitHub Issues** | Bugs en contenido, ejercicios rotos, mejoras | < 24h |
| **Email** | Privado / sensible / contratación | littlecrabsolutions@gmail.com |
| **Sesiones Office Hours** | Quincenales, en vivo, grabadas | Calendario en Notion |

### 6.3 Recursos de Referencia Rápida
- **Cheatsheet n8n**: `docs/cheatsheets/n8n-nodes.md`
- **Ollama Models**: `docs/references/ollama-models.md` (cuáles caben en tu VRAM)
- **Prompts Library**: `prompts/` (versionados, listos para copiar)
- **Workflows Exportados**: `n8n/workflows/` (importar en n8n UI)
- **Hyperframes Templates**: `hyperframes/templates/`

---

## 7. Siguientes Pasos (Tras Completar la Ruta)

### 7.1 Certificación AI Solution Builder
Al terminar M07 con checklist validado:
1. Envía PR a repo con tus artefactos (workflows, prompts, video demo)
2. Equipo revisa → feedback → **Badge digital verificable** (Blockcerts)
3. Acceso a: Plantillas avanzadas, Alumni Discord, Referidos clientes

### 7.2 Especializaciones (Elige tu Camino)
| Camino | Enfoque | Módulos Adicionales |
|--------|---------|---------------------|
| **Agent Engineer** | Agentes multi-paso, ReAct, planificación | M03-avanzado, M07-v2 (multi-agente) |
| **Automation Architect** | n8n enterprise, governance, escalado | M04-avanzado, M06-k8s |
| **AI Product Builder** | Producto end-to-end, métricas, growth | M05-avanzado, M07-comercial |
| **Creative AI** | Hyperframes, ComfyUI, video/imagen gen | ComfyUI, Hyperframes-avanzado |

### 7.3 Oportunidades Comerciales (Little Crab)
- **Freelance**: Proyectos intake → diagnóstico → implementación ($2k-15k)
- **Referidos**: 20% fee primer año por clientes que traigas
- **Equipo**: Contratación part-time/full-time tras 3 proyectos validados

---

## 8. Preguntas Frecuentes (FAQ)

**P: ¿Puedo hacerlo en Mac/Linux?**
R: Sí. Docker Compose es multiplataforma. Cambia `host.docker.internal` → `172.17.0.1` en Linux. GPU en Mac: solo Apple Silicon (MPS), no CUDA.

**P: ¿Y si mi GPU es 8GB VRAM (RTX 4060)?**
R: Modelos 3B/4B (qwen2.5:3b, llama3.2:3b, phi3:3.8b) corren bien. Para 7B: offload CPU (`ollama run qwen2.5:7b --verbose` muestra capas GPU/CPU). O usa RunPod.

**P: ¿Necesito saber programar?**
R: **No**. n8n es visual. Prompts son texto. Scripts bash/Python se copian y adaptan. Aprendes lógica de sistemas, no sintaxis.

**P: ¿Cuánto cuesta todo en producción?**
R: **$0-50/mes** si usas free tiers (Railway, Render, Neon DB, LangSmith, Deepgram credits). GPU cloud solo cuando la usas (RunPod $0.44/h). Sin costes fijos obligatorios.

**P: ¿Puedo usar OpenAI/Anthropic en vez de Ollama?**
R: Sí. Cambia HTTP Request URL + API Key. Pero: **pierdes privacidad, añades coste variable, dependes de terceros**. La ruta enseña local-first por principio.

**P: ¿El video demo es obligatorio?**
R: **Sí**. Es tu diferenciador. Clientes entienden valor en 45s video > 10pág PDF. Hyperframes + Gloria = 5 min generación.

---

## 9. Checklist Final de Entrega (Para Certificación)

```
[ ] M01: Clasificador local + 3 tests curl documentados
[ ] M02: docker-compose.yml + workflow Git + .env.dev
[ ] M03: Agente planner + 3 tools + golden set 10 casos
[ ] M04: Pipeline intake + DLQ + k6 load test + idempotencia
[ ] M05: LangSmith project + eval ≥85% + Grafana dashboard screenshot
[ ] M06: Railway URL HTTPS + RunPod Ollama + backup restore test log
[ ] M07: Agente intake end-to-end + Video MP4 <60s + Notion page + Discord notif
[ ] README.md proyecto completo (arquitectura, setup, troubleshooting)
[ ] Video case study 2-3 min (tú explicando el proyecto) — opcional pero recomendado
```

---

## 10. Contacto y Créditos

**Creado por**: Little Crab Solutions Team  
- **Doug** (lc-solution-architect) — Arquitectura, ADR, decisiones técnicas  
- **Ristow** (lc-product-intake) — Contenido educativo, definición producto  
- **Johncho** (lc-fullstack-developer) — Implementación, código, deploy  
- **Lilis** (lc-qa-engineer) — Validación, accesibilidad, checklist QA  

**Licencia**: Uso educativo interno Little Crab. No redistribuir sin autorización.

**Versión**: 1.0 (2026-08-15) — Primera versión completa Learning Path IA

---

> *"La mejor forma de predecir el futuro es construirlo. Tú acabas de aprender las herramientas para construir el futuro de la IA en PYMEs Latam. Úsalas bien."*  
> — **John Esteban**, Founder Little Crab Solutions