import json

# Check python output behavior for arithmetic division in M006
print("Testing division behavior:")
print("10 / 2 =", 10 / 2, type(10 / 2))
print("10 // 2 =", 10 // 2, type(10 // 2))

# Verify print argument counts across M001 to M005
print("\nVerifying print argument counts across M001-M005:")
for i in range(1, 6):
    fname = f"B:/nexus-academy/data/missions/mission-{i:03d}.json"
    with open(fname, "r", encoding="utf-8") as f:
        content = f.read()
    # Find all print(...) in the file
    import re
    prints = re.findall(r'print\s*\([^)]+\)', content)
    print(f"Mission {i:03d} total print occurrences in JSON: {len(prints)}")
    multi_args = [p for p in prints if ',' in p and not p.startswith('print("') and not p.startswith("print('")]
    print(f"  Multi-argument or comma prints: {multi_args}")

# Check comments in starter code
print("\nChecking starter codes in M001-M005 for comments:")
for i in range(1, 6):
    fname = f"B:/nexus-academy/data/missions/mission-{i:03d}.json"
    with open(fname, "r", encoding="utf-8") as f:
        data = json.load(f)
    for idx, s in enumerate(data.get('steps', [])):
        if s.get('type') == 'practice':
            sc = s.get('starterCode', '')
            if '#' in sc:
                print(f"Mission {i:03d} Step {idx+1} starterCode has comments: {sc.strip().splitlines()[:1]}")
