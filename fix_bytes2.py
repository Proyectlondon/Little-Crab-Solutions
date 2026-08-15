with open('learning-path-ia.html', 'rb') as f:
    content = f.read()

# Find the exact bytes
idx = content.find(b'30 min')
print("Before:", content[idx-50:idx+30])

# Replace < with <
content = content.replace(b'< 30 min', b'< 30 min')

idx2 = content.find(b'30 min')
print("After:", content[idx2-50:idx2+30])

with open('learning-path-ia.html', 'wb') as f:
    f.write(content)

print("Fixed")