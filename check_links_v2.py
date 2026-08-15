import urllib.request
import urllib.error
import sys
from datetime import datetime

urls = [
    'https://deepgram.com/',
    'https://fonts.googleapis.com',
    'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap',
    'https://fonts.gstatic.com',
    'https://github.com/NousResearch/hermes-agent',
    'https://hermes-agent.nousresearch.com/docs',
    'https://huggingface.co/course',
    'https://learn.deeplearning.ai/',
    'https://docs.n8n.io',
    'https://ollama.com/',
    'https://render.com/docs',
    'https://www.langsmith.com/',
]

results = []
for url in urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req, timeout=10)
        status = response.getcode()
        final_url = response.geturl()
        results.append((url, status, final_url, 'OK'))
        print(f'{url} -> {status} (final: {final_url})')
    except urllib.error.HTTPError as e:
        results.append((url, e.code, url, f'HTTP {e.code}: {e.reason}'))
        print(f'{url} -> HTTP {e.code}: {e.reason}')
    except urllib.error.URLError as e:
        results.append((url, 0, url, f'ERROR: {e.reason}'))
        print(f'{url} -> ERROR: {e.reason}')
    except Exception as e:
        results.append((url, 0, url, f'ERROR: {e}'))
        print(f'{url} -> ERROR: {e}')

# Save to CSV
import csv
with open('link_validation_v2.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['URL', 'Status Code', 'Final URL', 'Observations', 'Validation Date', 'Responsible'])
    for url, status, final_url, obs in results:
        writer.writerow([url, status, final_url, obs, datetime.now().strftime('%Y-%m-%d'), 'Lilis (lc-qa-engineer)'])

print("\nReport saved to link_validation_v2.csv")