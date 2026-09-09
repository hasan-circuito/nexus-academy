import json

for i in range(1, 11):
    fname = f"B:/nexus-academy/data/missions/mission-{i:03d}.json"
    with open(fname, "r", encoding="utf-8") as f:
        data = json.load(f)
    steps = data.get('steps', [])
    step_types = [s.get('type') for s in steps]
    print(f"Mission {i:03d} (Total steps: {len(steps)}):")
    for idx, st in enumerate(step_types):
        print(f"  [{idx:02d} / Step {idx+1:02d}] {st}")
