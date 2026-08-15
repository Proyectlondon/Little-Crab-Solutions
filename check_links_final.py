import urllib.request
import urllib.error
import sys
from datetime import datetime

# Final corrected URLs to use in the HTML
urls = [
    ('https://deepgram.com/', 'Deepgram - TTS y Speech-to-Text (Gloria)'),
    ('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap', 'Google Fonts CSS'),
    ('https://github.com/NousResearch/hermes-agent', 'Repositorio de código abierto Hermes'),
    ('https://hermes-agent.nousresearch.com/docs', 'Documentación oficial de Hermes Agent'),
    ('https://huggingface.co/course', 'Hugging Face Course - Unit 3 & 4 (RAG + Agents)'),
    ('https://learn.deeplearning.ai/', 'DeepLearning.AI - Short Courses (Prompt Engineering, RAG, Agents)'),
    ('https://docs.n8n.io', 'n8n Documentation y Learning Resources'),
    ('https://ollama.com/', 'Ollama - Modelos locales compatibles con OpenAI API'),
    ('https://www.langsmith.com/', 'LangSmith - Observabilidad para agentes'),
    ('https://render.com/docs', 'Render Documentation - Deploy Docker'),
]

results = []
for url, description in urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req, timeout=10)
        status = response.getcode()
        final_url = response.geturl()
        results.append((url, description, status, final_url, 'OK'))
        print(f'OK: {url} -> {status}')
    except urllib.error.HTTPError as e:
        results.append((url, description, e.code, url, f'HTTP {e.code}: {e.reason}'))
        print(f'FAIL: {url} -> HTTP {e.code}: {e.reason}')
    except urllib.error.URLError as e:
        results.append((url, description, 0, url, f'ERROR: {e.reason}'))
        print(f'FAIL: {url} -> ERROR: {e.reason}')
    except Exception as e:
        results.append((url, description, 0, url, f'ERROR: {e}'))
        print(f'FAIL: {url} -> ERROR: {e}')

# Save to CSV
import csv
with open('link_validation_final.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['URL', 'Description', 'Status Code', 'Final URL', 'Observations', 'Validation Date', 'Responsible'])
    for url, desc, status, final_url, obs in results:
        writer.writerow([url, desc, status, final_url, obs, datetime.now().strftime('%Y-%m-%d'), 'Lilis (lc-qa-engineer)'])

print("\nFinal report saved to link_validation_final.csv")