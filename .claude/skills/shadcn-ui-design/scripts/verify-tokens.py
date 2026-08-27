#!/usr/bin/env python3
"""
verify-tokens.py
Verify that all 1,812 Figma variables are documented in the reference files.
Usage: python3 verify-tokens.py
"""
import json, os
from collections import defaultdict

SKILL_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOKEN_SRC  = os.path.join(SKILL_DIR, 'assets', 'variables-export.json')
REF_FILES  = [
    os.path.join(SKILL_DIR, 'references', 'design-tokens.md'),
    os.path.join(SKILL_DIR, 'references', 'full-registry.md'),
]

with open(TOKEN_SRC) as f:
    data = json.load(f)

combined = ''
for path in REF_FILES:
    with open(path) as f:
        combined += f.read()

by_col = defaultdict(list)
for v in data['variables']:
    by_col[v['collectionName']].append(v)

total = missing_total = 0
for col in data['collections']:
    vl = by_col[col['name']]
    missing = [v['name'] for v in vl if v['name'] not in combined]
    status = '✅' if not missing else '❌'
    print(f"{status} {col['name']:30s} {len(vl)-len(missing)}/{len(vl)}")
    if missing:
        for m in missing[:3]:
            print(f"     missing: {m!r}")
    total += len(vl)
    missing_total += len(missing)

print(f"\n{'✅' if missing_total == 0 else '❌'} Total: {total - missing_total}/{total} | missing: {missing_total}")
