import json
import re
import subprocess
import os

files = ['index.html', 'bukanu.html', 'kalonji.html', 'moringa.html', 'ajwain.html', 'curry-leaves.html', 'kasuri-methi.html']
for fn in files:
    if not os.path.exists(fn):
        continue
    content = open(fn, encoding='utf-8').read()
    schemas = re.findall(r'<script type="application/ld\+json">(.*?)</script>', content, re.DOTALL)
    print(f"=== {fn} ({len(schemas)} schemas) ===")
    for i, s in enumerate(schemas):
        try:
            data = json.loads(s.strip())
            stype = data.get('@type') or [item.get('@type') for item in data.get('@graph', [])]
            print(f"  [{i+1}] {stype}")
        except Exception as e:
            print(f"  [{i+1}] Error parsing JSON: {e}")
