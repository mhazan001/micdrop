# Mic Drop Karaoke website

Upload all files in this package to the root of your GitHub Pages repo.

Root should contain:

- index.html
- styles.css
- script.js
- sitedata.js
- CNAME

## Edit events

Open `sitedata.js` and edit `UPCOMING_EVENTS`.

Use:

- `date: "YYYY-MM-DD"`
- `startTime: "20:00"` for 8 PM
- `endTime: "00:00"` for midnight
- `isPrivate: true` for private booked dates

## Booking form

The booking form is already connected to Formspree:

https://formspree.io/f/xwvaglkv

## Photos

The SmugMug slideshow is hardcoded directly in `index.html` so it does not depend on JavaScript to load.
