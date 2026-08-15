# Video Demo Placeholder

Este directorio contendrá el video demo generado con Hyperframes + Gloria TTS.

## Especificaciones requeridas:
- **Archivo**: `learning-path-demo.mp4`
- **Formato**: MP4 (H.264, AAC)
- **Resolución**: 1080x1920 (vertical 9:16)
- **Duración**: < 60 segundos
- **Tamaño**: < 10 MB
- **Subtítulos**: `learning-path-demo.vtt` (español)

## Generación:
```bash
# Usando Hyperframes (vía Hermes/ecosystem)
hyperframe_text_to_video \
  --script "scripts/video-script.md" \
  --tts-voice "gloria" \
  --language "es" \
  --output "assets/video/learning-path-demo.mp4" \
  --subtitles "assets/video/learning-path-demo.vtt"
```

## Poster/Thumbnail:
- **Archivo**: `poster.jpg`
- **Resolución**: 1080x1920
- **Uso**: `poster` attribute en `<video>` tag

## Guión (60s vertical):
1. 0-5s: Hook - "De brief a plan automático en 60 segundos"
2. 5-15s: Form submit demo
3. 15-35s: n8n workflow → Notion page
4. 35-50s: Discord notificación + audio Gloria
5. 50-60s: CTA + logo Little Crab