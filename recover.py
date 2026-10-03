import json
import os
import glob

maps = glob.glob('.next/dev/server/chunks/ssr/*.map')
for map_file in maps:
    try:
        with open(map_file) as f:
            data = json.load(f)
        for idx, src in enumerate(data.get('sources', [])):
            if 'src/app/page.tsx' in src:
                content = data['sourcesContent'][idx]
                if "ThematicBackground" in content:
                    with open('src/app/page.tsx', 'w') as out:
                        out.write(content)
                    print("RECOVERED SUCCESS!")
                    exit(0)
    except Exception as e:
        pass
