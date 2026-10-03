import json

transcript_path = '/Users/apple/.gemini/antigravity-ide/brain/b6c05f87-a356-49e2-8b1e-ac9e4c15e584/.system_generated/logs/transcript_full.jsonl'
best_content = None

with open(transcript_path, 'r') as f:
    for line in f:
        try:
            data = json.loads(line)
            if data.get('type') == 'PLANNER_RESPONSE':
                for tc in data.get('tool_calls', []):
                    if tc.get('name') in ['write_to_file', 'multi_replace_file_content']:
                        args = tc.get('args', {})
                        if args.get('TargetFile') == '/Users/apple/Documents/imod/src/app/page.tsx':
                            if tc.get('name') == 'write_to_file':
                                best_content = args.get('CodeContent')
        except:
            pass

if best_content:
    with open('src/app/page.tsx', 'w') as f:
        f.write(best_content)
    print("Recovered from write_to_file in transcript!")
else:
    print("Not found in write_to_file.")
