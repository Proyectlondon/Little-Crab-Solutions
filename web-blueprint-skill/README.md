# 🎨 Web Blueprint Skill

> Convierte a tu IA local en un diseñador web senior capaz de generar sitios inmersivos de calidad agencia.

## ¿Qué incluye?

```
web-blueprint-skill/
├── instructions/
│   └── SKILL.md              ← Documento maestro (la IA lo lee primero)
├── design-system/
│   ├── globals.css           ← Design system completo (CSS variables, animaciones)
│   ├── OceanAmbient.tsx      ← Fondo oceánico animado (canvas)
│   ├── CrabCursor.tsx        ← Cursor personalizado SVG
│   ├── Navigation.tsx        ← Nav sticky con logo animado
│   ├── Hero.tsx              ← Hero section con parallax
│   ├── Manifesto.tsx         ← Texto con scroll-reveal palabra por palabra
│   ├── Services.tsx          ← Grid de servicios con hover radial
│   ├── SwarmArchitecture.tsx ← Diagrama animado de nodos
│   ├── Process.tsx           ← Timeline con línea iluminada por scroll
│   ├── JJStack.tsx           ← Sección "Sobre Nosotros" con valores
│   ├── Contact.tsx           ← Formulario con chips de áreas
│   ├── Footer.tsx            ← Footer con wordmark gigante
│   ├── AudioToggle.tsx       ← Botón de audio ambiental
│   ├── RevealText.tsx        ← Animación de entrada (fade+slide+blur)
│   ├── TriangleAccent.tsx    ← Decoraciones geométricas flotantes
│   ├── ParticleBackground.tsx ← Partículas conectadas para hero
│   ├── layout.tsx            ← Layout raíz con fuentes
│   └── page.tsx              ← Ensamblaje de todas las secciones
├── templates/
│   ├── professional.md       ← Abogados, contadores, consultores
│   ├── agency.md             ← Agencias de marketing/diseño
│   ├── ecommerce.md          ← Tiendas online
│   └── saas.md               ← Software B2B
└── examples/
    └── little-crab/          ← Sitio de Little Crab Solutions como referencia
        ├── logo.png
        └── audio/
            └── fondo.mp3
```

## Cómo usarlo con tu IA local

### Opción 1: Prompt directo (más simple)

Copia este prompt y pégalo en tu IA (Ollama, LM Studio, OpenWebUI):

```
Eres un diseñador web senior. Lee el archivo web-blueprint-skill/instructions/SKILL.md 
para entender el design system.

Crea un sitio web para:
- Cliente: [NOMBRE]
- Nicho: [INDUSTRIA]  
- Servicios: [LISTA]
- Colores: [HEX]
- Logo: [PATH]

Usa los componentes de web-blueprint-skill/design-system/ como base.
Adapta copy, colores e iconos al cliente.
Mantén TODOS los efectos inmersivos.
Genera el código completo archivo por archivo.
```

### Opción 2: Con MCP (avanzado)

Si tu IA tiene acceso a filesystem vía MCP:

```
Lee /web-blueprint-skill/instructions/SKILL.md
Lee 3 componentes de /web-blueprint-skill/design-system/ que sean relevantes
Lee la plantilla de /web-blueprint-skill/templates/[niche].md
Genera el sitio en /output/[client-name]/
```

### Opción 3: Script automatizado

Crea un script que automatice el flujo:

```python
# generate_site.py
import subprocess

client = input("Nombre del cliente: ")
niche = input("Niche (agency/ecommerce/saas/professional): ")
colors = input("Colores (hex separados por coma): ")

prompt = f"""
Lee web-blueprint-skill/instructions/SKILL.md
Lee web-blueprint-skill/templates/{niche}.md
Crea un sitio para {client}, niche {niche}, colores {colors}
"""

# Llamar a Ollama
result = subprocess.run(
    ["ollama", "run", "qwen3.5", prompt],
    capture_output=True, text=True
)
print(result.stdout)
```

## Modelos recomendados

| Modelo | Tamaño | Calidad | Velocidad |
|--------|--------|---------|-----------|
| Qwen3.5 14B | 8GB | ⭐⭐⭐⭐⭐ | Media |
| Qwen3.5 7B | 4GB | ⭐⭐⭐⭐ | Rápida |
| Hermes3 8B | 5GB | ⭐⭐⭐⭐ | Rápida |
| Gemma4 9B | 6GB | ⭐⭐⭐ | Rápida |
| Nemotron 3 Ultra (API) | - | ⭐⭐⭐⭐⭐ | Variable |

> **Recomendación**: Qwen3.5 14B para mejor calidad, 7B si tu RTX 4060 tiene poca VRAM libre.

## Personalización del cursor

El CrabCursor está diseñado para Little Crab. Para otros clientes, adapta:

1. **Forma**: Cambia el SVG por algo representativo del cliente
   - Perro para veterinaria
   - Casa para inmobiliaria  
   - Taza para café
   - O simplemente un dot elegante

2. **Colores**: Usa `--color-brand` del cliente

3. **Animaciones**: Mantén walk/click/idle

## Personalización del fondo

OceanAmbient puede adaptarse a otros temas:

- **Océano** (default): azul + burbujas + caustics
- **Espacio**: negro + estrellas + nebulosas
- **Bosque**: verde + partículas de polen + luz filtrada
- **Ciudad**: gris + lluvia + neones
- **Fuego**: negro + chispas + brasas

Cambia los colores y tipos de partículas, mantén la estructura del canvas.

## Licencia

Este skill es propiedad de Little Crab Solutions.
Úsalo para tus clientes, no lo vendas como producto separado.

---

*Hecho con 🦀 en Tocancipá, Cundinamarca · Con fe y propósito*
