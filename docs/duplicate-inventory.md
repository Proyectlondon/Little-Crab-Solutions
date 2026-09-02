# Inventario de versiones e intentos anteriores

Fecha de revisión: 1 de septiembre de 2026.

Este inventario separa la fuente de producción de los materiales antiguos o duplicados. No se ha eliminado ningún archivo.

## Fuente correcta de la web publicada

- Ruta de trabajo aislada: `D:\Little Crab Solutions\.codex-worktrees\website-production`
- Repositorio remoto: `Proyectlondon/Little-Crab-Solutions`
- Despliegue identificado: commit `ed5945d92f7c1fb6574522e313e7aa0dd85acdb3`
- Rama de esta revisión: `codex/website-audit`

Esta copia coincide con el proyecto publicado en Vercel y es la base adecuada para continuar.

## Candidato 1: intento antiguo de landing

- Ruta: `D:\Proyectos IA\Little Crab Delivery`
- Evidencia: contiene otra landing de Little Crab en HTML/CSS/JS, documentos de requisitos, una variante `change-013g-lead-capture`, pruebas y dependencias locales de Playwright.
- Recomendación: archivar primero o eliminar únicamente después de confirmar que no contiene entregables comerciales ni automatizaciones que deban conservarse.
- Estado: pendiente de autorización.

## Candidato 2: blueprint antiguo dentro del proyecto correcto

- Ruta: `D:\Little Crab Solutions\.codex-worktrees\website-production\web-blueprint-skill`
- Evidencia: replica los componentes de la web como una plantilla genérica y prescribe que todos los clientes mantengan el océano, el cursor y las mismas animaciones.
- Riesgo: entra en conflicto con el principio actual de diseñar cada producto desde la identidad específica del cliente.
- Recomendación: conservar temporalmente como referencia histórica; después extraer cualquier componente reutilizable y reemplazar sus instrucciones por la skill `little-crab-experience-design`.
- Estado: no eliminar todavía.

## Elementos que no deben tratarse como duplicados

- `D:\Little Crab Solutions`: es el repositorio de origen y contiene trabajo local del usuario en otra historia/estado. No debe borrarse ni limpiarse automáticamente.
- `D:\Proyectos IA\Web 1`: la inspección inicial mostró contenido de otro proyecto, no una copia verificable de la web de Little Crab.

## Regla para la limpieza

Antes de eliminar cualquier candidato se debe:

1. revisar su estado de Git y sus archivos únicos;
2. separar secretos, formularios, automatizaciones y material comercial;
3. crear un respaldo recuperable si existe alguna duda;
4. obtener autorización explícita para la ruta exacta.
