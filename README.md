# Mic Drop Karaoke website

This verified version includes:

- Events
- SmugMug slideshow
- Pricing packages
- Approved reviews
- Review submission form
- Booking request form
- Formspree integration
- Custom domain CNAME

Upload all files to the GitHub repo root:

- index.html
- styles.css
- script.js
- sitedata.js
- CNAME
- README.md

Do not upload these inside a folder.


## Add to Calendar buttons

Upcoming public events show calendar options:

- Add to Google Calendar
- Apple / Outlook, which downloads an `.ics` calendar file

These buttons are generated from `UPCOMING_EVENTS` in `sitedata.js`.
Private events do not show calendar buttons.


## Reviews behavior

Approved reviews display in a horizontal left-to-right scrolling row.
To add more reviews, edit `APPROVED_REVIEWS` in `sitedata.js`.
The page will not get taller with every review; visitors can swipe/scroll sideways.


## Auto-scrolling reviews

Approved reviews now scroll automatically from left to right.
If there is more than one approved review, the site duplicates the review row to create a seamless loop.

Behavior:
- Auto-scrolls continuously
- Pauses when a visitor hovers, clicks, or touches the reviews
- Visitors can still manually drag/scroll sideways


## Venue logos in Upcoming Events

Public event cards now show venue logos:

- Audacious Aleworks logo (from your uploaded image)
- Clare & Don's Beach Shack logo (cropped from the official site artwork)

Files included:
- audacious-aleworks-logo.jpg
- clare-dons-logo.png


## Review auto-scroll fix

Reviews now use CSS marquee-style auto-scroll instead of relying on browser scroll position.
The scrollbar is hidden, and the animation pauses on hover/focus.
