import json

with open("data/canon/home_content.json", "r") as f:
    data = json.load(f)

# Update News
data["news"]["sofia"] = [
    {
        "art": "/assets/artists/ClairoSpotify.jpeg",
        "src": "Tour",
        "when": "1h",
        "head": "Clairo announces new Charm tour dates."
    },
    {
        "art": "/assets/artists/FayeWebsterSpotify.jpeg",
        "src": "Ligo Radar",
        "when": "3h",
        "head": "Faye Webster's Right Side of My Neck is trending."
    },
    {
        "art": "/assets/artists/PhoebeBridgersSpotify.jpeg",
        "src": "Rumor",
        "when": "5h",
        "head": "Phoebe Bridgers spotted recording new material."
    },
    {
        "art": "/assets/artists/beachhousespotifynew.jpeg",
        "src": "Pitchfork",
        "when": "12h",
        "head": "Beach House announces 10-year anniversary vinyl reissue."
    },
    {
        "art": "/assets/artists/SZASpotify.jpeg",
        "src": "Campus chart",
        "when": "1d",
        "head": "SZA's Good Days re-enters the Georgetown top 50."
    }
]

# Update Shows
data["shows"]["sofia"] = [
    {
        "name": "Faye Webster Underdressed Tour",
        "venue": "9:30 Club",
        "when": "Fri 8:00",
        "tag": "$45",
        "tagCls": "orange",
        "art": "/assets/artists/FayeWebsterSpotify.jpeg"
    },
    {
        "name": "Clairo Charm Tour",
        "venue": "The Anthem",
        "when": "Sat 9:00",
        "tag": "$60",
        "tagCls": "orange",
        "art": "/assets/artists/ClairoSpotify.jpeg"
    }
]

# Update Wrapped
data["wrapped"]["sofia"] = {
    "meshClass": "teal-blue-mesh",
    "starsColor": "#14B8A6",
    "sealedText": "Six answers, two shows, fifteen twins, and a playlist for crying on public transit.",
    "theme": {
        "horoscopeIconColor": "#14B8A6",
        "slide2Glow": "radial-gradient(460px 460px at 18% 14%, rgba(20,184,166,0.15), transparent 62%)",
        "slide2Eyebrow": "#3B82F6",
        "slide3Glow": "radial-gradient(460px 460px at 82% 16%, rgba(59,130,246,0.20), transparent 62%)",
        "slide3Eyebrow": "#14B8A6",
        "slide3Borders": [
            "#14B8A6",
            "#3B82F6",
            "#0EA5E9"
        ],
        "slide4Glow": "radial-gradient(460px 460px at 20% 18%, rgba(20,184,166,0.15), transparent 62%)",
        "slide4Eyebrow": "#14B8A6",
        "slide5Glow": "radial-gradient(460px 460px at 50% 18%, rgba(59,130,246,0.15), transparent 62%)"
    },
    "slide1": {
        "title": "The Mood\nCurator",
        "subtitle": "Season of the emotional bridge",
        "text": "Nocturnal, introspective, and soft. Your week jumped from Faye Webster and Clairo into late-night SZA. You didn't necessarily match on the exact same song, but you shared the exact same lane. Reach out before the week resets."
    },
    "slide2": {
        "big": "6",
        "unit": "answers",
        "sub": "A perfect week \u2014 5-day streak, no skips.",
        "cover": "/assets/artists/FayeWebsterSpotify.jpeg",
        "song": "\"Right Side of My Neck\"",
        "artist": "Faye Webster",
        "blurb": "The ultimate indie heartbreak anthem. 15 Hoyas were on the same wavelength."
    },
    "slide3": {
        "big": "2",
        "unit": "shows",
        "sub": "You showed up for the feelings.",
        "events": [
            "Faye Webster at 9:30 Club",
            "Clairo at The Anthem"
        ]
    },
    "slide4": {
        "big": "15",
        "unit": "answer twins",
        "sub": "You shared the exact same lane.",
        "twins": [
            {
                "i": "A",
                "g": "linear-gradient(145deg, #e8c4f0, #8b5cf6)"
            },
            {
                "i": "C",
                "g": "linear-gradient(145deg, #FF6B9D, #C2410C)"
            },
            {
                "i": "C",
                "g": "linear-gradient(145deg, #F5D783, #D97706)"
            }
        ],
        "twinsPlus": "+12"
    },
    "slide5": {
        "title": "That's your week,\nThe Mood Curator.",
        "sub": "6 answers \u00b7 2 shows \u00b7 15 twins. Post it and see who matched your lane."
    }
}

with open("data/canon/home_content.json", "w") as f:
    json.dump(data, f, indent=2)

print("Updated home_content.json with Sofia data")
