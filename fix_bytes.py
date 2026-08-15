with open('learning-path-ia.html', 'rb') as f:
    content = f.read()

# Fix the unescaped < character
content = content.replace(b'en < 30 min', b'en < 30 min')

with open('learning-path-ia.html', 'wb') as f:
    f.write(content)

print("Fixed")