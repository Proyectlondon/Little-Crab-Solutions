import json
with open('lighthouse-report.json') as f:
    data = json.load(f)
categories = data.get('categories', {})
for cat_id, cat in categories.items():
    print(f'{cat_id}: score={cat.get("score")}, title={cat.get("title")}')