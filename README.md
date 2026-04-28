# Drop the Mic Karaoke Website

Free static website for GitHub Pages.

## Files

- `index.html` — page content and layout
- `styles.css` — design and responsive styling
- `script.js` — mobile menu and booking email form

## Before publishing

Open `script.js` and replace:

```js
const BOOKING_EMAIL = "your-email@example.com";
```

with the email address that should receive booking requests.

## Publish free on GitHub Pages

1. Create a new GitHub repository, for example `drop-the-mic-karaoke`.
2. Upload `index.html`, `styles.css`, `script.js`, and this `README.md` to the repository root.
3. In GitHub, go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/root`, then click **Save**.
6. GitHub will give you a free URL like:
   `https://yourusername.github.io/drop-the-mic-karaoke/`

## Optional: Use a real form service instead of mailto

GitHub Pages cannot process forms by itself. The current form opens the visitor's email app. For a more professional form that submits silently, connect the form to a service like Formspree, Basin, Netlify Forms, or Google Forms.
