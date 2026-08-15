import urllib.request
import urllib.error
import sys
from datetime import datetime

# Check corrected URLs
urls = [
    'https://github.com/NousResearch/hermes-agent',
    'https://www.n8n.io/academy',
    'https://n8n.io/academy/',
    'https://learn.deeplearning.ai/',
    'https://render.com/docs/deploy-docker',
    'https://docs.render.com/deploy-docker',
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
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
with open('link_validation_report2.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['URL', 'Status Code', 'Final URL', 'Observations', 'Validation Date', 'Responsible'])
    for url, status, final_url, obs in results:
        writer.writerow([url, status, final_url, obs, datetime.now().strftime('%Y-%m-%d'), 'Lilis (lc-qa-engineer)'])

print("\nReport saved to link_validation_report2.csv")