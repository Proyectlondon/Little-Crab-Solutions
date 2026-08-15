with open('learning-path-ia.html', 'r', encoding='utf-8') as f:
    content = f.read()
idx = content.find('30 min')
print(repr(content[idx-50:idx+30]))