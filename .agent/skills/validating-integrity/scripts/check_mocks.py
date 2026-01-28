import os
import sys
import re

def scan_for_mocks(root_dir):
    mock_patterns = [
        r'jest\.fn\(',
        r'mockResolvedValue',
        r'mockReturnValue',
        r'spyOn',
        r'// @ts-ignore',
        r'TODO:',
        r'FIXME:',
        r'const .* = .*Mock'
    ]
    
    # Files/Dirs to ignore
    ignore_dirs = ['node_modules', '.git', 'dist', 'build', '.agent', 'coverage']
    ignore_files = ['setupTests.ts', 'check_mocks.py', '.test.ts', '.spec.ts', '.test.tsx', '.spec.tsx'] # We might want to be strict about .spec.ts later

    findings = []

    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Filter directories
        dirnames[:] = [d for d in dirnames if d not in ignore_dirs]
        
        for filename in filenames:
            if any(filename.endswith(ext) for ext in ignore_files):
                continue
                
            filepath = os.path.join(dirpath, filename)
            
            # Skip non-code files
            if not filename.endswith(('.ts', '.tsx', '.js', '.jsx')):
                continue

            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                    
                for i, line in enumerate(lines):
                    for pattern in mock_patterns:
                        if re.search(pattern, line):
                            # Categorize
                            severity = "WARNING"
                            if "jest.fn" in pattern or "mock" in pattern.lower():
                                severity = "CRITICAL" if "src" in dirpath else "INFO"
                            
                            findings.append({
                                'file': filepath,
                                'line': i + 1,
                                'content': line.strip(),
                                'pattern': pattern,
                                'severity': severity
                            })
            except Exception as e:
                # Ignore verify errors
                pass

    return findings

def main():
    if len(sys.argv) < 2:
        print("Usage: python check_mocks.py <directory>")
        sys.exit(1)
        
    target_dir = sys.argv[1]
    results = scan_for_mocks(target_dir)
    
    if not results:
        print("✅ No mocks or critical TODOs found in production code.")
        return

    print(f"\n🔍 Integrity Scan Results ({len(results)} issues found)\n")
    
    criticals = [r for r in results if r['severity'] == "CRITICAL"]
    warnings = [r for r in results if r['severity'] == "WARNING"]
    infos = [r for r in results if r['severity'] == "INFO"]

    if criticals:
        print("🔴 CRITICAL (Mocks in Production):")
        for r in criticals:
            print(f"  - {r['file']}:{r['line']} -> {r['content']}")
        print()

    if warnings:
        print("🟡 WARNINGS (Potential Issues):")
        for r in warnings:
            print(f"  - {r['file']}:{r['line']} -> {r['content']}")
        print()

    if infos:
        print("🔵 INFO (TODOs/Notes):")
        for r in infos:
            print(f"  - {r['file']}:{r['line']} -> {r['content']}")
            
    if criticals:
        sys.exit(1) # Fail build if criticals found

if __name__ == "__main__":
    main()
