import json

with open('data/canon/home_content.json', 'r') as f:
    data = json.load(f)

# Update twins for Marcus
if 'marcus' in data.get('wrapped', {}):
    marcus = data['wrapped']['marcus']
    if 'slide4' in marcus:
        marcus['slide4']['twins'] = [
            {
                'i': 'M',
                'g': 'linear-gradient(140deg,#F97316,#EA8CE1)' # Maddie gradient
            },
            {
                'i': 'A',
                'g': 'linear-gradient(140deg,#EA8CE1,#A13D99)' # Alessia gradient
            },
            {
                'i': 'J',
                'g': 'linear-gradient(140deg,#6C5CE0,#3B82F6)' # Jordan gradient
            }
        ]
        marcus['slide4']['sub'] = 'Maddie, Alessia, and Jordan felt that.'
        marcus['slide5']['sub'] = '5 answers · 2 shows · 12 twins. Post it and see who answered like you.'

with open('data/canon/home_content.json', 'w') as f:
    json.dump(data, f, indent=2)

print('Marcus wrapped connections updated successfully.')
