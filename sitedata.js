/*
  Mic Drop Karaoke website content file
  -----------------------------------
  This is the main place to add/remove upcoming events and approved reviews.
  You can edit this file directly in GitHub.

  EVENT DATE FORMAT:
  - Use YYYY-MM-DD for date-only events.
  - Use 24-hour time for startTime/endTime, like "20:00" for 8:00 PM.
  - Set isPrivate: true for booked/private dates you want visible without details.

  REVIEW RULE:
  - Reviews submitted through the website are sent to Formspree first.
  - Only add reviews here after you approve them.
  - To remove a review, delete its block from APPROVED_REVIEWS.
*/

const UPCOMING_EVENTS = [
  {
    title: "Karaoke Night at Audacious Aleworks",
    date: "2026-05-15",
    startTime: "20:00",
    endTime: "00:00",
    location: "110 East Fairfax St, Falls Church, VA",
    venueUrl: "https://www.audaciousaleworks.com/",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=110%20East%20Fairfax%20St%2C%20Falls%20Church%2C%20VA",
    description: "Join Mic Drop Karaoke for a high-energy night of singing, laughs, and crowd favorites.",
    isPrivate: false
  },
  {
    title: "Karaoke Night at Audacious Aleworks",
    date: "2026-06-12",
    startTime: "20:00",
    endTime: "00:00",
    location: "110 East Fairfax St, Falls Church, VA",
    venueUrl: "https://www.audaciousaleworks.com/",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=110%20East%20Fairfax%20St%2C%20Falls%20Church%2C%20VA",
    description: "Join Mic Drop Karaoke for a high-energy night of singing, laughs, and crowd favorites.",
    isPrivate: false
  },
  {
    title: "Karaoke Night at Clare and Don's Beach Shack",
    date: "2026-06-27",
    startTime: "21:00",
    endTime: "00:00",
    location: "130 N Washington St, Falls Church, VA",
    venueUrl: "https://clareanddons.com/",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=130%20N%20Washington%20St%2C%20Falls%20Church%2C%20VA",
    description: "Come out for karaoke, beach-shack energy, and your next mic drop moment.",
    isPrivate: false
  },
  {
    title: "Karaoke Night at Clare and Don's Beach Shack",
    date: "2026-07-18",
    startTime: "21:00",
    endTime: "00:00",
    location: "130 N Washington St, Falls Church, VA",
    venueUrl: "https://clareanddons.com/",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=130%20N%20Washington%20St%2C%20Falls%20Church%2C%20VA",
    description: "Come out for karaoke, beach-shack energy, and your next mic drop moment.",
    isPrivate: false
  }
];

const APPROVED_REVIEWS = [
  {
    name: "Samantha Chen",
    eventType: "Audacious Event",
    rating: 5,
    quote: "Mark and Mike are simply amazing emcees.  My favorite part is when Mark walks around with a microphone and gets even shy people to sing"
  }
];

const KARAFUN_SONG_SUGGESTIONS = [
  { title: "Sweet Caroline", artist: "Neil Diamond", low: 47, high: 64, vibe: "Crowd classic" },
  { title: "Don't Stop Believin'", artist: "Journey", low: 52, high: 69, vibe: "Big singalong" },
  { title: "Valerie", artist: "Amy Winehouse", low: 55, high: 70, vibe: "Soul pop" },
  { title: "Mr. Brightside", artist: "The Killers", low: 57, high: 70, vibe: "Party rock" },
  { title: "Wonderwall", artist: "Oasis", low: 52, high: 67, vibe: "Easygoing" },
  { title: "Tennessee Whiskey", artist: "Chris Stapleton", low: 47, high: 66, vibe: "Country soul" },
  { title: "Jolene", artist: "Dolly Parton", low: 54, high: 69, vibe: "Country classic" },
  { title: "Love Story", artist: "Taylor Swift", low: 55, high: 71, vibe: "Pop country" },
  { title: "I Wanna Dance with Somebody", artist: "Whitney Houston", low: 58, high: 75, vibe: "Dance floor" },
  { title: "Dancing Queen", artist: "ABBA", low: 56, high: 73, vibe: "Disco pop" },
  { title: "Girls Just Want to Have Fun", artist: "Cyndi Lauper", low: 57, high: 74, vibe: "Retro pop" },
  { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", low: 54, high: 72, vibe: "Funk party" },
  { title: "Creep", artist: "Radiohead", low: 48, high: 67, vibe: "Alt rock" },
  { title: "Shallow", artist: "Lady Gaga & Bradley Cooper", low: 50, high: 74, vibe: "Duet drama" },
  { title: "Let It Go", artist: "Idina Menzel", low: 56, high: 77, vibe: "Power ballad" },
  { title: "Before He Cheats", artist: "Carrie Underwood", low: 55, high: 73, vibe: "Country rock" },
  { title: "I'm Yours", artist: "Jason Mraz", low: 50, high: 67, vibe: "Warmup friendly" },
  { title: "Someone Like You", artist: "Adele", low: 52, high: 72, vibe: "Piano ballad" }
];

const SMUGMUG_SLIDESHOW = {
  enabled: true,
  title: "Mic Drop Moments",
  subtitle: "Photos from our karaoke nights, private parties, and community events.",
  embedUrl: "https://www.smugmug.com/frame/slideshow?key=6Fxv6G&speed=3&transition=fade&autoStart=1&captions=0&navigation=0&playButton=0&randomize=0&transitionSpeed=2"
};
