import re
import sys

# Read the coverage output
with open('coverage-analysis-output.txt', 'r') as f:
    content = f.read()

# Find the coverage table section
match = re.search(r'Coverage report from v8\s+(?:-+\|.*?)+-+\|(.*?)All files\s+\|', content, re.DOTALL)
if not match:
    print("Could not find coverage table")
    sys.exit(1)

table_content = match.group(0)

# Extract file coverage data
lines = table_content.split('\n')
files_below_70 = []
files_70_plus = []
all_files = []

for line in lines:
    if '|' in line and not line.strip().startswith('-') and not line.strip().startswith('File'):
        parts = [p.strip() for p in line.split('|')]
        if len(parts) >= 5:
            file = parts[0]
            stmts = parts[1]
            
            # Skip non-file rows
            if not file or file == 'All files' or '...' in file:
                continue
                
            # Parse percentage
            try:
                stmt_pct = float(stmts)
                all_files.append((file, stmt_pct))
                
                if stmt_pct < 70:
                    files_below_70.append((file, stmt_pct))
                else:
                    files_70_plus.append((file, stmt_pct))
            except ValueError:
                pass

# Sort by coverage percentage
files_below_70.sort(key=lambda x: x[1])
files_70_plus.sort(key=lambda x: x[1], reverse=True)

# Print results
print("=" * 80)
print("COVERAGE ANALYSIS REPORT")
print("=" * 80)
print(f"\nTotal files analyzed: {len(all_files)}")
print(f"Files below 70% coverage: {len(files_below_70)}")
print(f"Files at or above 70% coverage: {len(files_70_plus)}")
print()

print("=" * 80)
print("FILES AT OR ABOVE 70% COVERAGE (Good)")
print("=" * 80)
for file, pct in files_70_plus[:30]:  # Show top 30
    print(f"  {file:50s} {pct:6.2f}%")
if len(files_70_plus) > 30:
    print(f"  ... and {len(files_70_plus) - 30} more")

print()
print("=" * 80)
print("FILES BELOW 70% COVERAGE (Need Attention)")
print("=" * 80)
print(f"\nTotal files needing attention: {len(files_below_70)}\n")

# Categorize by coverage ranges
no_coverage = [(f, p) for f, p in files_below_70 if p == 0]
very_low = [(f, p) for f, p in files_below_70 if 0 < p < 30]
low = [(f, p) for f, p in files_below_70 if 30 <= p < 50]
medium = [(f, p) for f, p in files_below_70 if 50 <= p < 70]

print(f"0% coverage (No tests): {len(no_coverage)} files")
for file, pct in no_coverage[:20]:
    print(f"  {file:50s} {pct:6.2f}%")
if len(no_coverage) > 20:
    print(f"  ... and {len(no_coverage) - 20} more")

print(f"\n1-29% coverage (Very low): {len(very_low)} files")
for file, pct in very_low[:20]:
    print(f"  {file:50s} {pct:6.2f}%")
if len(very_low) > 20:
    print(f"  ... and {len(very_low) - 20} more")

print(f"\n30-49% coverage (Low): {len(low)} files")
for file, pct in low[:20]:
    print(f"  {file:50s} {pct:6.2f}%")
if len(low) > 20:
    print(f"  ... and {len(low) - 20} more")

print(f"\n50-69% coverage (Medium - close to target): {len(medium)} files")
for file, pct in medium[:20]:
    print(f"  {file:50s} {pct:6.2f}%")
if len(medium) > 20:
    print(f"  ... and {len(medium) - 20} more")

print()
print("=" * 80)
print("PRIORITY RECOMMENDATIONS")
print("=" * 80)
print("""
1. Focus on files with 50-69% coverage first - they're close to 70% target
2. Add tests to core business logic files (API services, hooks, utilities)
3. Component tests for UI elements that are critical for user flows
4. Consider skipping Storybook files and stories from coverage requirements
5. Type definition files (.d.ts) can be excluded from coverage calculations

Files to prioritize:
- Shared utilities (cn.ts, normalize.ts, http.ts, authToken.ts)
- API services (auth.api.ts, habits.api.ts, tasks.api.ts)
- React hooks (useHabits, useTasks, useJournal)
- Core components (HabitCard, TaskItem, JournalEntry)
""")

