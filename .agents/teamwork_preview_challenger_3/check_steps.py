import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

for i in range(1, 4):
    with open(f"data/missions/mission-{i:03d}.json", "r", encoding="utf-8") as f:
        m = json.load(f)
    print(f"=== M{i:03d} Steps ===")
    for idx, s in enumerate(m.get("steps", [])):
        print(f"idx {idx:2d} | Step {idx+1:2d} | type: {s.get('type')}")
