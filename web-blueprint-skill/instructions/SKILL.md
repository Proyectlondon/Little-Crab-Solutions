# 🎨 Web Blueprint Skill — Generador de Sitios de Última Generación

> **Skill para IA local** — Permite a tu IA (Qwen3.5, Hermes3, Gemma4 vía Ollama/LM Studio) generar sitios web inmersivos de calidad agencia, adaptados a cualquier nicho o cliente.

## ¿Qué es este Skill?

Este skill convierte a tu IA en un **diseñador web senior** capaz de crear sitios como el de Little Crab Solutions: inmersivos, animados, con efectos oceánicos, cursor personalizado, animaciones de scroll, y performance optimizado.

La IA lee este documento + los componentes de referencia, y genera un sitio completo adaptado al cliente.

---

## 🧠 Cómo usar este Skill

### Prompt maestro para tu IA

Cuando un cliente pida un sitio web, dale a tu IA este prompt:

```
Lee el archivo /web-blueprint-skill/instructions/SKILL.md completo.
Luego lee los componentes en /web-blueprint-skill/design-system/.

Crea un sitio web para:
- Cliente: [NOMBRE DEL CLIENTE]
- Nicho/Industria: [INDUSTRIA]
- Servicios: [LISTA DE SERVICIOS]
- Colores de marca: [COLORES HEX]
- Logo: [PATH AL LOGO]
- Copy/Datos: [INFO DE LA EMPRESA]

Reglas:
1. Usa el design system como base (no reinventes componentes)
2. Adapta colores, copy e iconos al nicho del cliente
3. Mantén TODOS los efectos: OceanAmbient, cursor personalizado, animaciones
4. El sitio debe ser responsive y accesible (WCAG 2.1 AA)
5. Performance: Core Web Vitals en verde
6. Genera el código completo, archivo por archivo
```

### Dónde colocar los archivos

```
tu-proyecto-ia/
├── web-blueprint-skill/
│   ├── instructions/
│   │   └── SKILL.md              ← ESTE ARCHIVO (la IA lo lee primero)
│   ├── design-system/
│   │   ├── globals.css           ← Design system completo (CSS variables)
│   │   ├── OceanAmbient.tsx      ← Fondo animado (canvas)
│   │   ├── CrabCursor.tsx        ← Cursor personalizado (adaptar a marca)
│   │   ├── Navigation.tsx        ← Nav sticky
│   │   ├── Hero.tsx              ← Hero section
│   │   ├── RevealText.tsx        ← Animación de entrada
│   │   ├── TriangleAccent.tsx    ← Decoraciones geométricas
│   │   ├── AudioToggle.tsx       ← Botón de audio
│   │   └── ... más componentes
│   ├── templates/
│   │   ├── agency.md             ← Plantilla para agencias
│   │   ├── ecommerce.md          ← Plantilla para e-commerce
│   │   ├── saas.md               ← Plantilla para SaaS
│   │   ├── restaurant.md         ← Plantilla para restaurantes
│   │   ├── realestate.md         ← Plantilla para inmobiliarias
│   │   └── professional.md       ← Servicios profesionales (abogados, contadores)
│   └── examples/
│       └── little-crab/          ← El sitio de Little Crab como referencia
```

---

## 🎯 Filosofía de Diseño

### 1. Inmersión sobre información
El sitio debe hacer sentir al usuario algo, no solo mostrarle datos. El fondo oceánico, el cursor personalizado, las animaciones de scroll — todo contribuye a una experiencia memorable.

### 2. Dark-first con acentos de marca
- Fondo oscuro profundo (#07090C o similar)
- Texto claro (#F5EFE6) para contraste
- Color de acento de marca (extraer del logo del cliente)
- Color secundario (complementario)

### 3. Performance no negociable
- Canvas con `requestAnimationFrame` y limpieza de memoria
- `prefers-reduced-motion` respetado
- Lazy loading de componentes pesados
- Imágenes optimizadas (WebP, AVIF)
- Sin librerías innecesarias

### 4. Accesibilidad
- Contraste AA mínimo (4.5:1 para texto normal)
- Focus visible en todos los interactivos
- `aria-label` en elementos decorativos
- Semántica HTML correcta (`<main>`, `<section>`, `<nav>`, `<footer>`)
- Skip-to-content link

### 5. Mobile-first
- Diseña para móvil primero, luego escala a desktop
- Touch targets mínimo 44px
- Cursor personalizado solo en desktop (`hover: hover`)
- Menú hamburguesa con animación

---

## 🏗️ Arquitectura de un Sitio

Todo sitio generado con este skill sigue esta estructura:

```
<main>
  ├── Cursor personalizado (CrabCursor o similar)
  ├── AudioToggle (botón de sonido ambiental)
  ├── Fondo animado global (OceanAmbient)
  ├── Noise overlay (textura sutil)
  ├── Navigation (sticky)
  ├── Hero (pantalla completa, headline impactante)
  ├── Marquee (opcional, banda de tecnologías/keywords)
  ├── Manifesto/Filosofía (texto grande con scroll-reveal)
  ├── Services/Soluciones (grid de servicios)
  ├── Sección específica del nicho (ver templates/)
  ├── Process/Timeline (cómo trabajan, con línea iluminada)
  ├── Sobre Nosotros (historia, valores)
  ├── Contact (formulario + datos)
  └── Footer (links, copyright, branding)
```

---

## 🎨 Sistema de Colores (Adaptar por Cliente)

Extraer del logo del cliente 3-5 colores dominantes. Estructura:

```css
:root {
  /* Colores de marca (extraer del logo) */
  --color-brand: #E54B1B;        /* Color principal de acento */
  --color-brand-deep: #B8351A;   /* Variante oscura */
  --color-secondary: #2E6E9E;    /* Color secundario */
  --color-accent: #E8B974;       /* Acento dorado/claro */

  /* Fondos (mantener oscuro) */
  --color-abyss: #07090C;        /* Fondo más oscuro */
  --color-deep: #0C1116;         /* Fondo de secciones */
  --color-surface: #12181F;      /* Fondo de cards */

  /* Texto */
  --color-cream: #F5EFE6;        /* Texto principal */
  --color-mist: #A8B4BE;         /* Texto secundario */
}
```

### Extracción de colores del logo
La IA debe:
1. Analizar el logo del cliente
2. Identificar los 3-5 colores dominantes
3. Asignarlos a las variables de marca
4. Mantener los fondos oscuros y el texto claro (no negociable)

---

## ✨ Efectos Inmersivos (No Opcionales)

### 1. Fondo Animado (OceanAmbient)
Canvas fijo que cubre todo el viewport con:
- **Caustics**: pools de luz radial que se mueven (colores de marca)
- **God rays**: rayos de luz verticales que descienden
- **Bubbles**: burbujas que ascienden con atracción al mouse
- **Mouse spotlight**: glow que sigue al cursor
- **Ripples**: ondas concéntricas al hacer click

### 2. Cursor Personalizado
SVG dibujado a mano que representa la marca del cliente:
- Sigue el mouse con suave lag
- Animación de "caminar" al moverse
- Animación de "click" al presionar
- Volteo direccional según movimiento horizontal
- Estela de burbujas/partículas

### 3. RevealText (animación de entrada)
Cada texto importante entra al viewport con:
- `opacity: 0 → 1`
- `y: 30px → 0` (slide up)
- `filter: blur(8px) → blur(0)` (desenfoque que se enfoca)
- Delay escalonado para efecto cascada

### 4. Línea Iluminada (Process/Timeline)
Línea vertical que se "enciende" progresivamente con el scroll:
- Capa base tenue (siempre visible)
- Capa iluminada que crece con `scaleY` controlado por `useScroll`

### 5. Triángulos/Decoraciones
Acentos geométricos que flotan sutilmente:
- Aparecen con animación al entrar al viewport
- Float animation (bob up/down + rotación leve)

---

## 📝 Reglas de Copy

### Tono
- **Soluciones sobre herramientas**: "Más leads" no "n8n workflows"
- **Beneficios sobre features**: "Atención 24/7" no "chatbot con Whisper STT"
- **Segunda persona**: "Tu negocio", no "nuestros clientes"
- **Directo, sin buzzwords**: Sin "revolucionario", "disruptivo", "synergy"

### Estructura de secciones
1. **Hero**: Headline impactante (3-4 palabras por línea) + subtítulo de 2 líneas + 2 CTAs + stats
2. **Services**: Título de beneficio → descripción de 2 líneas → 4 bullets concretos
3. **Process**: 4 fases con entregables claros, no técnicos
4. **About**: Historia humana + valores + (opcional) fe/purpose sutil
5. **Contact**: Pitch + datos reales (WhatsApp, email, Calendly) + formulario

### Idioma
- Español neutro con toque colombiano/latam
- Sin anglicismos innecesarios
- Términos técnicos solo en stack pills o footnotes

---

## 🔧 Stack Técnico (No Negociable)

| Herramienta | Versión | Uso |
|-------------|---------|-----|
| Next.js | 16+ | Framework React con App Router |
| TypeScript | 5+ | Tipado estático |
| Tailwind CSS | 4+ | Styling utility-first |
| Framer Motion | 12+ | Animaciones |
| Lucide React | Última | Iconos |
| Sonner | Última | Toast notifications |

**No usar**:
- jQuery
- Bootstrap
- Material-UI (pesado, opinionado)
- Styled Components ( Tailwind es suficiente)
- Any heavy 3D library (Three.js) — el canvas 2D es suficiente

---

## ✅ Checklist de Calidad

Antes de entregar un sitio, verificar:

### Diseño
- [ ] Fondo oscuro con animación inmersiva
- [ ] Cursor personalizado (desktop) / oculto en táctil
- [ ] Al menos 4 secciones con RevealText
- [ ] Línea iluminada en Process/Timeline
- [ ] Triángulos/decoraciones en al menos 2 secciones
- [ ] Logo animado en nav (hover effect)

### Performance
- [ ] Lighthouse Performance > 90
- [ ] Lighthouse Accessibility > 90
- [ ] Core Web Vitals (LCP < 2.5s, CLS < 0.1)
- [ ] Imágenes optimizadas (WebP)
- [ ] Sin warnings en consola

### Accesibilidad
- [ ] Contraste AA (4.5:1 mínimo)
- [ ] Focus visible en todos los interactivos
- [ ] `aria-label` en elementos decorativos
- [ ] Semántica HTML correcta
- [ ] Navegación con teclado funcional

### Responsive
- [ ] Mobile-first (375px)
- [ ] Tablet (768px)
- [ ] Desktop (1440px)
- [ ] Menú hamburguesa en mobile
- [ ] Touch targets ≥ 44px

### SEO
- [ ] Meta tags (title, description, keywords)
- [ ] OpenGraph tags
- [ ] Schema.org (Organization, Service)
- [ ] Sitemap.xml
- [ ] Robots.txt

### Funcionalidad
- [ ] Formulario de contacto funciona
- [ ] Links de nav anclan correctamente
- [ ] Audio toggle (si aplica)
- [ ] Sin errores de hidratación (SSR/CSR)
- [ ] Lint pasa sin errores

---

## 🎭 Personalización por Nicho

Ver `templates/` para plantillas específicas:
- **agency.md** — Agencias de marketing/diseño
- **ecommerce.md** — Tiendas online
- **saas.md** — Software B2B
- **restaurant.md** — Restaurantes/cafés
- **realestate.md** — Inmobiliarias
- **professional.md** — Abogados, contadores, consultores

Cada plantilla define:
- Secciones específicas del nicho
- Copy sugerido
- Iconos recomendados
- Estructura de servicios
- Llamadas a acción apropiadas

---

## 🚀 Flujo de Trabajo para tu IA

1. **Recibir brief del cliente** (nombre, nicho, servicios, colores, logo)
2. **Leer SKILL.md** completo (este archivo)
3. **Leer template correspondiente** al nicho del cliente
4. **Leer 2-3 componentes de referencia** del design-system
5. **Generar el sitio** archivo por archivo:
   - `globals.css` con colores del cliente
   - `layout.tsx` con metadata
   - `page.tsx` ensamblando secciones
   - Componentes adaptados (copy, iconos, servicios)
6. **Verificar contra checklist** de calidad
7. **Entregar** código + instrucciones de deploy

---

## 💡 Tips para tu IA

- **No reinventes componentes**: usa el design-system como base, solo adapta copy/colores/iconos
- **Mantén los efectos**: OceanAmbient, cursor, RevealText — son lo que hace el sitio especial
- **Sé específico en el copy**: "Más leads en 30 días" es mejor que "Soluciones de marketing"
- **Incluye CTAs claros**: cada sección debe tener un siguiente paso obvio
- **Responsive SIEMPRE**: prueba en móvil, no solo desktop
- **Pide feedback**: si el cliente da info nueva, itera

---

## 📚 Recursos

- **Ejemplo completo**: `examples/little-crab/` — el sitio de Little Crab Solutions
- **Componentes**: `design-system/` — todos los componentes TypeScript
- **Plantillas**: `templates/` — estructuras por industria
- **Setup**: `SETUP.md` — cómo instalar y desplegar

---

*Este skill está diseñado para ser usado con IA local (Ollama, LM Studio) — sin dependencias de la nube, como debe ser. 🦀*
