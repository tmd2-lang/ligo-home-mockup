import json

with open('data/canon/home_content.json', 'r') as f:
    data = json.load(f)

data['wrapped']['marcus'] = {
  'meshClass': 'green-blue-mesh',
  'starsColor': '#10B981',
  'sealedText': 'You bridge every scene. From organic house to classic rock, you brought everyone together this week.',
  'theme': {
    'horoscopeIconColor': '#10B981',
    'slide2Glow': 'radial-gradient(460px 460px at 18% 14%, rgba(16,185,129,0.15), transparent 62%)',
    'slide2Eyebrow': '#34D399',
    'slide3Glow': 'radial-gradient(460px 460px at 82% 16%, rgba(5,150,105,0.20), transparent 62%)',
    'slide3Eyebrow': '#10B981',
    'slide3Borders': [
      '#34D399',
      '#10B981',
      '#059669'
    ],
    'slide4Glow': 'radial-gradient(460px 460px at 20% 18%, rgba(16,185,129,0.15), transparent 62%)',
    'slide4Eyebrow': '#34D399',
    'slide5Glow': 'radial-gradient(460px 460px at 50% 18%, rgba(16,185,129,0.15), transparent 62%)'
  },
  'slide1': {
    'title': 'The Deep Cut\nGeneralist',
    'subtitle': 'Top 38% more niche',
    'text': 'You don\'t share one lane with everyone; you share a different lane with almost everyone. This week, you bridged the gap between organic house, psych-indie, and underground rap.'
  },
  'slide2': {
    'big': '5',
    'unit': 'answers',
    'sub': 'Connecting the scenes.',
    'cover': '/covers/oracularspectacular-coverart.jpeg',
    'song': '"Electric Feel"',
    'artist': 'MGMT',
    'blurb': 'A true crossover anthem. 12 Hoyas were on the exact same wavelength.'
  },
  'slide3': {
    'big': '2',
    'unit': 'shows',
    'sub': 'You pulled up to the eclectic ones.',
    'events': [
      'Tame Impala Listening Party',
      'MK Deep House Basement'
    ]
  },
  'slide4': {
    'big': '12',
    'unit': 'answer twins',
    'sub': 'You share taste across every crowd.',
    'twins': [
      {
        'i': 'M',
        'g': 'linear-gradient(140deg,#3B82F6,#10B981)'
      },
      {
        'i': 'S',
        'g': 'linear-gradient(140deg,#10B981,#059669)'
      },
      {
        'i': 'C',
        'g': 'linear-gradient(140deg,#60A5FA,#3B82F6)'
      }
    ],
    'twinsPlus': '+9'
  },
  'slide5': {
    'title': 'That\'s your week,\nThe Deep Cut Generalist.',
    'sub': '5 answers · 2 shows · 12 twins. Post it and see who answered like you.'
  }
}

with open('data/canon/home_content.json', 'w') as f:
    json.dump(data, f, indent=2)

print('Marcus wrapped schema updated successfully.')
