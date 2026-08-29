export const COPY = {
  friendsNotDating: (school: string) => `This is for friends and clubs at ${school}. Not dating.`,
  welcomeKicker: 'Friends and clubs. Not a personality test.',
  welcomeBody:
    "You'll answer a few real nights — not an About Me. About 5–7 minutes. Eight is the cap. We don't write it for you.",
  welcomeCta: 'Start the interview',
  tapsLead: "Two quick ones so we don’t match you with a Tuesday that doesn’t exist.",
  tapsHelper: 'Not a personality test. Just how you actually spend a free night.',
  slackLabel: 'Nights with slack this month',
  energyLabel: 'Default energy',
  examplesCaption: "Specific beats witty. You’re not writing a dating bio.",
  belongingQ: 'Tell me about a time you thought these are my people. What was happening in the room?',
  belongingHelper:
    "A real night or afternoon beats ‘I’m a good friend.’ Names of places are great. Don’t name people if you don’t want to.",
  photoAlt: 'Or pick a photo from this week and tell the story',
  photoNeedCaption: 'A photo without the story is just a photo. What was happening?',
  thursdayQ:
    'Walk me through last Thursday, from your last class until you actually relaxed. Who was around? When did you want people, and when did you want out?',
  thursdayHelper: "If Thursday was nothing, pick the last night that wasn’t. ‘Went home and slept’ is a real answer.",
  clubFitQ:
    'If I dropped you into a meeting tonight, what would make you stay past 15 minutes? What would make you leave?',
  friendshipQ:
    'Realistic this semester: a weekly person, someone from class, or once a month? Tell me the last time a friendship actually fit your week.',
  memberHeader: "This is what we’d match on. Fix anything that’s wrong. Delete anything you don’t want used.",
  memberPrivacy: (school: string) =>
    `Other students will not see this whole interview. They’ll see a short card you approve next. We use the interview to match you with people and clubs at ${school}.`,
  publicCardLabel: 'Your public card — 1–2 sentences',
  publicCardHint: 'Default is your first two concrete lines. Rewrite in your words if you want. We won’t pretty it up.',
  unlockLead: 'Here’s a first pass. 3 people, 3 clubs. It gets less random as you get more specific.',
  firstPass: 'FIRST PASS',
  looksRight: 'Looks right',
  edit: 'Edit',
  continue: 'Continue',
  timeEarly: 'About 5–7 minutes',
  timeWindow: "You're in the window — finish the thought.",
  timeNearCap: "That's enough for a first pass — finish this answer when you're ready.",
  timeCap: "Eight minutes is the cap. Wrap this one and we'll use what you have.",
} as const;

export const EXAMPLE_PROFILES = [
  {
    label: 'Card A — small-group maker',
    body: 'Last Thursday I left studio at 8, ate a burrito on the floor of the sculpture room, and ended up helping someone weld a joint until 11. I did not talk to a single new person at the involvement fair. I would stay past 15 minutes at a club that makes a thing and starts on time. I would leave a mixer.',
  },
  {
    label: 'Card B — sports-adjacent, low planning',
    body: "I play pickup soccer behind the rec whenever there’s enough people. I don’t join group chats that plan three days out. A friendship that fits my week is sitting next to someone in lecture and then walking to the dining hall. I almost joined club soccer, stayed 10 minutes, and left because it was a 90-minute commitment with a roster.",
  },
  {
    label: 'Card C — quiet commuter',
    body: 'I’m a commuter. Most Thursdays I drive home after my 3:30. The one time I thought “these are my people” was a Sunday board-game night in a suite I was only in because my cousin lives there. I want a club that still works if I miss a week. I do not want a retreat, a pledge process, or a 9pm social.',
  },
] as const;
