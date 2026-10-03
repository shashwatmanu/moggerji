import json
import os
import glob

maps = glob.glob('.next/dev/static/chunks/**/*.map', recursive=True) + glob.glob('.next/server/chunks/**/*.map', recursive=True)
for map_file in maps:
    try:
        with open(map_file) as f:
            data = json.load(f)
        for idx, src in enumerate(data.get('sources', [])):
            if 'page.tsx' in src and 'src/app/page.tsx' in src:
                content = data['sourcesContent'][idx]
                if "ThematicBackground" in content:
                    with open('src/app/page.tsx', 'w') as out:
                        out.write(content)
                    print(f"RECOVERED SUCCESS from {map_file}!")
                    exit(0)
    except Exception as e:
        pass
