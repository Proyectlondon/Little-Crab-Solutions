# Módulo 02: Stack Técnico Básico — n8n, Ollama, Docker, Git (8h)

## Objetivos de Aprendizaje
Al completar este módulo, serás capaz de:
- ✅ Instalar y configurar n8n, Ollama, Docker Desktop y Git en Windows 10/11
- ✅ Conectar n8n con Ollama (local) y validar la comunicación HTTP
- ✅ Usar Docker Compose para levantar stacks reproducibles (n8n + Postgres + Ollama)
- ✅ Versionar tus workflows n8n y prompts con Git (commits semánticos, branches)
- ✅ Diagnosticar problemas comunes: puertos, volúmenes, permisos, red Docker ↔ host

---

## Contenido Teórico-Práctico

### 1. Por Qué Este Stack (y No Otro)

| Herramienta | Rol en AI Solution Builder | Alternativa (por qué NO) |
|-------------|----------------------------|--------------------------|
| **n8n** | Orquestador visual de flujos (no-code/low-code) | Zapier/Make: cloud, caro, vendor lock-in |
| **Ollama** | Runtime de modelos locales (privacidad, costo 0) | LM Studio: solo UI, sin API para n8n |
| **Docker** | Empaquetado reproducible (mismo entorno dev/prod) | Instalación manual: "funciona en mi máquina" |
| **Git** | Versionado de workflows, prompts, configs | Sin Git: no hay rollback, no hay colaboración |

**Filosofía**: Todo corre en **tu máquina** (o servidor propio). Cero dependencias SaaS obligatorias.

### 2. Arquitectura de Referencia (Local-First)

```
┌─────────────────────────────────────────────────────────────────┐
│                        TU MÁQUINA (Windows)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   n8n :5678  │◀▶│  Ollama :11434│  │  Docker     │          │
│  │  (Workflow)  │  │  (Modelos)   │  │  (Contened.)│          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                 │                   │
│         ▼                 ▼                 ▼                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Docker Network: llc-network                  │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────┐  │   │
│  │  │ n8n     │  │ Postgres│  │ Ollama  │  │  (otros)    │  │   │
│  │  │ (web)   │  │ (datos) │  │ (GPU)   │  │  ComfyUI,   │  │   │
│  │  └─────────┘  └─────────┘  └─────────┘  │  Hyperframe │  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

**Clave**: n8n habla con Ollama via `http://host.docker.internal:11434` (Docker Desktop Windows/Mac) o `http://172.17.0.1:11434` (Linux).

### 3. Instalación Paso a Paso (Windows 10/11)

#### 3.1 Prerrequisitos (verifica ANTES de instalar)
```powershell
# En PowerShell como Administrador
# 1. WSL2 + Virtualization habilitada en BIOS
wsl --install --no-distribution
# Reinicia PC

# 2. Verificar GPU detectada en WSL
wsl --update
wsl -d Ubuntu -e nvidia-smi  # Debe mostrar tu RTX 4060
```

#### 3.2 Docker Desktop
1. Descarga: https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe
2. Instala → **Settings → Resources → WSL Integration** → habilita tu distro (Ubuntu)
3. **Settings → Resources → Advanced** → GPU support: **Enable**
4. Verifica: `docker run --rm --gpus all nvidia/cuda:12.4-base nvidia-smi`

#### 3.3 Ollama (Windows nativo, NO en Docker — mejor rendimiento GPU)
```powershell
# Opción A: Instalador oficial (recomendado)
# https://ollama.com/download/windows → OllamaSetup.exe

# Opción B: Winget
winget install Ollama.Ollama

# Verificar
ollama --version
ollama list
# Descargar modelo base (3B = cabe en 8GB VRAM)
ollama pull qwen2.5:3b
ollama pull llama3.2:3b
```

#### 3.4 n8n (via Docker Compose — reproducible)
Crea `docker-compose.yml` en `D:\Little Crab Solutions\n8n\`:

```yaml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=localhost
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - WEBHOOK_URL=http://localhost:5678/
      - GENERIC_TIMEZONE=America/Bogota
      - TZ=America/Bogota
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=tu_password_seguro
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=n8n
      - DB_POSTGRESDB_PASSWORD=n8n_password
    volumes:
      - n8n_data:/home/node/.n8n
      - ./workflows:/home/node/.n8n/workflows  # Opcional: exportar workflows
    depends_on:
      - postgres
    networks:
      - llc-network
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    container_name: n8n-postgres
    environment:
      - POSTGRES_DB=n8n
      - POSTGRES_USER=n8n
      - POSTGRES_PASSWORD=n8n_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - llc-network
    restart: unless-stopped

  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    networks:
      - llc-network
    restart: unless-stopped

volumes:
  n8n_data:
  postgres_data:
  ollama_data:

networks:
  llc-network:
    driver: bridge
```

**Levantar todo**:
```powershell
cd D:\Little Crab Solutions\n8n
docker compose up -d
# Ver logs
docker compose logs -f n8n
```

#### 3.5 Git (si no lo tienes)
```powershell
winget install Git.Git
# Configurar identidad (Little Crab)
git config --global user.name "John Esteban"
git config --global user.email "littlecrabsolutions@gmail.com"
git config --global init.defaultBranch main
```

### 4. Conectar n8n ↔ Ollama (El Puente Crítico)

**En n8n (UI):**
1. Workflow nuevo → **HTTP Request** node
2. URL: `http://host.docker.internal:11434/api/generate`  (Windows/Mac Docker Desktop)
   - *Si n8n corre en host (no Docker):* `http://localhost:11434/api/generate`
3. Method: POST
4. Headers: `Content-Type: application/json`
5. Body (JSON):
   ```json
   {
     "model": "qwen2.5:3b",
     "prompt": "={{ $json.prompt }}",
     "stream": false,
     "format": "json"
   }
   ```

**Test rápido:**
```bash
curl -X POST http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model": "qwen2.5:3b", "prompt": "Di hola en JSON: {\"msg\": \"hola\"}", "stream": false, "format": "json"}'
```

### 5. Git para Workflows n8n (Versionado Real)

**Estructura recomendada:**
```
D:\Little Crab Solutions\
├── n8n/
│   ├── docker-compose.yml
│   ├── workflows/           # Exportados desde n8n UI
│   │   ├── clasificador-solicitudes.json
│   │   ├── intake-agent.json
│   │   └── ...
│   └── .gitignore
├── prompts/                 # Prompts versionados por separado
│   ├── system/
│   │   ├── clasificador.md
│   │   └── extractor-facturas.md
│   └── few-shots/
└── .git/
```

**Flujo de trabajo diario:**
```bash
# 1. Editas workflow en n8n UI
# 2. Export: Workflow → Export → Save as JSON → workflows/
# 3. Commit semántico
git add n8n/workflows/clasificador-solicitudes.json
git commit -m "feat(clasificador): añade validación schema JSON salida Ollama

- Añade nodo IF para verificar categoria en lista permitida
- Si no válida → flag revision_humana=true
- Tests: 3 casos edge cubiertos"
# 4. Push a tu remote (GitHub/GitLab/self-hosted)
git push origin main
```

**Convención commits (Conventional Commits):**
- `feat`: nueva funcionalidad
- `fix`: corrección bug
- `refactor`: restructuración sin cambio comportamiento
- `docs`: solo documentación
- `test`: tests
- `chore`: mantenimiento (deps, config)

---

## Ejercicio Guiado: Stack Completo Funcional (2h)

**Objetivo**: Tener n8n + Ollama + Postgres corriendo en Docker, conectados, y un workflow versionado en Git.

### Prerrequisitos
- [ ] Docker Desktop corriendo (ballena en system tray)
- [ ] WSL2 + Ubuntu + GPU detectada (`nvidia-smi` en WSL)
- [ ] Git configurado con tu identidad

### Paso 1: Levantar Stack (30 min)
```powershell
cd D:\Little Crab Solutions\n8n
docker compose up -d
# Esperar 30-60s que Postgres y n8n inicien
docker compose ps
# Debe mostrar: n8n (healthy), postgres (healthy), ollama (running)
```

### Paso 2: Configurar n8n Primera Vez (15 min)
1. Abre `http://localhost:5678`
2. Login: `admin` / `tu_password_seguro` (del docker-compose.yml)
3. Completa setup: nombre, email, password (puede ser mismo)
4. **Settings → Workflows** → habilita "Save manual executions"

### Paso 3: Probar Ollama desde n8n (15 min)
1. Nuevo workflow → **HTTP Request** node
2. Configura como en sección 4 arriba
3. **Test URL** → debe devolver JSON con `response`
4. Si error "connection refused": verifica `host.docker.internal` vs `localhost`

### Paso 4: Crear Workflow "Hola Mundo IA" (30 min)
1. **Webhook** node → path: `hola-ia`
2. **HTTP Request** → Ollama (prompt: `"Di hola en español, una frase corta"`)
3. **Set** node → limpia respuesta: `mensaje = {{ JSON.parse($json.response).response }}`
4. **Respond to Webhook** → `{{ $json.mensaje }}`
5. **Save** → **Activate**

### Paso 5: Probar End-to-End (10 min)
```bash
curl -X POST http://localhost:5678/webhook/hola-ia
# Debe responder: "¡Hola! ¿En qué puedo ayudarte hoy?" (o similar)
```

### Paso 6: Exportar y Versionar (20 min)
```bash
cd D:\Little Crab Solutions
git init
# En n8n UI: Workflow → Export → Save as JSON → n8n/workflows/hola-mundo-ia.json
git add .
git commit -m "feat(stack): stack base n8n+ollama+postgres + workflow hola-mundo-ia

- Docker Compose con 3 servicios (n8n, postgres, ollama GPU)
- n8n autenticado, persistencia Postgres
- Ollama con acceso GPU via deploy.resources
- Workflow de prueba: webhook → ollama → respuesta
- Validado end-to-end con curl"
```

### Paso 7: Backup/Restore Rápido (10 min)
```bash
# Backup volumes (datos n8n + modelos Ollama)
docker compose down
tar -czf backup-$(date +%Y%m%d).tar.gz n8n_data postgres_data ollama_data
# Restore:
# tar -xzf backup-YYYYMMDD.tar.gz
# docker compose up -d
```

---

## Recursos Verificados (Validados 2026-08-15)

| URL | Título | Descripción | Validación |
|-----|--------|-------------|------------|
| https://docs.docker.com/desktop/install/windows/ | Docker Desktop Windows Install | Guía oficial instalación + WSL2 + GPU | 200 OK |
| https://ollama.com/download/windows | Ollama Windows Installer | Instalador nativo Windows (mejor perf GPU que Docker) | 200 OK |
| https://docs.n8n.io/hosting/docker/ | n8n Docker Hosting | Docs oficiales: compose, env vars, persistencia | 200 OK |
| https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-base.httprequest/ | n8n HTTP Request Node | Para llamar Ollama API desde n8n | 200 OK |
| https://github.com/ollama/ollama/blob/main/docs/api.md | Ollama API Reference | Endpoints: /api/generate, /api/chat, /api/embeddings | 200 OK |
| https://git-scm.com/book/en/v2 | Pro Git Book (gratis) | Referencia completa Git, branching, workflows | 200 OK |
| https://www.conventionalcommits.org/en/v1.0.0/ | Conventional Commits | Spec para commits semánticos legibles por máquina | 200 OK |

---

## Checkpoint de Autoevaluación

1. **Docker vs Ollama nativo**: ¿Por qué Ollama se recomienda nativo en Windows y no en Docker?
2. **Red Docker**: En n8n (contenedor) → Ollama (host), ¿qué URL usas? ¿Por qué `host.docker.internal`?
3. **Persistencia**: ¿Dónde guarda n8n los workflows si usas Postgres? ¿Y si NO usas Postgres (SQLite)?
4. **Git workflow**: Exportas un workflow de n8n, haces cambios en UI, re-exportas. ¿Qué comando Git ves el diff real?
5. **Troubleshooting**: `curl http://localhost:5678` responde pero `curl http://localhost:11434` no. ¿Cuáles son las 3 causas más probables?

---

### Respuestas

1. **Ollama nativo** = acceso directo a GPU via WSL2/Drivers Windows, sin overhead de virtualización Docker. En Docker: `deploy.resources.reservations.devices[gpu]` funciona pero añade latencia y complejidad; modelo en `/root/.ollama` dentro del contenedor (volumen) vs nativo en `C:\Users\<user>\.ollama`.
2. **`http://host.docker.internal:11434`** — Docker Desktop expone el host en ese DNS especial. `localhost` dentro del contenedor = el propio contenedor. `172.17.0.1` = gateway Docker (Linux only, cambia).
3. **Con Postgres**: tabla `workflow_entity` en BD `n8n`. **Sin Postgres (SQLite)**: archivo `~/.n8n/database.sqlite` (volumen `n8n_data`). Postgres = producción, multi-instancia, backups SQL.
4. `git diff n8n/workflows/mi-workflow.json` — muestra cambios en JSON (nodos, conexiones, params). Útil para code review de lógica de flujo.
5. Causas: (a) Ollama no corriendo (`ollama serve` o servicio Windows), (b) Puerto 11434 bloqueado por firewall/antivirus, (c) Ollama escuchando solo en `127.0.0.1` no `0.0.0.0` → `OLLAMA_HOST=0.0.0.0` en env.

---

## Siguiente Paso
→ **Módulo 03**: Primer Agente — Prompt-to-Action con OpenWebUI + n8n (12h). Diseña, prueba y versiona tu primer agente que clasifica, extrae y actúa.