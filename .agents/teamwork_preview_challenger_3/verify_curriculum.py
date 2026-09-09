import json
import sys

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

print("=== VERIFYING MISSIONS 001 - 005 ===")
for i in range(1, 6):
    path = f"data/missions/mission-{i:03d}.json"
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    steps = data.get("steps", [])
    print(f"\nMission {i:03d} (Total steps: {len(steps)}):")
    for idx, s in enumerate(steps):
        stype = s.get("type")
        stitle = s.get("title", "")
        print(f"  idx {idx:2d} | Step {idx+1:2d} | type: {stype:16s} | title: {stitle[:40]}")

print("\n=== VERIFYING M005 LITERALS & DEBUG CHALLENGES ===")
with open("data/missions/mission-005.json", "r", encoding="utf-8") as f:
    m5 = json.load(f)

for idx, s in enumerate(m5.get("steps", [])):
    stype = s.get("type")
    if stype in ["practice", "debug_challenge"]:
        print(f"\nStep {idx+1} ({stype}): {s.get('title')}")
        code = s.get("starterCode", "") or s.get("buggyCode", "") or s.get("solutionCode", "")
        print("  Code snippet:", repr(code[:100]))
        if "validation" in s:
            print("  Expected output:", s["validation"].get("expectedOutput"))
