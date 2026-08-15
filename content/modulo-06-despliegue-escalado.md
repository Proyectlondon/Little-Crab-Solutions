# Módulo 06: Despliegue y Escalado — Docker Compose, Railway/Render, Dominio Custom (6h)

## Objetivos de Aprendizaje
Al completar este módulo, serás capaz de:
- ✅ Preparar tu stack local (n8n, Ollama, Postgres) para producción con Docker Compose multi-env
- ✅ Desplegar en Railway / Render / Fly.io con HTTPS automático, variables de entorno seguras
- ✅ Configurar dominio custom + DNS + certificado SSL (Let's Encrypt / Cloudflare)
- ✅ Implementar backups automáticos (Postgres, volúmenes, modelos Ollama) + restore testado
- ✅ Escalar horizontalmente: n8n workers (queue mode), Ollama multi-GPU, load balancer

---

## Contenido Teórico-Práctico

### 1. De Local a Producción: Checklist de Paridad

| Aspecto | Local (Dev) | Producción | Acción Requerida |
|---------|-------------|------------|------------------|
| **Auth n8n** | Basic auth simple | SSO / OAuth2 / LDAP | n8n Enterprise o reverse proxy + Authelia |
| **Base Datos** | Postgres en contenedor | Postgres managed (Railway/Neon/Supabase) | Externalizar BD, connection pooling |
| **Ollama** | GPU local (RTX 4060) | GPU cloud (RunPod, Lambda, own server) | Migrar modelos, API key auth |
| **Secretos** | .env file | Vault / 1Password / Platform secrets | n8n credentials + platform env vars |
| **HTTPS** | HTTP localhost | TLS obligatorio (Let's Encrypt / Cloudflare) | Reverse proxy (Caddy/Traefik/Nginx) |
| **DNS** | localhost | `ia.tuempresa.com` → A/AAAA/CNAME | Registrar dominio, configurar zona |
| **Backups** | Manual tar.gz | Automatizados + test restore semanal | Cron jobs + alertas si falla |
| **Logs** | Docker logs | Centralizados (Loki/Grafana Cloud) | Promtail / Vector sidecar |
| **Monitoreo** | Opcional | Obligatorio (uptime, latency, DLQ) | UptimeRobot + Grafana alerts |

### 2. Docker Compose Multi-Environment

**Estructura**:
```
D:\Little Crab Solutions\n8n\
├── docker-compose.yml          # Base (común)
├── docker-compose.dev.yml      # Dev overrides
├── docker-compose.staging.yml  # Staging overrides
├── docker-compose.prod.yml     # Prod overrides
├── .env.dev                    # Secrets dev (NO commit)
├── .env.staging                # Secrets staging (NO commit)
├── .env.prod                   # Secrets prod (NO commit - vault)
└── scripts/
    ├── deploy.sh
    ├── backup.sh
    └── restore.sh
```

#### 2.1 Base (`docker-compose.yml`)
```yaml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    environment:
      - N8N_HOST=${N8N_HOST:-localhost}
      - N8N_PORT=5678
      - N8N_PROTOCOL=${N8N_PROTOCOL:-http}
      - WEBHOOK_URL=${WEBHOOK_URL}
      - GENERIC_TIMEZONE=America/Bogota
      - TZ=America/Bogota
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=${N8N_BASIC_AUTH_USER}
      - N8N_BASIC_AUTH_PASSWORD=${N8N_BASIC_AUTH_PASSWORD}
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=${POSTGRES_DB:-n8n}
      - DB_POSTGRESDB_USER=${POSTGRES_USER}
      - DB_POSTGRESDB_PASSWORD=${POSTGRES_PASSWORD}
      - N8N_METRICS=true
      - N8N_METRICS_PREFIX=n8n
      - LANGCHAIN_TRACING_V2=${LANGCHAIN_TRACING_V2:-false}
      - LANGCHAIN_API_KEY=${LANGCHAIN_API_KEY}
      - LANGCHAIN_PROJECT=${LANGCHAIN_PROJECT:-little-crab}
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - llc-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:5678/healthz"]
      interval: 30s
      timeout: 10s
      retries: 3

  postgres:
    image: postgres:16-alpine
    container_name: n8n-postgres
    environment:
      - POSTGRES_DB=${POSTGRES_DB:-n8n}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d  # Tablas DLQ, leads
    networks:
      - llc-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5

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
    healthcheck:
      test: ["CMD", "ollama", "list"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  n8n_data:
  postgres_data:
  ollama_data:

networks:
  llc-network:
    driver: bridge
```

#### 2.2 Prod Override (`docker-compose.prod.yml`)
```yaml
version: '3.8'

services:
  n8n:
    # En prod: usar queue mode (main + workers)
    # Ver: https://docs.n8n.io/hosting/scaling/queue-mode/
    environment:
      - N8N_PROTOCOL=https
      - EXECUTIONS_MODE=queue
      - QUEUE_BULL_REDIS_HOST=redis
      - QUEUE_BULL_REDIS_PORT=6379
      - QUEUE_BULL_REDIS_PASSWORD=${REDIS_PASSWORD}
    depends_on:
      - redis

  redis:
    image: redis:7-alpine
    container_name: n8n-redis
    command: redis-server --requirepass ${REDIS_PASSWORD} --maxmemory 256mb --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data
    networks:
      - llc-network
    restart: unless-stopped

  # Reverse proxy con HTTPS automático (Caddy)
  caddy:
    image: caddy:2-alpine
    container_name: caddy
    ports:
      - "80:80"
      - "443:443"
      - "443:443/udp"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    networks:
      - llc-network
    restart: unless-stopped

volumes:
  redis_data:
  caddy_data:
  caddy_config:
```

#### 2.3 Caddyfile (HTTPS Automático + Auth)
```caddyfile
# Caddyfile
{
    admin off
    email admin@littlecrab.solutions
}

ia.littlecrab.solutions {
    # Auth básica (mientras no hay SSO)
    basicauth {
        admin {J$n8n_basic_auth_password_hash}
    }
    
    reverse_proxy n8n:5678 {
        header_up Host {host}
        header_up X-Real-IP {remote}
        header_up X-Forwarded-For {remote}
        header_up X-Forwarded-Proto {scheme}
    }
    
    # Webhooks sin auth (públicos)
    @webhooks path /webhook/*
    route @webhooks {
        basicauth off
        reverse_proxy n8n:5678
    }
}

ollama.littlecrab.solutions {
    # Solo red interna o VPN
    reverse_proxy ollama:11434
}
```

### 3. Despliegue en Railway (Más Simple para Equipos Pequeños)

#### 3.1 railway.toml
```toml
[build]
builder = "nixpacks"

[deploy]
healthcheckPath = "/healthz"
healthcheckTimeout = 100
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 3

[[services]]
name = "n8n"
startCommand = "n8n start"

[[services]]
name = "postgres"
image = "postgres:16-alpine"

[[services]]
name = "redis"
image = "redis:7-alpine"

[[services]]
name = "ollama"
# Railway no tiene GPU barato → usar RunPod para Ollama
# Este servicio solo para referencia
```

#### 3.2 Variables Railway (UI → Variables)
```
N8N_HOST=ia.littlecrab.solutions
N8N_PROTOCOL=https
WEBHOOK_URL=https://ia.littlecrab.solutions/
DB_POSTGRESDB_HOST=postgres.railway.internal
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_DATABASE=n8n
DB_POSTGRESDB_USER=postgres
DB_POSTGRESDB_PASSWORD=${{Postgres.PASSWORD}}
QUEUE_BULL_REDIS_HOST=redis.railway.internal
QUEUE_BULL_REDIS_PORT=6379
QUEUE_BULL_REDIS_PASSWORD=${{Redis.PASSWORD}}
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=${{LANGCHAIN_API_KEY}}
LANGCHAIN_PROJECT=little-crab-prod
```

#### 3.3 Dominio Custom en Railway
1. Settings → Domains → Add Custom Domain → `ia.littlecrab.solutions`
2. DNS: CNAME `ia` → `littlecrab.up.railway.app` (o A record si apex)
3. Railway auto-provisiona certificado Let's Encrypt

### 4. Ollama en Producción: Opciones GPU Cloud

| Proveedor | GPU | Precio/hr | Latencia a Railway | Setup |
|-----------|-----|-----------|-------------------|-------|
| **RunPod** | RTX 4090 / A100 | $0.44-1.89 | ~50ms (US-East) | Docker template + API key |
| **Lambda Labs** | A10G / H100 | $0.75-2.50 | ~60ms | SSH + Docker |
| **Vast.ai** | Varía (spot) | $0.10-0.80 | Variable | Marketplace |
| **Propio** | RTX 4060/3090 | $0 (ya pagado) | LAN < 1ms | Tailscale + Docker |

**Recomendación Little Crab**: **RunPod Secure Cloud** (GPU dedicada, red privada, API estándar).
```bash
# RunPod: Deploy template "Ollama" → expone puerto 11434
# Obtener: ENDPOINT_URL (https://xxx.runpod.io), API_KEY
# En n8n prod: HTTP Request → https://xxx.runpod.io/api/generate
# Headers: Authorization: Bearer $RUNPOD_API_KEY
```

### 5. Backups Automatizados + Restore Testado

#### 5.1 Script Backup (`scripts/backup.sh`)
```bash
#!/bin/bash
set -euo pipefail

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

mkdir -p "$BACKUP_DIR"

echo "[$DATE] Iniciando backup..."

# 1. Postgres (schema + data)
docker exec n8n-postgres pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
  --no-owner --no-privileges --clean --if-exists \
  | gzip > "$BACKUP_DIR/postgres_$DATE.sql.gz"

# 2. Volumen n8n (workflows, credentials, binary data)
docker run --rm -v n8n_data:/data -v "$BACKUP_DIR":/backup alpine \
  tar czf /backup/n8n_data_$DATE.tar.gz -C /data .

# 3. Volumen Ollama (modelos - solo si cambió)
docker run --rm -v ollama_data:/data -v "$BACKUP_DIR":/backup alpine \
  tar czf /backup/ollama_data_$DATE.tar.gz -C /data .

# 4. Subir a storage remoto (S3 / R2 / GCS / Azure Blob)
# rclone copy "$BACKUP_DIR" remote:little-crab-backups --max-age ${RETENTION_DAYS}d

# 5. Limpiar locales antiguos
find "$BACKUP_DIR" -type f -mtime +$RETENTION_DAYS -delete

echo "[$DATE] Backup completado: $BACKUP_DIR"
```

#### 5.2 Script Restore (`scripts/restore.sh`)
```bash
#!/bin/bash
set -euo pipefail

BACKUP_FILE="${1:-}"
if [[ -z "$BACKUP_FILE" ]]; then
  echo "Uso: $0 <backup_timestamp>"
  echo "Ejemplo: $0 20260815_020000"
  exit 1
fi

BACKUP_DIR="/backups"
DATE="$BACKUP_FILE"

echo "[$DATE] Restaurando backup..."

# 1. Parar servicios
docker compose -f docker-compose.prod.yml down

# 2. Restaurar Postgres
gunzip -c "$BACKUP_DIR/postgres_$DATE.sql.gz" | docker exec -i n8n-postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"

# 3. Restaurar volúmenes
docker run --rm -v n8n_data:/data -v "$BACKUP_DIR":/backup alpine \
  sh -c "rm -rf /data/* && tar xzf /backup/n8n_data_$DATE.tar.gz -C /data"

docker run --rm -v ollama_data:/data -v "$BACKUP_DIR":/backup alpine \
  sh -c "rm -rf /data/* && tar xzf /backup/ollama_data_$DATE.tar.gz -C /data"

# 4. Levantar
docker compose -f docker-compose.prod.yml up -d

echo "[$DATE] Restore completado. Verificar salud:"
echo "  curl https://ia.littlecrab.solutions/healthz"
```

#### 5.3 Cron Job (En host o n8n workflow)
```bash
# Crontab (host Linux) - diario 02:00
0 2 * * * /opt/little-crab/scripts/backup.sh >> /var/log/little-crab-backup.log 2>&1

# O en n8n: Schedule Trigger (02:00) → Execute Command (backup.sh) → Notify result
```

#### 5.4 Test Restore Mensual (Obligatorio)
```bash
# Primer lunes de cada mes - staging
./scripts/restore.sh 20260815_020000
# Verificar: workflows cargan, credenciales funcionan, modelo Ollama responde
# Documentar: tiempo restore, issues, firma responsable
```

### 6. Escalado Horizontal (Cuando Crece)

#### 6.1 n8n Queue Mode (Main + Workers)
```yaml
# docker-compose.prod.yml - servicios adicionales
services:
  n8n-main:
    # ... config base ...
    environment:
      - EXECUTIONS_MODE=queue
      - QUEUE_BULL_REDIS_HOST=redis
    deploy:
      replicas: 1
      placement:
        constraints: [node.role == manager]

  n8n-worker:
    image: n8nio/n8n:latest
    environment:
      - EXECUTIONS_MODE=queue
      - QUEUE_BULL_REDIS_HOST=redis
      - NODE_TYPE=worker
    deploy:
      replicas: 3  # Escalar según carga
    depends_on:
      - redis

  redis:
    # ... config con persistencia AOF ...
```

#### 6.2 Ollama Multi-Model / Multi-GPU
```yaml
# ollama-serve con múltiples modelos pre-cargados
ollama:
  image: ollama/ollama:latest
  command: serve
  environment:
    - OLLAMA_NUM_PARALLEL=4
    - OLLAMA_MAX_LOADED_MODELS=3
    - OLLAMA_FLASH_ATTENTION=1
  deploy:
    resources:
      reservations:
        devices:
          - driver: nvidia
            count: 1
            capabilities: [gpu]
```

#### 6.3 Load Balancer (Si múltiples n8n-main)
```caddyfile
# Caddyfile - round robin entre mains
ia.littlecrab.solutions {
    reverse_proxy n8n-main-1:5678 n8n-main-2:5678 n8n-main-3:5678 {
        lb_policy round_robin
        lb_try_duration 10s
        lb_try_interval 500ms
    }
}
```

---

## Ejercicio Guiado: Deploy a Producción (3h)

### Prerrequisitos
- [ ] Cuenta Railway (o Render/Fly.io) + proyecto creado
- [ ] Dominio `littlecrab.solutions` (o subdominio) en Cloudflare/registrador
- [ ] RunPod account + GPU pod Ollama desplegado (o servidor propio con Tailscale)
- [ ] Secrets guardados en 1Password / Bitwarden / Railway Variables

### Paso 1: Preparar Repo para Railway (30 min)
```bash
cd D:\Little Crab Solutions
# 1. Añadir railway.toml (ver arriba)
# 2. Añadir .dockerignore (excluir .git, node_modules, backups, .env*)
# 3. Verificar docker-compose.prod.yml + Caddyfile
# 4. Commit + Push a GitHub (repo privado)
git add n8n/railway.toml n8n/docker-compose.prod.yml n8n/Caddyfile
git commit -m "chore(deploy): config Railway + Caddy HTTPS + queue mode"
git push origin main
```

### Paso 2: Conectar Railway a GitHub (15 min)
1. Railway Dashboard → New Project → Deploy from GitHub Repo
2. Selecciona repo + branch `main`
3. Railway detecta `railway.toml` → crea servicios automáticamente

### Paso 3: Configurar Variables + Dominio (30 min)
1. Cada servicio (n8n, postgres, redis) → Variables → añade todas de sección 3.2
2. Settings → Domains → `ia.littlecrab.solutions` → Verify DNS
3. Cloudflare: CNAME `ia` → `littlecrab.up.railway.app` → Proxy ON (naranja)

### Paso 4: Conectar Ollama RunPod (30 min)
1. RunPod → Deploy template "Ollama" → Secure Cloud → RTX 4090
2. Wait ready → Copy endpoint URL + API Key
3. Railway n8n service → Variables:
   ```
   OLLAMA_HOST=https://xxx.runpod.io
   OLLAMA_API_KEY=rpa_xxxxxxxxxxxx
   ```
4. En n8n workflows: cambiar HTTP Request URL a `{{ $env.OLLAMA_HOST }}/api/generate` + header `Authorization: Bearer {{ $env.OLLAMA_API_KEY }}`

### Paso 5: Backups + Monitoring (30 min)
1. Railway: Add Cron Job → `0 2 * * *` → command: `/backup.sh` (montar volume persistente)
2. UptimeRobot: Monitor `https://ia.littlecrab.solutions/healthz` cada 5 min
3. Grafana Cloud: Free tier → conectar Prometheus (Railway expone metrics) → import dashboards

### Paso 6: Test Restauración (30 min)
```bash
# En Railway: Shell → n8n container
# Simular desastre: borrar un workflow crítico
# Ejecutar restore desde backup más reciente
./scripts/restore.sh 20260815_020000
# Verificar: workflow recuperado, credenciales OK, ejecución exitosa
```

---

## Recursos Verificados (Validados 2026-08-15)

| URL | Título | Descripción | Validación |
|-----|--------|-------------|------------|
| https://docs.n8n.io/hosting/scaling/queue-mode/ | n8n Queue Mode | Main + Workers + Redis, configuración completa | 200 OK |
| https://caddyserver.com/docs/ | Caddy Docs | HTTPS automático, reverse proxy, basicauth | 200 OK |
| https://docs.railway.app/ | Railway Docs | Deploy from GitHub, variables, domains, cron | 200 OK |
| https://docs.runpod.io/ | RunPod Docs | GPU pods, templates, secure cloud, API | 200 OK |
| https://www.postgresql.org/docs/current/backup.html | PostgreSQL Backup | pg_dump, pg_basebackup, point-in-time recovery | 200 OK |
| https://docs.n8n.io/hosting/configuration/environment-variables/ | n8n Env Vars | Referencia completa variables configuración | 200 OK |

---

## Checkpoint de Autoevaluación

1. **Queue Mode**: ¿Cuál es la diferencia arquitectural entre `EXECUTIONS_MODE=regular` (default) y `queue`?
2. **Caddy**: ¿Por qué Caddy es preferible a Nginx + Certbot para equipos pequeños?
3. **RunPod vs Propio**: Tu RTX 4060 local vs RunPod RTX 4090. ¿Cuándo mover a cloud?
4. **Backup Restore**: ¿Por qué `pg_dump --clean --if-exists` es más seguro que `pg_restore` directo?
5. **DNS**: Diferencia entre CNAME `ia` → `railway.app` (proxy OFF) vs proxy ON (Cloudflare naranja).

---

### Respuestas

1. **Regular**: Ejecución en mismo proceso n8n (blocking, memoria compartida, 1 workflow a la vez por proceso). **Queue**: Redis como cola, workers separados consumen jobs → escalado horizontal, resiliencia, prioridades, rate limiting.
2. **Caddy**: HTTPS automático (Let's Encrypt/ZeroSSL), config declarativa simple, HTTP/3, sin renew manual. Nginx + Certbot = cron renew, config verbose, fácil romper.
3. **Mover a cloud cuando**: (a) Modelos > VRAM local (7B+ en 8GB = offload CPU lento), (b) Concurrencia > 2-3 req simultáneas, (c) Necesitas alta disponibilidad (local = SPOF), (d) Equipo remoto necesita acceso.
4. `--clean --if-exists` genera `DROP TABLE IF EXISTS` + `CREATE TABLE` → restore idempotente, no falla si tabla existe o schema cambió. `pg_restore` sin clean falla en objetos existentes.
5. **Proxy OFF (gris)**: DNS resuelve directo a Railway IP → certificado Let's Encrypt de Railway, sin WAF/CDN. **Proxy ON (naranja)**: Tráfico pasa por Cloudflare → WAF, DDoS protection, cache, analytics, certificado Cloudflare (Edge), oculta IP origen.

---

## Siguiente Paso
→ **Módulo 07**: Proyecto Final — Agente de Intake (Formulario → Plan → Notion → Discord + Gloria) (20h). Integra todo: n8n, Ollama, Hyperframes, TTS, observabilidad, deploy.