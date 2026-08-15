with open('learning-path-ia.html', 'rb') as f:
    content = f.read()
idx = content.find(b'30 min')
print(content[idx-50:idx+30])