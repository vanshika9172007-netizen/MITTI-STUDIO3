# Mitti Studio (YuvaIntern Junior Frontend Developer Internship)

A responsive landing page for a beginner pottery studio, with an interactive
class booking modal. Built with semantic HTML5, mobile-first CSS (Flexbox and
Grid) and vanilla JavaScript. No frameworks, libraries or build step.

## Project overview
- **Week 1:** responsive landing page.
- **Week 2:** accessible, reusable class booking modal (demo only).

## Week 1 features (preserved)
- Sticky header with logo and navigation, responsive at 700px and 900px
- Mobile menu toggle (`aria-expanded`, closes on link click and Escape)
- Header shadow on scroll
- Hero, features, four-week process, email signup and footer sections
- Email signup validation with success and error messages
- Footer year updates automatically
- Skip link, visible focus styles and `prefers-reduced-motion` support

## Week 2 features: booking modal
- Opened by the existing **Book a class** and **Reserve your spot** buttons (no extra buttons added)
- Native `<dialog>` element, styled to match the site
- Fields: class selection, full name, email, seats (1 to 6)
- **Confirm demo booking** button and a close button
- Validation with an error message under each invalid field, a red border,
  `aria-invalid`, focus moved to the first invalid field, and errors cleared as
  soon as a field is corrected
- Success message announced through a live region, clearly stating that nothing is booked
- Closes with the close button, the Escape key, or a click on the backdrop;
  clicking inside the dialog (including its padding) does not close it
- Focus returns to the button that opened the modal
- Background scrolling is locked while the modal is open; the modal itself
  scrolls if the screen is short
- Focus stays inside the modal while it is open

## File structure
```
mitti-landing/
  index.html       page structure and the booking <dialog>
  css/style.css    all styles (Week 2 modal styles are at the end)
  js/main.js       Week 1 features, then the booking modal section
  README.md
```

## Run locally
Open `index.html` in a browser. No installation needed. (Optionally use the
VS Code Live Server extension.)

## Test the booking modal
1. Click **Book a class** in the header, then close the modal.
2. Click **Reserve your spot** in the hero.
3. Close with the **x** button, then with **Esc**, then by clicking the dimmed area outside the dialog.
4. Click on the heading or the empty space inside the dialog: it must stay open.
5. After closing, focus should return to the button you used.
6. On a narrow screen (under 900px), open the menu and use **Book a class**.

## Test form validation
1. Open the modal and press **Confirm demo booking** with empty fields: three error messages appear and focus moves to the class field.
2. Enter spaces only as the name, and `a@b` as the email: both are rejected.
3. Fix a field: its error disappears immediately.
4. Fill all fields with valid data: a green demo-only message appears and the page does not reload.

## Keyboard controls
| Key | Action |
|---|---|
| Tab / Shift+Tab | Move between modal controls (focus stays inside) |
| Enter / Space | Activate buttons |
| Esc | Close the modal |
| Arrow keys | Change the selected option in the dropdowns |

## Browser compatibility and fallback
- Native `<dialog>` is supported in current Chrome, Edge, Firefox and Safari.
- The code checks for `showModal()` and `close()` before using them. If they
  are missing, the dialog is shown with the `open` attribute, styled as a
  fixed centred box with a dimmed backdrop, and Escape, backdrop click and
  focus wrapping are handled by JavaScript.
- If any modal element is missing from the HTML, the modal code stops quietly and the rest of the site keeps working.
- Tested in Chromium only (automated checks, including a simulated browser
  without dialog methods). Firefox and Safari have not been tested.

## Limitations of the demo
- Frontend only: no backend, database, payment or email service.
- Nothing is saved or sent, and the form is cleared after a valid submission.
- The class list is placeholder content and there is no real availability check.
- The fallback does not make the rest of the page inert, so screen reader users
  on very old browsers can still reach content behind the dialog.
