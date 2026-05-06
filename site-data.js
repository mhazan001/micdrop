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
    description: "Join Mic Drop Karaoke for a high-energy night of singing, laughs, and crowd favorites.",
    isPrivate: false
  },
  {
    title: "Karaoke Night at Audacious Aleworks",
    date: "2026-06-12",
    startTime: "20:00",
    endTime: "00:00",
    location: "110 East Fairfax St, Falls Church, VA",
    description: "Come out for karaoke, beach-shack energy, and your next mic drop moment.",
    isPrivate: false
  },
  {
    title: "Karaoke Night at Clare and Don's Beach Shack",
    date: "2026-06-27",
    startTime: "21:00",
    endTime: "00:00",
    location: "130 N Washington St, Falls Church, VA",
    description: "Come out for karaoke, beach-shack energy, and your next mic drop moment.",
    isPrivate: false
  },
  {
    title: "Karaoke Night at Clare and Don's Beach Shack",
    date: "2026-07-18",
    startTime: "21:00",
    endTime: "00:00",
    location: "130 N Washington St, Falls Church, VA",
    description: "Come out for karaoke, beach-shack energy, and your next mic drop moment.",
    isPrivate: false
  }
  
];

const APPROVED_REVIEWS = [
  {
    name: "Sarah Mitchell",
    eventType: "Wedding Reception",
    rating: 5,
    quote: "Mic Drop Karaoke made our reception unforgettable. The energy was amazing and our guests are still talking about it."
  },
  {
    name: "James Chen",
    eventType: "Corporate Event",
    rating: 5,
    quote: "Great equipment, fantastic energy, and the team was incredibly easy to work with. It was the highlight of our event."
  },
  {
    name: "Emma Thompson",
    eventType: "Birthday Party",
    rating: 5,
    quote: "Best decision ever for my birthday. Everyone had a blast, the song selection was great, and the setup was seamless."
  }
];
const SMUGMUG_SLIDESHOW = {
  enabled: true,
  title: "Mic Drop Moments",
  subtitle: "Photos from our karaoke nights, private parties, and community events.",
  embedUrl: "https://www.smugmug.com/frame/slideshow?key=6Fxv6G&speed=3&transition=fade&autoStart=1&captions=0&navigation=0&playButton=0&randomize=0&transitionSpeed=2"
};
