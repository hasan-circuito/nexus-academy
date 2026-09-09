import json
import re
import sys

# Set utf-8 output
sys.stdout.reconfigure(encoding='utf-8')

# Detailed checker
print("=================== FORENSIC CODE INSPECTION (M001-M005) ===================")

for i in range(1, 6):
    fname = f"B:/nexus-academy/data/missions/mission-{i:03d}.json"
    with open(fname, "r", encoding="utf-8") as f:
        data = json.load(f)
    print(f"\n--- Mission {i:03d}: {data.get('title')} ---")
    
    for idx, step in enumerate(data.get('steps', [])):
        stype = step.get('type')
        for key in ['code', 'starterCode', 'solution', 'buggyCode', 'fixedCode']:
            if key in step:
                code_text = step[key]
                print(f"[{stype} #{idx}] {key}:\n{code_text}")
                print("-" * 30)

print("\n=================== VALIDATION CHECKS (M001-M005) ===================")
for i in range(1, 6):
    fname = f"B:/nexus-academy/data/missions/mission-{i:03d}.json"
    with open(fname, "r", encoding="utf-8") as f:
        data = json.load(f)
    for idx, step in enumerate(data.get('steps', [])):
        if step.get('type') == 'practice':
            print(f"M00{i} Practice Step {idx} validation:", step.get('validation'))
        if step.get('type') == 'debug_challenge':
            print(f"M00{i} Debug Step {idx} scenario:", step.get('scenario'), "buggyCode:", step.get('buggyCode'), "fixedCode:", step.get('fixedCode'))
