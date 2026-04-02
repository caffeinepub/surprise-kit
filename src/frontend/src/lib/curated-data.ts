export interface MemeCard {
  id: string;
  imageUrl: string;
  caption: string;
  mood: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  vibe: string;
  youtubeId?: string;
}

export interface BgMusic {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export const MOODS = [
  "Happy",
  "Cozy",
  "Motivational",
  "Funny",
  "Romantic",
  "Chill",
  "Birthday",
  "Friendship",
  "Gratitude",
] as const;
export type Mood = (typeof MOODS)[number];

export const MEMES: MemeCard[] = [
  // Happy
  {
    id: "h1",
    imageUrl: "https://picsum.photos/seed/sunflower/300/300",
    caption: "When Monday feels like Friday! 🎉",
    mood: "Happy",
  },
  {
    id: "h2",
    imageUrl: "https://picsum.photos/seed/celebration/300/300",
    caption: "Pure joy cannot be contained ✨",
    mood: "Happy",
  },
  {
    id: "h3",
    imageUrl: "https://picsum.photos/seed/smiling/300/300",
    caption: "This is my happy dance face 💃",
    mood: "Happy",
  },
  {
    id: "h4",
    imageUrl: "https://picsum.photos/seed/sunshine/300/300",
    caption: "Spreading sunshine since forever ☀️",
    mood: "Happy",
  },
  {
    id: "h5",
    imageUrl: "https://picsum.photos/seed/rainbow/300/300",
    caption: "Life is literally amazing rn 🌟",
    mood: "Happy",
  },
  {
    id: "h6",
    imageUrl: "https://picsum.photos/seed/balloons/300/300",
    caption: "No thoughts, only good vibes 🌈",
    mood: "Happy",
  },
  {
    id: "h7",
    imageUrl: "https://picsum.photos/seed/confetti/300/300",
    caption: "Happiness level: maximum 🚀",
    mood: "Happy",
  },
  {
    id: "h8",
    imageUrl: "https://picsum.photos/seed/goldenhour/300/300",
    caption: "You deserve all the good things 💛",
    mood: "Happy",
  },
  {
    id: "h9",
    imageUrl: "https://picsum.photos/seed/fireworks/300/300",
    caption: "Today is going to be amazing! 🎊",
    mood: "Happy",
  },
  // Cozy
  {
    id: "c1",
    imageUrl: "https://picsum.photos/seed/teacup/300/300",
    caption: "Blankets, tea, and absolutely nothing to do 🍵",
    mood: "Cozy",
  },
  {
    id: "c2",
    imageUrl: "https://picsum.photos/seed/sleepycat/300/300",
    caption: "My spirit animal is a sleepy cat 🐱",
    mood: "Cozy",
  },
  {
    id: "c3",
    imageUrl: "https://picsum.photos/seed/sofa/300/300",
    caption: "Staying in > going out. Always. 🛋️",
    mood: "Cozy",
  },
  {
    id: "c4",
    imageUrl: "https://picsum.photos/seed/rainywindow/300/300",
    caption: "Rain + blanket = perfect evening 🌧️",
    mood: "Cozy",
  },
  {
    id: "c5",
    imageUrl: "https://picsum.photos/seed/bookshelf/300/300",
    caption: "Hot cocoa and good books 📚",
    mood: "Cozy",
  },
  {
    id: "c6",
    imageUrl: "https://picsum.photos/seed/candle/300/300",
    caption: "This is what peace feels like 🕯️",
    mood: "Cozy",
  },
  {
    id: "c7",
    imageUrl: "https://picsum.photos/seed/morningcoffee/300/300",
    caption: "Slow mornings are underrated ☕",
    mood: "Cozy",
  },
  {
    id: "c8",
    imageUrl: "https://picsum.photos/seed/knitting/300/300",
    caption: "Hygge mode: activated 🧶",
    mood: "Cozy",
  },
  {
    id: "c9",
    imageUrl: "https://picsum.photos/seed/moonpajamas/300/300",
    caption: "Life is better in pajamas 🌙",
    mood: "Cozy",
  },
  // Motivational
  {
    id: "m1",
    imageUrl: "https://picsum.photos/seed/mountain/300/300",
    caption: "You've got this, seriously 💪",
    mood: "Motivational",
  },
  {
    id: "m2",
    imageUrl: "https://picsum.photos/seed/trophy/300/300",
    caption: "Every champion was once a beginner 🏆",
    mood: "Motivational",
  },
  {
    id: "m3",
    imageUrl: "https://picsum.photos/seed/lightning/300/300",
    caption: "Your potential is literally limitless ⚡",
    mood: "Motivational",
  },
  {
    id: "m4",
    imageUrl: "https://picsum.photos/seed/sunrise/300/300",
    caption: "Rise and absolutely crush it 🔥",
    mood: "Motivational",
  },
  {
    id: "m5",
    imageUrl: "https://picsum.photos/seed/plant/300/300",
    caption: "Progress over perfection, always 🌱",
    mood: "Motivational",
  },
  {
    id: "m6",
    imageUrl: "https://picsum.photos/seed/rocket/300/300",
    caption: "The only way is forward 🚀",
    mood: "Motivational",
  },
  {
    id: "m7",
    imageUrl: "https://picsum.photos/seed/stars/300/300",
    caption: "Believe it, achieve it 🌟",
    mood: "Motivational",
  },
  {
    id: "m8",
    imageUrl: "https://picsum.photos/seed/footsteps/300/300",
    caption: "Small steps, big dreams 👣",
    mood: "Motivational",
  },
  {
    id: "m9",
    imageUrl: "https://picsum.photos/seed/openbook/300/300",
    caption: "Your story isn't over yet 📖",
    mood: "Motivational",
  },
  // Funny
  {
    id: "f1",
    imageUrl: "https://picsum.photos/seed/funnydog/300/300",
    caption: "Me pretending to adult 🤣",
    mood: "Funny",
  },
  {
    id: "f2",
    imageUrl: "https://picsum.photos/seed/derp/300/300",
    caption: "Brain: empty. Vibes: immaculate 😂",
    mood: "Funny",
  },
  {
    id: "f3",
    imageUrl: "https://picsum.photos/seed/lateperson/300/300",
    caption: "I'm not late, everyone else is early 😅",
    mood: "Funny",
  },
  {
    id: "f4",
    imageUrl: "https://picsum.photos/seed/confused/300/300",
    caption: "Current mood: questioning all decisions 🤔",
    mood: "Funny",
  },
  {
    id: "f5",
    imageUrl: "https://picsum.photos/seed/babyface/300/300",
    caption: "Accidentally became an adult somehow 👶",
    mood: "Funny",
  },
  {
    id: "f6",
    imageUrl: "https://picsum.photos/seed/upside/300/300",
    caption: "Plot twist: everything is fine 🙃",
    mood: "Funny",
  },
  {
    id: "f7",
    imageUrl: "https://picsum.photos/seed/chaos/300/300",
    caption: "Me explaining my chaos theory 🌀",
    mood: "Funny",
  },
  {
    id: "f8",
    imageUrl: "https://picsum.photos/seed/overthink/300/300",
    caption: "Sleep: rejected. Overthink: accepted 😴",
    mood: "Funny",
  },
  {
    id: "f9",
    imageUrl: "https://picsum.photos/seed/glitch/300/300",
    caption: "Error 404: chill not found 💻",
    mood: "Funny",
  },
  // Romantic
  {
    id: "r1",
    imageUrl: "https://picsum.photos/seed/hearts/300/300",
    caption: "You're my favourite notification 💌",
    mood: "Romantic",
  },
  {
    id: "r2",
    imageUrl: "https://picsum.photos/seed/cozyhome/300/300",
    caption: "Home is wherever you are 🏡",
    mood: "Romantic",
  },
  {
    id: "r3",
    imageUrl: "https://picsum.photos/seed/rosegold/300/300",
    caption: "Every love story is beautiful 💕",
    mood: "Romantic",
  },
  {
    id: "r4",
    imageUrl: "https://picsum.photos/seed/pinklove/300/300",
    caption: "My heart chose you 💗",
    mood: "Romantic",
  },
  {
    id: "r5",
    imageUrl: "https://picsum.photos/seed/adventure/300/300",
    caption: "Adventure is better with you 🗺️",
    mood: "Romantic",
  },
  {
    id: "r6",
    imageUrl: "https://picsum.photos/seed/magical/300/300",
    caption: "You make ordinary extraordinary ✨",
    mood: "Romantic",
  },
  {
    id: "r7",
    imageUrl: "https://picsum.photos/seed/diamond/300/300",
    caption: "Forever and then some 💍",
    mood: "Romantic",
  },
  {
    id: "r8",
    imageUrl: "https://picsum.photos/seed/garden/300/300",
    caption: "Together is my favourite place 🌺",
    mood: "Romantic",
  },
  {
    id: "r9",
    imageUrl: "https://picsum.photos/seed/firstmeet/300/300",
    caption: "You had me at hello 🥰",
    mood: "Romantic",
  },
  // Chill
  {
    id: "ch1",
    imageUrl: "https://picsum.photos/seed/beachvibe/300/300",
    caption: "Zero stress, maximum vibe 🎵",
    mood: "Chill",
  },
  {
    id: "ch2",
    imageUrl: "https://picsum.photos/seed/river/300/300",
    caption: "Going with the flow today 🌊",
    mood: "Chill",
  },
  {
    id: "ch3",
    imageUrl: "https://picsum.photos/seed/zen/300/300",
    caption: "No rush, no worries, just peace ✌️",
    mood: "Chill",
  },
  {
    id: "ch4",
    imageUrl: "https://picsum.photos/seed/sundaymorning/300/300",
    caption: "Easy like a Sunday morning 🌤️",
    mood: "Chill",
  },
  {
    id: "ch5",
    imageUrl: "https://picsum.photos/seed/hammock/300/300",
    caption: "Somewhere between zen and napping 😌",
    mood: "Chill",
  },
  {
    id: "ch6",
    imageUrl: "https://picsum.photos/seed/lotusvibe/300/300",
    caption: "Unbothered. Moisturised. Thriving. 🌿",
    mood: "Chill",
  },
  {
    id: "ch7",
    imageUrl: "https://picsum.photos/seed/leaves/300/300",
    caption: "Just existing peacefully 🍃",
    mood: "Chill",
  },
  {
    id: "ch8",
    imageUrl: "https://picsum.photos/seed/artsy/300/300",
    caption: "The art of doing nothing 🎨",
    mood: "Chill",
  },
  {
    id: "ch9",
    imageUrl: "https://picsum.photos/seed/headphones/300/300",
    caption: "Good music, good mood 🎶",
    mood: "Chill",
  },
  // Birthday
  {
    id: "bd1",
    imageUrl: "https://picsum.photos/seed/birthdaycake/300/300",
    caption: "Happy Birthday legend! 🎂",
    mood: "Birthday",
  },
  {
    id: "bd2",
    imageUrl: "https://picsum.photos/seed/partyhat/300/300",
    caption: "It's your day, slay it! 🎉",
    mood: "Birthday",
  },
  {
    id: "bd3",
    imageUrl: "https://picsum.photos/seed/giftwrap/300/300",
    caption: "Another year of being awesome 🎁",
    mood: "Birthday",
  },
  {
    id: "bd4",
    imageUrl: "https://picsum.photos/seed/sprinkles/300/300",
    caption: "Age is just a number, your vibe is eternal ✨",
    mood: "Birthday",
  },
  {
    id: "bd5",
    imageUrl: "https://picsum.photos/seed/sparkcandle/300/300",
    caption: "Make a wish, then hustle! 🕯️",
    mood: "Birthday",
  },
  {
    id: "bd6",
    imageUrl: "https://picsum.photos/seed/birthdayballoon/300/300",
    caption: "Today = your personal holiday 🎊",
    mood: "Birthday",
  },
  // Friendship
  {
    id: "fr1",
    imageUrl: "https://picsum.photos/seed/bestfriends/300/300",
    caption: "Friends who vibe together, stay together 🤝",
    mood: "Friendship",
  },
  {
    id: "fr2",
    imageUrl: "https://picsum.photos/seed/laughfriends/300/300",
    caption: "You're stuck with me forever 😂",
    mood: "Friendship",
  },
  {
    id: "fr3",
    imageUrl: "https://picsum.photos/seed/roadtrip/300/300",
    caption: "Adventures are better with you 🚗",
    mood: "Friendship",
  },
  {
    id: "fr4",
    imageUrl: "https://picsum.photos/seed/friendhug/300/300",
    caption: "Real friends tell you the truth 💯",
    mood: "Friendship",
  },
  {
    id: "fr5",
    imageUrl: "https://picsum.photos/seed/pinky/300/300",
    caption: "No matter what, I got you 💪",
    mood: "Friendship",
  },
  {
    id: "fr6",
    imageUrl: "https://picsum.photos/seed/duo/300/300",
    caption: "We are the main characters 🌟",
    mood: "Friendship",
  },
  // Gratitude
  {
    id: "gt1",
    imageUrl: "https://picsum.photos/seed/thankful/300/300",
    caption: "Grateful for every moment 🙏",
    mood: "Gratitude",
  },
  {
    id: "gt2",
    imageUrl: "https://picsum.photos/seed/blessedsun/300/300",
    caption: "Life is beautiful when you notice 🌸",
    mood: "Gratitude",
  },
  {
    id: "gt3",
    imageUrl: "https://picsum.photos/seed/kindness/300/300",
    caption: "Thank you for being you 💛",
    mood: "Gratitude",
  },
  {
    id: "gt4",
    imageUrl: "https://picsum.photos/seed/overflow/300/300",
    caption: "Overflowing with gratitude today 🌊",
    mood: "Gratitude",
  },
  {
    id: "gt5",
    imageUrl: "https://picsum.photos/seed/appreciation/300/300",
    caption: "Small things, big meaning 🍀",
    mood: "Gratitude",
  },
  {
    id: "gt6",
    imageUrl: "https://picsum.photos/seed/thanksgift/300/300",
    caption: "Blessed to have you in my life ✨",
    mood: "Gratitude",
  },
];

export const VIBES = [
  "Upbeat",
  "Chill",
  "Romantic",
  "Motivational",
  "Nostalgic",
  "Bollywood",
  "Hollywood",
] as const;
export type Vibe = (typeof VIBES)[number];

export const SONGS: Song[] = [
  // Upbeat
  {
    id: "s1",
    title: "Golden Hour",
    artist: "Aurora Waves",
    duration: "3:42",
    vibe: "Upbeat",
  },
  {
    id: "s2",
    title: "Dancing in the Light",
    artist: "The Sunsets",
    duration: "3:15",
    vibe: "Upbeat",
  },
  {
    id: "s3",
    title: "Jump Around (Again)",
    artist: "Nova Spark",
    duration: "2:58",
    vibe: "Upbeat",
  },
  {
    id: "s4",
    title: "Electric Morning",
    artist: "Bright Fields",
    duration: "3:33",
    vibe: "Upbeat",
  },
  {
    id: "s5",
    title: "Feel Alive",
    artist: "Cleo & The Band",
    duration: "4:02",
    vibe: "Upbeat",
  },
  {
    id: "s6",
    title: "Rhythm of Us",
    artist: "Mira del Sol",
    duration: "3:20",
    vibe: "Upbeat",
  },
  // Chill
  {
    id: "ch1",
    title: "Slow Afternoon",
    artist: "Hazy Blue",
    duration: "4:18",
    vibe: "Chill",
  },
  {
    id: "ch2",
    title: "Rainy Window",
    artist: "Elara Moon",
    duration: "5:01",
    vibe: "Chill",
  },
  {
    id: "ch3",
    title: "Sunday Nap",
    artist: "The Drifters",
    duration: "3:47",
    vibe: "Chill",
  },
  {
    id: "ch4",
    title: "Lo-Fi Garden",
    artist: "Petal Sounds",
    duration: "4:30",
    vibe: "Chill",
  },
  {
    id: "ch5",
    title: "Midnight Tea",
    artist: "Solstice Ave",
    duration: "3:55",
    vibe: "Chill",
  },
  {
    id: "ch6",
    title: "Quiet Thoughts",
    artist: "Lumen Soft",
    duration: "4:12",
    vibe: "Chill",
  },
  // Romantic
  {
    id: "rs1",
    title: "Stars Above Us",
    artist: "Celeste & Marco",
    duration: "4:05",
    vibe: "Romantic",
  },
  {
    id: "rs2",
    title: "Your Hand in Mine",
    artist: "Ivory Keys",
    duration: "3:38",
    vibe: "Romantic",
  },
  {
    id: "rs3",
    title: "Moonlit Dance",
    artist: "The Velvet Room",
    duration: "4:52",
    vibe: "Romantic",
  },
  {
    id: "rs4",
    title: "Forever Yours",
    artist: "Ophelia & James",
    duration: "3:25",
    vibe: "Romantic",
  },
  {
    id: "rs5",
    title: "Pink Clouds",
    artist: "Rose & Thorn",
    duration: "3:59",
    vibe: "Romantic",
  },
  {
    id: "rs6",
    title: "Tender",
    artist: "Lila Marsh",
    duration: "4:20",
    vibe: "Romantic",
  },
  // Motivational
  {
    id: "mv1",
    title: "Rise Up Now",
    artist: "Phoenix Crew",
    duration: "3:10",
    vibe: "Motivational",
  },
  {
    id: "mv2",
    title: "Champion Road",
    artist: "Steel & Fire",
    duration: "3:45",
    vibe: "Motivational",
  },
  {
    id: "mv3",
    title: "Break Through",
    artist: "Aria Strong",
    duration: "2:55",
    vibe: "Motivational",
  },
  {
    id: "mv4",
    title: "Limitless",
    artist: "The Bold",
    duration: "4:08",
    vibe: "Motivational",
  },
  {
    id: "mv5",
    title: "Push Forward",
    artist: "Volt & Echo",
    duration: "3:30",
    vibe: "Motivational",
  },
  {
    id: "mv6",
    title: "Never Give Up",
    artist: "Mountain High",
    duration: "3:50",
    vibe: "Motivational",
  },
  // Nostalgic
  {
    id: "ns1",
    title: "Summer of 99",
    artist: "The Cardigan Trio",
    duration: "4:22",
    vibe: "Nostalgic",
  },
  {
    id: "ns2",
    title: "Old Photographs",
    artist: "June & July",
    duration: "3:48",
    vibe: "Nostalgic",
  },
  {
    id: "ns3",
    title: "Remember When",
    artist: "Cassette Dreams",
    duration: "4:35",
    vibe: "Nostalgic",
  },
  {
    id: "ns4",
    title: "Childhood Home",
    artist: "The Attic Band",
    duration: "5:10",
    vibe: "Nostalgic",
  },
  {
    id: "ns5",
    title: "Long Drive Home",
    artist: "Wayback Radio",
    duration: "4:00",
    vibe: "Nostalgic",
  },
  {
    id: "ns6",
    title: "Those Were Days",
    artist: "Ember & Ash",
    duration: "3:42",
    vibe: "Nostalgic",
  },
  // Bollywood
  {
    id: "b1",
    title: "Kesariya",
    artist: "Arijit Singh",
    duration: "4:34",
    vibe: "Bollywood",
    youtubeId: "BddP6PYo2gs",
  },
  {
    id: "b2",
    title: "Tum Hi Ho",
    artist: "Arijit Singh",
    duration: "4:22",
    vibe: "Bollywood",
    youtubeId: "IJq0yyWug1k",
  },
  {
    id: "b3",
    title: "Raataan Lambiyan",
    artist: "Jubin Nautiyal",
    duration: "3:53",
    vibe: "Bollywood",
    youtubeId: "l1GNIY7-3To",
  },
  {
    id: "b4",
    title: "Tera Ban Jaunga",
    artist: "Akhil Sachdeva",
    duration: "4:05",
    vibe: "Bollywood",
    youtubeId: "jWZNKmFsxEU",
  },
  {
    id: "b5",
    title: "Ae Dil Hai Mushkil",
    artist: "Arijit Singh",
    duration: "4:45",
    vibe: "Bollywood",
    youtubeId: "6FURuLYrR_Q",
  },
  {
    id: "b6",
    title: "Channa Mereya",
    artist: "Arijit Singh",
    duration: "4:49",
    vibe: "Bollywood",
    youtubeId: "zbedunmusa0",
  },
  {
    id: "b7",
    title: "Bekhayali",
    artist: "Sachet Tandon",
    duration: "5:27",
    vibe: "Bollywood",
    youtubeId: "PoHDf0zXbUo",
  },
  {
    id: "b8",
    title: "Hawayein",
    artist: "Arijit Singh",
    duration: "4:24",
    vibe: "Bollywood",
    youtubeId: "cGBBFVLAKgM",
  },
  {
    id: "b9",
    title: "Kal Ho Naa Ho",
    artist: "Sonu Nigam",
    duration: "5:42",
    vibe: "Bollywood",
    youtubeId: "AlEhTDJUFyE",
  },
  // Hollywood / Pop
  {
    id: "hw1",
    title: "Perfect",
    artist: "Ed Sheeran",
    duration: "4:23",
    vibe: "Hollywood",
    youtubeId: "2Vv-BfVoq4g",
  },
  {
    id: "hw2",
    title: "Shape of You",
    artist: "Ed Sheeran",
    duration: "3:54",
    vibe: "Hollywood",
    youtubeId: "JGwWNGJdvx8",
  },
  {
    id: "hw3",
    title: "Blinding Lights",
    artist: "The Weeknd",
    duration: "3:20",
    vibe: "Hollywood",
    youtubeId: "4NRXx6U8ABQ",
  },
  {
    id: "hw4",
    title: "Stay",
    artist: "Justin Bieber ft. The Kid LAROI",
    duration: "2:21",
    vibe: "Hollywood",
    youtubeId: "kTJczUoc26U",
  },
  {
    id: "hw5",
    title: "Levitating",
    artist: "Dua Lipa",
    duration: "3:23",
    vibe: "Hollywood",
    youtubeId: "TUVcZfQe-Kw",
  },
  {
    id: "hw6",
    title: "As It Was",
    artist: "Harry Styles",
    duration: "2:37",
    vibe: "Hollywood",
    youtubeId: "H5v3kku4y6Q",
  },
  {
    id: "hw7",
    title: "Anti-Hero",
    artist: "Taylor Swift",
    duration: "3:20",
    vibe: "Hollywood",
    youtubeId: "b1kbLwvqugk",
  },
  {
    id: "hw8",
    title: "Flowers",
    artist: "Miley Cyrus",
    duration: "3:20",
    vibe: "Hollywood",
    youtubeId: "G7KNmW9a75Y",
  },
  {
    id: "hw9",
    title: "Unholy",
    artist: "Sam Smith",
    duration: "2:37",
    vibe: "Hollywood",
    youtubeId: "Uq9gPaIzbe8",
  },
];

export const BG_MUSIC: BgMusic[] = [
  {
    id: "rain",
    name: "Gentle Rain",
    emoji: "🌧️",
    description: "Soft pitter-patter on a cozy window",
  },
  {
    id: "lofi",
    name: "Lo-Fi Beats",
    emoji: "🎵",
    description: "Warm lo-fi hip hop for focus and calm",
  },
  {
    id: "forest",
    name: "Forest Birds",
    emoji: "🌳",
    description: "Morning birds in a lush green forest",
  },
  {
    id: "ocean",
    name: "Ocean Waves",
    emoji: "🌊",
    description: "Rhythmic waves on a peaceful shore",
  },
  {
    id: "cafe",
    name: "Café Ambience",
    emoji: "☕",
    description: "Background chatter and espresso warmth",
  },
  {
    id: "piano",
    name: "Piano Lullaby",
    emoji: "🎹",
    description: "Gentle piano notes to soothe the soul",
  },
  {
    id: "wind",
    name: "Summer Wind",
    emoji: "🍃",
    description: "Warm breeze through sun-drenched fields",
  },
  {
    id: "fire",
    name: "Crackling Fire",
    emoji: "🔥",
    description: "Cozy fireplace on a winter evening",
  },
];

export const PRESET_CHALLENGES = [
  {
    id: "breathe",
    type: "breathe",
    prompt: "Take a deep breath and hold it for 5 seconds...",
    rewardMessage: "Feel that? That's the power of pause. You're amazing! 🌬️",
  },
  {
    id: "smile",
    type: "smile",
    prompt: "Give your biggest, brightest smile for 3 seconds!",
    rewardMessage: "That smile just made the world brighter! 😊",
  },
  {
    id: "shake",
    type: "shake",
    prompt: "Shake your phone (or click the button) to reveal a surprise!",
    rewardMessage: "You shook it and got a surprise! You're unstoppable! 🎉",
  },
  {
    id: "memory",
    type: "memory",
    prompt: "Close your eyes and think of a happy memory for 5 seconds.",
    rewardMessage: "That memory is yours forever. Cherish it! 💭",
  },
  {
    id: "dance",
    type: "dance",
    prompt: "Do your best happy dance for 5 seconds!",
    rewardMessage: "That's the most joyful dance I've ever seen! 🕺",
  },
  {
    id: "blessings",
    type: "blessings",
    prompt: "Think of 3 things you're grateful for right now.",
    rewardMessage: "Gratitude is a superpower. You're blessed! 🙏",
  },
];

export const SCRAMBLE_WORDS = [
  { word: "SUNSHINE", hint: "What makes your day bright ☀️" },
  { word: "ADVENTURE", hint: "Life is one big..." },
  { word: "KINDNESS", hint: "Always choose this 💛" },
  { word: "LAUGHTER", hint: "Best medicine 😂" },
  { word: "GRATEFUL", hint: "How you should feel right now" },
  { word: "WONDER", hint: "Feel this every day ✨" },
  { word: "COURAGE", hint: "You have this in abundance" },
  { word: "SPARKLE", hint: "Your inner light ✨" },
  { word: "HARMONY", hint: "When everything aligns" },
  { word: "RADIANT", hint: "That's so you 🌟" },
];
