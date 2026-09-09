import re
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open("B:/nexus-academy/.agents/teamwork_preview_orchestrator_1/AUDIT_REPORT.md", "r", encoding="utf-8") as f:
    lines = f.readlines()

print(f"Total lines in AUDIT_REPORT.md: {len(lines)}")

# Search for key terms and check context
searches = [
    ("Labeled output / multi-argument print", ["multi-argument", "labeled output", "print(label", "print(\"Total:\""]),
    ("Division / float coercion", ["float coercion", "Option A", "Option B", "10 / 2", "5.0"]),
    ("2-step capture scaffolding for int(input())", ["2-step", "scaffold", "int(input())", "raw_text", "age_text"]),
    ("13-step array index citations", ["array idx", "Step 6", "Step 9", "Step 11", "Steps 12-14", "Steps 13-15"]),
    ("Taxonomy notes on narrow exposure", ["Taxonomy Calibration", "Narrow Scope", "Narrow Syntactic Scope", "Single-Line Comments", "literal \"50\""]),
]

for name, patterns in searches:
    print(f"\n==================== {name} ====================")
    for p in patterns:
        matches = [(i+1, line.strip()) for i, line in enumerate(lines) if p.lower() in line.lower()]
        print(f"\nPattern '{p}' ({len(matches)} matches):")
        for lnum, ltext in matches[:5]:
            print(f"  L{lnum}: {ltext[:100]}")
        if len(matches) > 5:
            print(f"  ... and {len(matches) - 5} more matches")
