with open('learning-path-ia.html', 'r', encoding='utf-8') as f:
    content = f.read()
# Find the line with the issue
for i, line in enumerate(content.split('\n'), 1):
    if '30 min' in line and '<' in line:
        print(f'Line {i}: {repr(line)}')