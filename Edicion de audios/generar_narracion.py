import os
import sys
import time
import shutil
import requests
from pathlib import Path

# Configuración por defecto
API_URL = "http://127.0.0.1:8888/tts"
DEFAULT_VOICE = Path(r"D:\Proyectos IA\JJ Ecosystem\little-crab-landing\Edicion de audios\thanos_reference_10s.wav")
OUTPUT_DIR = Path(r"D:\Proyectos IA\JJ Ecosystem\little-crab-landing\Edicion de audios")

def check_api():
    try:
        resp = requests.get("http://127.0.0.1:8888/health", timeout=3)
        return resp.status_code == 200
    except:
        return False

def main():
    print("=" * 60)
    print("        GENERADOR DE NARRACIÓN LOCAL - CHATTERBOX")
    print("=" * 60)

    # 1. Verificar API
    if not check_api():
        print("[ERROR] El servidor Chatterbox TTS no está activo.")
        print("Para iniciarlo, corre este comando en una terminal:")
        print(r'  & "D:\Proyectos IA\JJ Ecosystem\chatterbox-env\Scripts\python.exe" -u "D:\Proyectos IA\JJ Ecosystem\chatterbox-tts-skill\api_server.py"')
        print("=" * 60)
        input("\nPresiona Enter para salir...")
        sys.exit(1)

    print("[OK] Servidor Chatterbox TTS detectado.")

    # 2. Entrada de texto
    print("\nEscribe o pega el texto que deseas narrar:")
    print("(Presiona Enter en una línea vacía para terminar de ingresar texto)")
    lines = []
    while True:
        try:
            line = input()
            if not line.strip():
                break
            lines.append(line)
        except EOFError:
            break
    
    text = " ".join(lines).strip()
    if not text:
        print("[WARN] No ingresaste ningún texto. Saliendo...")
        time.sleep(2)
        sys.exit(0)

    # 3. Selección de voz
    print(f"\nVoz de referencia actual: {DEFAULT_VOICE.name}")
    change_voice = input("¿Deseas usar otra voz (.wav)? (s/N): ").strip().lower()
    voice_path = DEFAULT_VOICE
    if change_voice == 's':
        new_path = input("Ingresa la ruta absoluta del archivo de voz (.wav): ").strip().replace('"', '')
        if Path(new_path).exists():
            voice_path = Path(new_path)
            print(f"[OK] Usando voz: {voice_path.name}")
        else:
            print("[WARN] Archivo no encontrado. Usando la voz por defecto.")

    # 4. Enviar petición
    print("\nGenerando narración (esto puede tomar unos segundos)...")
    payload = {
        "text": text,
        "model": "multilingual-v3",
        "language": "es",
        "temperature": 0.8,
        "voice_ref": str(voice_path)
    }

    try:
        start_time = time.time()
        resp = requests.post(API_URL, json=payload, timeout=120)
        
        if resp.status_code == 200:
            data = resp.json()
            temp_audio_path = data.get("audio_path")
            
            if temp_audio_path and os.path.exists(temp_audio_path):
                # Generar nombre único para el archivo de salida
                timestamp = time.strftime("%Y%m%d_%H%M%S")
                output_file = OUTPUT_DIR / f"narracion_{timestamp}.wav"
                
                # Copiar el archivo temporal al destino
                shutil.copy(temp_audio_path, output_file)
                
                elapsed = time.time() - start_time
                print("\n" + "=" * 60)
                print("[¡ÉXITO!] Audio generado correctamente.")
                print(f"Archivo guardado en: {output_file}")
                print(f"Duración de la narración: {data.get('duration_sec')}s")
                print(f"Tiempo de procesamiento: {elapsed:.2f}s")
                print("=" * 60)
            else:
                print(f"\n[ERROR] El servidor no devolvió un archivo válido. Respuesta: {data}")
        else:
            print(f"\n[ERROR] Falló la API de Chatterbox (Código {resp.status_code}): {resp.text}")
    except Exception as e:
        print(f"\n[ERROR] Ocurrió un fallo al comunicarse con la API: {e}")

    input("\nPresiona Enter para finalizar...")

if __name__ == "__main__":
    main()
