with open('learning-path-ia.html', 'r', encoding='utf-8') as f:
    content = f.read()
# Get the exact bytes around the issue
idx = content.find('30 min')
print(repr(content[idx-50:idx+30]))