# Mic Drop Karaoke website repair files

This package intentionally does **not** include `sitedata.js`.

Upload these files to the root of your GitHub repo:

- `index.html`
- `styles.css`
- `script.js`
- `README.md`

Keep your existing `sitedata.js` in the same folder. The site expects `sitedata.js` to define:

- `UPCOMING_EVENTS`
- `APPROVED_REVIEWS`
- `SMUGMUG_SLIDESHOW`

The events section will render future events from `UPCOMING_EVENTS`.
The photos section will render the SmugMug slideshow from `SMUGMUG_SLIDESHOW`.
