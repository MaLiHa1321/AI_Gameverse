export const fakeNPCs = [
  {
    id: '1',
    name: 'Eldrin the Wise',
    title: 'Ancient Wizard',
    avatar: '🧙',
    personality: 'Wise and mysterious, knows ancient secrets',
    backstory: 'A 500-year-old wizard who has seen civilizations rise and fall',
    location: 'Mystic Tower',
    mood: 'contemplative',
    level: 5,
    relationship: 75
  },
  {
    id: '2',
    name: 'Seraphina',
    title: 'Forest Guardian',
    avatar: '🌿',
    personality: 'Playful and protective of nature',
    backstory: 'A spirit bound to the ancient forest, she communicates with all living things',
    location: 'Whispering Woods',
    mood: 'curious',
    level: 3,
    relationship: 60
  },
  {
    id: '3',
    name: 'Grommash',
    title: 'Mountain Blacksmith',
    avatar: '⚒️',
    personality: 'Grumpy but kind-hearted',
    backstory: 'Former warrior who now forges legendary weapons',
    location: 'Iron Peak Forge',
    mood: 'focused',
    level: 4,
    relationship: 45
  }
]

export const fakeConversations = {
  '1': [
    { id: 1, type: 'npc', message: 'Greetings, traveler. I sense great potential in you.', timestamp: new Date() },
    { id: 2, type: 'player', message: 'Thank you, wise one. What secrets does this land hold?', timestamp: new Date() },
    { id: 3, type: 'npc', message: 'Many have sought answers here. Tell me, what is your heart\'s desire?', timestamp: new Date() }
  ],
  '2': [
    { id: 1, type: 'npc', message: 'The trees whisper of your arrival. Do you hear them too?', timestamp: new Date() },
    { id: 2, type: 'player', message: 'I wish I could understand their language.', timestamp: new Date() }
  ],
  '3': [
    { id: 1, type: 'npc', message: 'Hmph. Another adventurer. What do you want?', timestamp: new Date() },
    { id: 2, type: 'player', message: 'I heard you make the finest weapons in the realm.', timestamp: new Date() }
  ]
}