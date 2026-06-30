import os
import re

DOMPURIFY_CDN = '<script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.6/purify.min.js"></script>'

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # 1. Inject DOMPurify into HTML files
    if filepath.endswith('.html'):
        if 'purify.min.js' not in content:
            content = content.replace('</head>', f'  {DOMPURIFY_CDN}\n</head>')

    # 2. Wrap innerHTML assignments
    # We use a naive regex replacement that replaces .innerHTML = `...` or "..."
    # Replace single line innerHTML = ...;
    def replacer(match):
        left = match.group(1)
        right = match.group(2)
        end = match.group(3)
        if 'DOMPurify' in right:
            return match.group(0)
        return f"{left} = window.DOMPurify ? DOMPurify.sanitize({right}) : {right}{end}"

    content = re.sub(r'(\.innerHTML)\s*=\s*([^;\n]+)(;|\n)', replacer, content)

    # 3. Replace innerHTML += ...
    def append_replacer(match):
        left_obj = match.group(1)
        right = match.group(2)
        end = match.group(3)
        if 'DOMPurify' in right:
            return match.group(0)
        return f"{left_obj}.innerHTML = window.DOMPurify ? DOMPurify.sanitize({left_obj}.innerHTML + {right}) : {left_obj}.innerHTML + {right}{end}"

    content = re.sub(r'([\w\.\$\[\]\'\"]+)\.innerHTML\s*\+=\s*([^;\n]+)(;|\n)', append_replacer, content)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed: {filepath}")

if __name__ == "__main__":
    print("Starting Sentinel Fixer...")
    for root, _, files in os.walk('.'):
        if 'node_modules' in root or '.git' in root:
            continue
        for file in files:
            if file.endswith('.html') or file.endswith('.js'):
                process_file(os.path.join(root, file))
    print("Done applying DOMPurify wrapping!")
