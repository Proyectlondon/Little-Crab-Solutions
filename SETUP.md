# 🦀 Little Crab Solutions — Guía de Instalación Local

Guía paso a paso para levantar este proyecto en tu Windows 10 con RTX 4060, subirlo a GitHub y publicarlo.

---

## 📋 Requisitos Previos

Antes de empezar, necesitas instalar estas herramientas en tu Windows 10:

### 1. Node.js (LTS)
- Ve a https://nodejs.org
- Descarga la versión **LTS** (actualmente 22.x)
- Ejecuta el instalador (Next → Next → Next)
- Verifica abriendo PowerShell:
  ```powershell
  node --version
  npm --version
  ```

### 2. Bun (recomendado, más rápido que npm)
- Abre PowerShell como Administrador
- Ejecuta:
  ```powershell
  powershell -c "irm bun.sh/install.ps1 | iex"
  ```
- Cierra y reabre PowerShell
- Verifica:
  ```powershell
  bun --version
  ```

### 3. Git
- Ve a https://git-scm.com/download/win
- Descarga e instala (Next → Next → Next)
- Verifica:
  ```powershell
  git --version
  ```

### 4. VS Code (editor recomendado)
- Ve a https://code.visualstudio.com
- Descarga e instala
- Instala estas extensiones:
  - **ES7+ React/Redux/React-Native snippets**
  - **Tailwind CSS IntelliSense**
  - **TypeScript Vue Plugin (Volar)** (opcional, pero útil)

---

## 🚀 Instalación del Proyecto

### Paso 1: Copiar el proyecto
Copia la carpeta del proyecto a tu máquina, por ejemplo a:
```
C:\Users\TuUsuario\Proyectos\little-crab-solutions
```

### Paso 2: Abrir terminal en la carpeta
Abre PowerShell en esa carpeta (Shift + Click derecho → "Abrir ventana de PowerShell aquí") o abre VS Code y usa el terminal integrado (Ctrl + ñ).

### Paso 3: Instalar dependencias
```powershell
bun install
```
> Si no tienes Bun, usa `npm install` (tarda más pero funciona igual)

### Paso 4: Ejecutar en modo desarrollo
```powershell
bun run dev
```
> Con npm: `npm run dev`

Verás algo como:
```
▲ Next.js 16.1.3 (Turbopack)
- Local:        http://localhost:3000
✓ Ready in 1005ms
```

### Paso 5: Abrir en el navegador
Ve a **http://localhost:3000** en tu navegador.

¡Listo! El sitio está corriendo en tu máquina. Cualquier cambio que hagas en el código se refleja automáticamente (hot reload).

---

## 📁 Estructura del Proyecto

```
little-crab-solutions/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Layout raíz (fuentes, metadata)
│   │   ├── page.tsx            # Página principal (ensambla todo)
│   │   └── globals.css         # Estilos globales (design system)
│   └── components/
│       └── site/               # Componentes del sitio
│           ├── CrabCursor.tsx       # Cursor-cangrejo SVG
│           ├── OceanAmbient.tsx     # Fondo oceánico animado
│           ├── Navigation.tsx       # Nav sticky
│           ├── Hero.tsx             # Hero section
│           ├── Manifesto.tsx        # Filosofía
│           ├── Services.tsx         # 5 servicios
│           ├── SwarmArchitecture.tsx # Diagrama swarm
│           ├── Process.tsx          # Timeline con línea iluminada
│           ├── JJStack.tsx          # Sobre Nosotros
│           ├── Contact.tsx          # Formulario
│           ├── Footer.tsx           # Footer
│           ├── AudioToggle.tsx      # Botón de audio
│           ├── RevealText.tsx       # Animación de entrada
│           ├── TriangleAccent.tsx   # Triángulos decorativos
│           └── ParticleBackground.tsx # Partículas del hero
├── public/
│   ├── logo.png                # Logo de Little Crab
│   ├── audio/
│   │   └── fondo.mp3           # Audio ambiental
│   └── crab/                   # Sprites del cursor (no usados en v1 SVG)
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🛠️ Comandos Útiles

| Comando | Acción |
|---------|--------|
| `bun run dev` | Servidor de desarrollo (http://localhost:3000) |
| `bun run build` | Compila para producción |
| `bun run start` | Sirve la versión de producción |
| `bun run lint` | Revisa errores de código |

---

## 📤 Subir a GitHub

### Paso 1: Crear cuenta en GitHub
Si no tienes cuenta, regístrate en https://github.com

### Paso 2: Crear un repositorio nuevo
1. Ve a https://github.com/new
2. Nombre: `little-crab-solutions` (o el que prefieras)
3. Descripción: `Sitio web de Little Crab Solutions`
4. **Privado** (recomendado mientras terminas) o Público
5. **NO** inicialices con README (ya tienes el código)
6. Click "Create repository"

### Paso 3: Configurar Git en tu máquina (solo la primera vez)
```powershell
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

### Paso 4: Inicializar Git en el proyecto
En la carpeta del proyecto:
```powershell
git init
git add .
git commit -m "Primer commit: sitio Little Crab Solutions"
```

### Paso 5: Conectar con GitHub
Copia la URL de tu repositorio (GitHub te la muestra al creararlo):
```powershell
git branch -M main
git remote add origin https://github.com/TU_USUARIO/little-crab-solutions.git
git push -u origin main
```

Si te pide credenciales, usa un **Personal Access Token**:
1. Ve a https://github.com/settings/tokens
2. Generate new token (classic)
3. Marca "repo"
4. Copia el token y pégalo cuando Git te pida la contraseña

---

## 🌐 Publicar en Vercel (gratis)

Vercel es la empresa detrás de Next.js, y su plataforma es la mejor para desplegar sitios Next.js. El tier gratis es más que suficiente.

### Paso 1: Crear cuenta
1. Ve a https://vercel.com
2. "Sign Up" → "Continue with GitHub" (usa tu cuenta de GitHub)

### Paso 2: Importar el repositorio
1. Click "Add New..." → "Project"
2. Importa tu repositorio `little-crab-solutions`
3. Vercel detecta automáticamente que es Next.js

### Paso 3: Configurar (opcional)
- Framework Preset: **Next.js** (automático)
- Build Command: `next build` (automático)
- Output Directory: `.next` (automático)
- Click "Deploy"

### Paso 4: ¡Listo!
Vercel compila y despliega en ~2 minutos. Te da una URL como:
```
https://little-crab-solutions.vercel.app
```

### Paso 5: Dominio personalizado (opcional)
1. En Vercel → Settings → Domains
2. Agrega `littlecrabsolutions.com` (o el que compres)
3. Sigue las instrucciones de DNS

---

## 🔄 Actualizar el sitio

Cada vez que hagas cambios y los subas a GitHub:
```powershell
git add .
git commit -m "Descripción del cambio"
git push
```

Vercel **re-despliega automáticamente** cada vez que haces push a `main`. Tu sitio se actualiza solo en producción.

---

## 🆘 Problemas Comunes

### "bun: command not found"
- Cierra y reabre PowerShell
- Si persista, reinicia el PC

### "Error: Cannot find module"
```powershell
rm -rf node_modules
bun install
```

### "Port 3000 already in use"
```powershell
# Cambiar el puerto
bun run dev -- -p 3001
```

### "Git push pide contraseña y no la acepta"
- Necesitas un Personal Access Token (ver paso 5 arriba)
- O usa GitHub CLI: https://cli.github.com

### El cursor-cangrejo no aparece
- Es normal en algunos navegadores headless. En tu navegador real con mouse sí aparece.
- Verifica que tu navegador no esté en modo táctil

### El audio no reproduce
- Los navegadores bloquean el autoplay. El usuario debe hacer click en el botón de audio (abajo-derecha) la primera vez.

---

## 📞 Soporte

Si tienes problemas:
- WhatsApp: +57 310 432 8783
- Email: hola@littlecrabsolutions.com

---

¡Felicitaciones! 🎉 Tu sitio de Little Crab Solutions está listo para el mundo.
