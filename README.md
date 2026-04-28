# Mic Drop Karaoke Website

Free static website for GitHub Pages.

## Files

- `index.html` — page content and layout
- `styles.css` — design and responsive styling
- `script.js` — mobile menu and booking email form

## Publish free on GitHub Pages

1. Create a new GitHub repository, for example `mic-drop-karaoke`.
2. Upload `index.html`, `styles.css`, `script.js`, and this `README.md` to the repository root.
3. In GitHub, go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/root`, then click **Save**.
6. GitHub will give you a free URL like `https://yourusername.github.io/mic-drop-karaoke/`.

## Background booking form setup

GitHub Pages is static, so it cannot send email directly from the server. This version is ready to send booking requests in the background through a form endpoint.

Recommended free/easy option: Formspree.

1. Create a Formspree account.
2. Create a new form.
3. Copy the endpoint URL, which usually looks like `https://formspree.io/f/xxxxxxxx`.
4. Open `script.js`.
5. Replace `PASTE_YOUR_FORM_ENDPOINT_HERE` with your real endpoint.
6. Commit and push the files to GitHub.
7. Test the form once and confirm your email if the service asks you to.

Other options: Static Forms, Getform, Basin, or moving the site to Netlify and using Netlify Forms.
