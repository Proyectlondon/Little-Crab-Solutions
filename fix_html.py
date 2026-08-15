with open('learning-path-ia.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the unescaped < character - replace with <
content = content.replace('en < 30 min', 'en < 30 min')

with open('learning-path-ia.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed")