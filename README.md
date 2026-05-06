# Mic Drop Karaoke Website
#rerunfailedjob
Static GitHub Pages website for Mic Drop Karaoke.

## Files

- `index.html` — main website page
- `styles.css` — visual styling
- `script.js` — form sending, event rendering, and review rendering
- `site-data.js` — the simple edit file for upcoming events and approved reviews

## Booking form and review form

Both forms submit to Formspree using this endpoint in `script.js`:

```js
const FORM_ENDPOINT = "https://formspree.io/f/xwvaglkv";
```

The booking form sends booking requests.
The review form sends new reviews to you first. Reviews are **not automatically published** to the public website. This protects you from spam or bad reviews.

## How to add an upcoming event

Open `site-data.js` and add a new event inside `UPCOMING_EVENTS`.

Example:

```js
{
  title: "Karaoke Night at Audacious Aleworks",
  date: "2026-07-10",
  startTime: "20:00",
  endTime: "00:00",
  location: "Audacious Aleworks",
  description: "Join Mic Drop Karaoke for a high-energy night of singing and laughs.",
  isPrivate: false
}
```

Use date format `YYYY-MM-DD`.
Use 24-hour time: `20:00` means 8:00 PM and `00:00` means 12:00 AM.

Only future events appear on the website. Past events automatically disappear from the list.

## How to add a booked/private date

Use a public-safe title and no private customer info.

```js
{
  title: "Booked — Private Event",
  date: "2026-07-18",
  startTime: "",
  endTime: "",
  location: "Private Event",
  description: "Mic Drop Karaoke is booked for a private event.",
  isPrivate: true
}
```

Do not put customer names, private addresses, phone numbers, or payment details in `site-data.js`.

## How to approve and publish a review

When a review comes in through Formspree, copy the approved text into `APPROVED_REVIEWS` in `site-data.js`.

Example:

```js
{
  name: "Jane D.",
  eventType: "Birthday Party",
  rating: 5,
  quote: "Mic Drop Karaoke made the night unforgettable. Everyone had a blast."
}
```

## How to remove a review

Open `site-data.js` and delete that review block from `APPROVED_REVIEWS`.

## Deploy to GitHub Pages

Upload these files to the root of your GitHub repo:

- `index.html`
- `styles.css`
- `script.js`
- `site-data.js`
- `README.md`

Then go to:

GitHub repo → Settings → Pages → Deploy from branch → `main` / root

Your custom domain should remain:

```text
mic-drop-events.com
```
