import os
import re

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Skipping {filepath}: {e}")
        return

    original_content = content

    # 1. Fix HTML Comments: <!-- comment --> -> {/* comment */}
    content = re.sub(r'<!--(.*?)-->', r'{/*\1*/}', content, flags=re.DOTALL)

    # 2. Fix Style Attributes (Background Image specific case)
    def replace_style(match):
        url = match.group(1)
        return "style={{ backgroundImage: 'url("" + url + "")' }}"

    # Using triple quotes to safely contain both ' and " without escaping hell
    # Also removed the trailing space inside the pattern that I might have added in thought
    pattern = re.compile(r'''style='background-image:\s*url\("([^"]+)"\);?' ''')
    
    # Actually, the previous error was likely due to unbalanced regex grouping or Python string parsing
    # Let's try the simplest raw string with escaped internal quotes
    # style='background-image: url("...")'
    
    pattern_simple = r"style='background-image:\s*url\("([^"]+)"\);?'"
    
    content = re.sub(pattern_simple, replace_style, content)

    if content != original_content:
        print(f"FIXED: {filepath}")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

print("Starting HTML Slop Cleanup V4...")
target_dir = os.path.join("src", "features")

for root, dirs, files in os.walk(target_dir):
    for file in files:
        if file.endswith(".tsx"):
            fix_file(os.path.join(root, file))

print("Cleanup complete.")
