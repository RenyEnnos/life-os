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
    # Using non-greedy match .*? with DOTALL to handle multi-line comments if any
    content = re.sub(r'<!--(.*?)-->', r'{/*\1*/}', content, flags=re.DOTALL)

    # 2. Fix Style Attributes (Background Image specific case)
    # Pattern: style='background-image: url("...")' or style='background-image: url("...");'
    # We capture the URL inside the double quotes.
    
    # Regex explanation:
    # style='                  Match literal style='
    # background-image:\s*url  Match property
    # \("([^"]+)"\)            Match ("URL") and capture URL
    # ;?                       Optional semicolon
    # '                        Closing quote
    
    pattern = r"style='background-image:\s*url\("([^"]+)"\);?'"
    replacement = r"style={{ backgroundImage: 'url("\1")' }}"
    
    content = re.sub(pattern, replacement, content)

    if content != original_content:
        print(f"FIXED: {filepath}")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
    else:
        # print(f"Clean: {filepath}")
        pass

print("Starting HTML Slop Cleanup...")
target_dir = os.path.join("src", "features")

for root, dirs, files in os.walk(target_dir):
    for file in files:
        if file.endswith(".tsx"):
            fix_file(os.path.join(root, file))

print("Cleanup complete.")
