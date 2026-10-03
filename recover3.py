import json
import os
import glob

maps = glob.glob('.next/**/*.map', recursive=True)
# Sort by modification time, newest first
maps.sort(key=lambda x: os.path.getmtime(x), reverse=True)

for map_file in maps:
    try:
        with open(map_file) as f:
            data = json.load(f)
        for idx, src in enumerate(data.get('sources', [])):
            if 'src/app/page.tsx' in src:
                content = data['sourcesContent'][idx]
                # Look for a signature of the newest version
                if "incomingCollection" in content:
                    with open('src/app/page.tsx', 'w') as out:
                        out.write(content)
                    print(f"RECOVERED SUCCESS from {map_file}!")
                    exit(0)
    except Exception as e:
        pass
print("Not found")
