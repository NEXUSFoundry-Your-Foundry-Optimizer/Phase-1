import os

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    # Replace teal with orange
    new_content = new_content.replace('#00AFA3', '#f97316')
    
    # Replace old darks with new dark browns
    new_content = new_content.replace('#1E1E2F', '#281105')
    new_content = new_content.replace('#0A0A0F', '#140800')
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk(r'c:\Users\kkani\Documents\melting_twin\frontend\src'):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.css'):
            replace_in_file(os.path.join(root, file))
