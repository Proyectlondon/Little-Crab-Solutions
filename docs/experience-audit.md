# Little Crab Solutions — Auditoría de experiencia v1

Fecha: 1 de septiembre de 2026  
Estado: dirección previa a implementación  
Fuente revisada: sitio publicado, código del despliegue y referencias visuales compartidas

## Idea central recomendada

**Little Crab se sumerge en el mundo de cada cliente y emerge con tecnología que expresa su esencia.**

La experiencia debe demostrar que diseño, software e IA forman un producto coherente. El océano representa descubrimiento, profundidad y transformación; el cangrejo acompaña el recorrido y ayuda a revelar el trabajo.

## Audiencia, sensación y acción

- Audiencia principal: responsables de PYMEs y equipos que necesitan un producto digital, automatización o IA adaptada a su operación.
- Sensación buscada: “este equipo entiende el detalle, tiene criterio propio y va a cuidar mi proyecto”.
- Acción principal: contar una idea o problema para iniciar un diagnóstico.
- Diferenciador: unión real entre dirección visual, construcción técnica, IA aplicada y propiedad clara de lo entregado.

## Hechos observados

### Fortalezas

- Existe un mundo visual reconocible: fondo abisal, coral naranja, luz submarina, partículas, ondas y cangrejo.
- La portada posee buena escala tipográfica y un llamado a la acción visible.
- El audio es opcional y dispone de control.
- La página mantiene coherencia cromática y una identidad más cuidada que una landing corporativa común.
- Las secciones de filosofía, servicios, proceso y equipo ya ofrecen una base narrativa aprovechable.

### Problemas críticos

1. **Desplazamiento móvil involuntario.** En una prueba fija de 390 × 844 px, la página se movió sola aproximadamente 47 px durante doce segundos. En 320 × 700 px, el desplazamiento observado fue de aproximadamente 62 px.
2. **Causa correlacionada.** La sección Swarm desmonta la descripción activa y anima su altura desde cero cada 2,2 segundos. Esto modifica la altura del documento y activa correcciones de anclaje del navegador.
3. **Promesa demasiado estrecha.** La comunicación presenta a Little Crab casi exclusivamente como proveedor de IA local sin nube, aunque la propuesta deseada abarca dirección visual, productos digitales, automatización e IA adaptada.
4. **Afirmaciones absolutas.** “$0 en APIs”, “sin nube”, “24/7”, “nada en terceros”, “Core Web Vitals verdes”, “los modelos son tuyos para siempre” y la garantía del 50 % necesitan condiciones o evidencia antes de publicarse como promesas generales.
5. **Falta de prueba visual.** La web afirma que crea productos y contenido de alta calidad, pero no muestra trabajos a escala suficiente para demostrarlo.

### Problemas de experiencia

- El océano se mantiene casi igual durante toda la página. Cambia el contenido, pero no cambia la escena ni la profundidad.
- Se repite la composición “título grande a la izquierda, texto a la derecha y cuadrícula debajo”. La previsibilidad reduce el efecto de descubrimiento.
- Servicios y valores dependen mucho de tarjetas, etiquetas y bordes. El resultado se acerca a una landing SaaS pese a la ambientación.
- La terminología “Swarm”, “Orchestrator”, “Analyst” y “Coder” describe el sistema interno más que el beneficio para un cliente.
- Space Grotesk funciona, pero no aporta una voz tipográfica tan singular como exige la ambición visual de la marca.
- En anchuras estrechas, el titular y las métricas ocupan demasiado espacio y el ritmo vertical se vuelve pesado.
- La captura de página completa deja grandes zonas sin contenido porque varios elementos solo se revelan al entrar en pantalla. Esto afecta herramientas de captura, indexación visual y posibles condiciones de movimiento reducido.

## Traducción original de las referencias

| Referencia | Principio útil | Traducción para Little Crab |
| --- | --- | --- |
| Igloo | Recorrido espacial, escenas cambiantes, trabajo descubierto mediante interacción | Descenso oceánico por capas; proyectos encontrados como artefactos vivos; retorno a la superficie con una invitación clara |
| Igloo | El portafolio es parte del mundo, no una cuadrícula secundaria | Cada proyecto ocupa una escena y muestra su identidad, problema, experiencia y construcción |
| Refero / Dala | Un único foco visual recibe gran escala y espacio | Una forma bioluminiscente, corriente, coral o interfaz domina cada escena; se reducen adornos simultáneos |
| Refero / Dala | Tipografía monumental sobre un lienzo oscuro | Titulares editoriales propios, combinados con una tipografía de lectura cálida y precisa |

No deben copiarse los cristales, túneles, personajes, secuencias, partículas cerebrales, colores violetas ni recursos distintivos de esas referencias.

## Recorrido visual propuesto

### 1. Superficie — La visión

Una portada más luminosa y abierta presenta la promesa: tecnología diseñada con la esencia del cliente. El cangrejo invita a iniciar el descenso.

### 2. Descenso — Entender antes de construir

La luz disminuye y aparecen capas del negocio: identidad, usuarios, operación y objetivo. La filosofía deja de ser “sin nube siempre” y pasa a ser “hecho a tu medida, pensado para durar”.

### 3. Corriente — Capacidades conectadas

Productos digitales, automatización, contenido visual, experiencias conversacionales e IA aplicada aparecen como corrientes combinables. Se evita presentar cinco cajas cerradas.

### 4. Arrecife — Trabajo visible

Los proyectos reales o experimentos internos publicables se muestran a gran escala. Cada uno debe revelar decisiones visuales y técnicas, sin métricas inventadas.

### 5. Profundidad — Cómo cuidamos la calidad

El antiguo Swarm se transforma en un ciclo comprensible: estrategia, diseño, construcción y validación. Aquí se demuestra rigor, accesibilidad, pruebas y propiedad.

### 6. Emergencia — Personas y siguiente paso

La historia de Little Crab, sus valores y su cercanía recuperan calidez. El contacto pregunta qué quiere hacer posible el visitante y qué debería sentir o lograr su usuario.

## Prioridades de implementación

### P0 — Corregir

- Estabilizar la altura de la descripción rotativa de Swarm y repetir las pruebas de 390 px y 320 px.
- Garantizar que los cambios de texto o animación no alteren la altura del documento de forma periódica.

### P1 — Reorientar

- Reescribir portada, filosofía, servicios, proceso, sistema de calidad, presentación, contacto y metadatos alrededor de la idea central.
- Convertir las promesas absolutas en decisiones condicionadas y verificables.
- Sustituir el vocabulario interno del Swarm por lenguaje de calidad comprensible.
- Diseñar una sección de trabajo seleccionado cuando existan proyectos autorizados para publicar.

### P2 — Diferenciar

- Crear cambios de escena reales entre superficie, descenso, corriente, profundidad y emergencia.
- Reducir cuadrículas de tarjetas, píldoras, brillos y triángulos decorativos.
- Explorar una tipografía display con más personalidad y licenciamiento apto para producción.
- Diseñar un comportamiento propio del cangrejo para pantallas táctiles.
- Pausar canvas fuera de pantalla y con la pestaña oculta; reducir partículas y densidad en dispositivos modestos.

## Información que debe confirmarse

- Servicios disponibles hoy frente a capacidades en desarrollo.
- Condiciones reales de cualquier garantía, soporte o plazo de entrega.
- Cuándo se promete infraestructura local, nube o arquitectura híbrida.
- Proyectos que pueden mostrarse y qué resultados están documentados.
- Ubicación pública correcta: el documento interno menciona Medellín y el sitio publicado menciona Tocancipá.
- Datos de contacto y política de tratamiento de formularios.

Hasta confirmar estos puntos, la redacción debe usar lenguaje prudente y evitar cifras o garantías.

## Definición de completado para la primera iteración

- El fallo de scroll no se reproduce durante al menos doce segundos y varios ciclos de animación en 390 px y 320 px.
- La primera pantalla comunica audiencia, oferta, diferencia y acción sin depender de jerga técnica.
- Cada sección tiene un propósito narrativo distinto.
- Las afirmaciones importantes están verificadas o redactadas como opciones condicionadas.
- El proyecto compila y la navegación, formulario, audio y movimiento reducido funcionan.
- No se publica ningún cambio sin autorización expresa.
