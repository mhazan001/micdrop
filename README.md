# Mic Drop Karaoke website

This version restores:

- Pricing packages
- Review submission form
- Approved reviews display
- Upcoming events
- SmugMug slideshow
- Booking form

## Upload these files to the GitHub repo root

- index.html
- styles.css
- script.js
- sitedata.js
- CNAME
- README.md

## Edit events and approved reviews

Edit `sitedata.js`.

Reviews submitted through the website go to the same Formspree endpoint as the booking form, but include:

`form_type = Review Submission`

Only copy approved reviews into `APPROVED_REVIEWS`.
