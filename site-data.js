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
    date: "2026-06-05",
    startTime: "20:00",
    endTime: "00:00",
    location: "Audacious Aleworks",
    description: "Join Mic Drop Karaoke for a high-energy night of singing, laughs, and crowd favorites.",
    isPrivate: false
  },
  {
    title: "Karaoke Night at Clare and Don’s",
    date: "2026-06-12",
    startTime: "21:00",
    endTime: "00:00",
    location: "Clare and Don’s Beach Shack",
    description: "Come out for karaoke, beach-shack energy, and your next mic drop moment.",
    isPrivate: false
  },
  {
    title: "Booked — Private Event",
    date: "2026-06-20",
    startTime: "",
    endTime: "",
    location: "Private Event",
    description: "Mic Drop Karaoke is booked for a private event.",
    isPrivate: true
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
