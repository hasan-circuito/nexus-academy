import sys
sys.stdout.reconfigure(encoding='utf-8')

with open("data/missions/mission-006.json", "r", encoding="utf-8") as f:
    lines = f.readlines()
print(f"M006 total lines: {len(lines)}")
targets = [31, 65, 84, 115, 155, 182, 260, 276]
for t in targets:
    if t <= len(lines):
        print(f"M006 Line {t:3d}: {lines[t-1].strip()[:80]}")
