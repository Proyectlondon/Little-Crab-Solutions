# 🚀 Master Prompt — Generador de Sitios Web

> Copia y pega este prompt en tu IA local (Ollama/LM Studio/OpenWebUI) para generar un sitio web completo.

---

## PROMPT COMPLETO (copia desde aquí)

```
Eres un diseñador web senior y desarrollador frontend experto. Tu tarea es crear un sitio web completo de última generación para un cliente.

## INSTRUCCIONES

1. PRIMERO, lee estos archivos del web-blueprint-skill:
   - instructions/SKILL.md (design system y reglas)
   - templates/[NICHO].md (plantilla de la industria)
   - design-system/globals.css (variables de color)
   - design-system/OceanAmbient.tsx (fondo animado)
   - design-system/Hero.tsx (estructura del hero)
   - design-system/RevealText.tsx (animación de entrada)

2. DATOS DEL CLIENTE:
   - Nombre: [NOMBRE DEL CLIENTE]
   - Nicho: [AGENCY / ECOMMERCE / SAAS / PROFESSIONAL / RESTAURANT / REAL ESTATE]
   - Servicios: [LISTA DE SERVICIOS]
   - Colores de marca: [COLOR1, COLOR2, COLOR3 en hex]
   - Logo: [PATH/URL del logo]
   - Copy/Datos: [INFORMACIÓN DE LA EMPRESA]
   - Idioma: [Español/Inglés]
   - CTAs preferidos: [LISTA]

3. REGLAS DE DISEÑO (NO NEGOCIABLES):
   - Fondo oscuro profundo (#07090C o similar)
   - Texto claro (#F5EFE6) con contraste AA
   - Cursor personalizado SVG (adaptar al nicho)
   - Fondo animado inmersivo (OceanAmbient adaptado)
   - Animaciones de entrada con RevealText en TODAS las secciones
   - Línea iluminada en sección de Proceso
   - Triángulos/decoraciones flotantes en al menos 2 secciones
   - Audio toggle (si hay audio ambiental)
   - Responsive mobile-first
   - Accesibilidad WCAG 2.1 AA

4. ESTRUCTURA OBLIGATORIA:
   - Navigation (sticky, logo animado al hover)
   - Hero (pantalla completa, headline impactante, 2 CTAs, stats)
   - Manifiesto/Filosofía (texto grande con scroll-reveal)
   - Servicios (grid de 4-5 servicios con hover radial)
   - Sección específica del nicho (ver template)
   - Proceso (timeline con línea iluminada)
   - Sobre Nosotros (historia + valores)
   - Contacto (formulario + datos reales)
   - Footer (links, copyright, branding)

5. STACK TÉCNICO:
   - Next.js 16+ (App Router)
   - TypeScript 5+
   - Tailwind CSS 4+
   - Framer Motion 12+
   - Lucide React (iconos)

6. ENTREGABLES:
   Genera estos archivos completos:
   - src/app/layout.tsx (metadata, fuentes)
   - src/app/page.tsx (ensamblaje)
   - src/app/globals.css (design system con colores del cliente)
   - src/components/site/Navigation.tsx
   - src/components/site/Hero.tsx
   - src/components/site/Manifesto.tsx
   - src/components/site/Services.tsx
   - src/components/site/[NicheSection].tsx
   - src/components/site/Process.tsx
   - src/components/site/About.tsx
   - src/components/site/Contact.tsx
   - src/components/site/Footer.tsx
   - src/components/site/OceanAmbient.tsx (adaptado al tema)
   - src/components/site/Cursor.tsx (adaptado al nicho)
   - src/components/site/RevealText.tsx (reutilizar)
   - src/components/site/TriangleAccent.tsx (reutilizar)

7. COPY:
   - Soluciones sobre herramientas
   - Beneficios sobre features
   - Segunda persona ("tu negocio")
   - Directo, sin buzzwords
   - CTAs claros en cada sección

8. VERIFICACIÓN FINAL:
   - ¿El cursor se ve bien y apunta con la parte correcta?
   - ¿El fondo animado no tapa el contenido?
   - ¿Las animaciones de entrada funcionan en todas las secciones?
   - ¿La línea de proceso se ilumina con el scroll?
   - ¿Es responsive en móvil?
   - ¿El contraste es AA?
   - ¿Los CTAs son claros y específicos?

Empieza leyendo el SKILL.md y luego genera el código completo, archivo por archivo.
```

## FIN DEL PROMPT (copia hasta aquí)

---

## 💡 Cómo usar este prompt

### Opción A: Interactivo (conversación con tu IA)
1. Abre Ollama / LM Studio / OpenWebUI
2. Carga tu modelo (Qwen3.5 14B recomendado)
3. Pega el prompt completo
4. Reemplaza los campos `[ENTRE CORCHETES]` con los datos del cliente
5. Envía y espera a que tu IA genere el código
6. Copia cada archivo a tu proyecto

### Opción B: Script automatizado
```python
# generate_site.py
import os
import subprocess

# Datos del cliente
CLIENT = {
    "name": "Restaurante La Casona",
    "niche": "restaurant", 
    "services": ["Comida colombiana", "Eventos", "Catering", "Reservas"],
    "colors": "#8B2D1F, #D4A574, #1A1A1A",
    "logo": "/path/to/logo.png",
    "copy": "Restaurante tradicional desde 1985...",
    "language": "Español",
    "ctas": ["Reservar mesa", "Ver menú", "Solicitar catering"]
}

# Leer prompt template
with open("master-prompt.md") as f:
    prompt = f.read()

# Reemplazar variables
for key, value in CLIENT.items():
    prompt = prompt.replace(f"[{key.upper()}]", value)

# Llamar a Ollama
result = subprocess.run(
    ["ollama", "run", "qwen3.5:14b", prompt],
    capture_output=True,
    text=True,
    timeout=600
)

# Guardar output
os.makedirs(f"output/{CLIENT['name']}", exist_ok=True)
with open(f"output/{CLIENT['name']}/site.txt", "w") as f:
    f.write(result.stdout)

print(f"✅ Sitio generado en output/{CLIENT['name']}/")
```

### Opción C: Con Hermes Agent (MCP)
Si tienes Hermes Agent configurado con MCP:

```
Hermes, usa el filesystem MCP para:
1. Leer /web-blueprint-skill/instructions/SKILL.md
2. Leer /web-blueprint-skill/templates/restaurant.md
3. Generar un sitio para "Restaurante La Casona" con los colores #8B2D1F, #D4A574
4. Escribir los archivos en /output/la-casona/
```

---

## 🎯 Tips para mejores resultados

### Modelo
- **Qwen3.5 14B** da el mejor balance calidad/velocidad
- Si tienes 8GB VRAM, usa Qwen3.5 7B (más rápido, casi igual de bueno)
- Para copy muy específico, Nemotron vía API da mejores resultados

### Contexto
- Tu IA necesita ver el SKILL.md completo para entender el design system
- Si la IA no respeta los efectos, recuerdale: "Mantén TODOS los efectos inmersivos: OceanAmbient, cursor, RevealText, línea iluminada"

### Iteración
- Pide el sitio en partes si tu IA se queda sin contexto:
  1. "Genera globals.css y layout.tsx"
  2. "Genera Hero.tsx y Navigation.tsx"
  3. "Genera Services.tsx y Process.tsx"
  4. etc.
- Revisa cada archivo antes de continuar

### Adaptación
- Si el cliente tiene un logo complejo, pide a tu IA que extraiga los colores primero
- Si el nicho no tiene template, usa la plantilla "agency" como base
- Siempre prueba en móvil antes de entregar
