# xclaqz — developer portfolio

A complete responsive, dark-gray static website for GitHub Pages. No build step, account tokens, or framework dependencies are required.

## Publish on GitHub Pages

1. Create a public GitHub repository. For a root website, name it `YOUR-GITHUB-USERNAME.github.io`. A repository named `portfolio` works too.
2. Upload `index.html`, `styles.css`, `app.js`, `data.js`, and the entire `assets` folder to the repository root. Do not upload the outer `xclaqz-portfolio` folder as a nested directory.
3. Open **Settings → Pages → Build and deployment**. Choose **Deploy from a branch**, the `main` branch, and `/ (root)`, then save.
4. Wait for GitHub to show the published URL. Relative asset paths support both root and project websites.

No GitHub username was supplied, so the site does not guess a GitHub profile link or pretend to be published. A local copy can be opened by double-clicking `index.html`; publishing is required for the contact form.

## Activate automatic email delivery

The form is configured for **samuelljenkins01@gmail.com**, using FormSubmit. No Discord webhook is exposed in this website.

1. After publishing, submit one test inquiry yourself.
2. Open FormSubmit’s confirmation email in that inbox and activate the form. Check spam if needed.
3. Submit a second test and confirm that it arrives. Until activation and a successful test, delivery should not be considered verified.

The hosted FormSubmit verification/confirmation page handles submission status. CAPTCHA stays enabled, and a honeypot is included. Visitors are told that their contact details are processed by FormSubmit. No test email was sent during development. Direct email and Discord contact remain available.

References: https://formsubmit.co/ and https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

For direct Discord delivery later, use a server-side endpoint with a private webhook, input validation, rate limiting, and bot protection. Never place a Discord webhook in HTML, client-side JavaScript, or a public GitHub repository. A Discord username alone cannot receive automated form messages.

## Included interactions

- Brief first-visit intro (session-based), with a CSS fallback that does not block the page.
- Subtle pointer glow and click ripples on mouse devices; normal system cursor remains usable.
- Typed, highlighted source excerpts from both supplied Roblox places.
- Project dialogs with keyboard-accessible tabs, Escape close, and focus return.
- Anticheat speed-check simulator and movement jump-arc simulator.
- Minimal scroll reveals and a reduced-motion mode.
- Responsive navigation, form, project cards, and experience rows.
- Copy Discord username and direct Roblox/email links.

## Content and provenance

The original `.rbxl` files are NOT publicly bundled or offered for download. Only selected source excerpts requested for previews are included. They were extracted from the supplied files without changing them. No Roblox Studio runtime was available, so no gameplay or production readiness is claimed.

- `AnticheatPlace.rbxl`: `SpeedA` horizontal distance check; `FlyA` vertical movement check and last-ground rollback; `ACPlayer` module-based check dispatch. No Actor-based parallelism is claimed because it was not present in the inspected place.
- `MovementSystem.rbxl`: a custom LocalScript controller with camera-relative movement, blockcast collision, wall sliding, ground snapping, and steps. Its visual is capsule-shaped but collision uses box sweeps. Included Roblox PlayerModule scripts are not claimed as original work.
- The movement card uses the source constants. The detail view uses the actual `getSlideDelta` function with normalized indentation.
- The SpeedA excerpt omits only its diagnostic `warn` line inside the displayed check region and normalizes indentation. The FlyA hero wraps the fallback expression onto the next line for display.
- The previews are browser illustrations, not Roblox gameplay recordings, executable Luau, or performance benchmarks.
- Age, experience, skill level, and involvement with the three named games come from the portfolio owner. No invented employer title, job dates, specific contribution, testimonial, or verified affiliation is added.

## Roblox statistics

Snapshot checked September 17, 2026; not live counters. The site shows game-wide visits and favorites and links to each game and the API source. Exact source values are also retained in `data.js`.

| Game | Roblox place ID | Universe ID | Visits | Favorites |
|---|---|---|---:|---:|
| Booga Booga — Gang O’ Fries Entertainment | 11729688377 | 4154513353 | 266,332,043 | 530,179 |
| Phantom Forces — StyLiS Studios | 292439477 | 113491250 | 1,797,446,519 | 5,983,820 |
| Fix It Up! — .workspace | 72712036210947 | 7673659635 | 139,417,006 | 333,605 |

Booga Booga has multiple editions. This site uses the leading exact-title Roblox search result, the Gang O’ Fries Entertainment edition; confirm that this is the intended project before publication. Change its IDs and statistics if a different edition is meant.

Sources:
- https://games.roblox.com/v1/games?universeIds=4154513353,113491250,7673659635
- https://games.roblox.com/v1/games/votes?universeIds=4154513353,113491250,7673659635
- https://www.roblox.com/games/11729688377
- https://www.roblox.com/games/292439477
- https://www.roblox.com/games/72712036210947

To update stats, check the official API, replace the numeric values in `data.js`, and update the visible checked date in `index.html` plus this README. The site intentionally does not call the Roblox API from visitors’ browsers, avoiding CORS and misleading live-stat claims.

## Customization

- Content and source snippets: `index.html` and `data.js`.
- Colors, fonts, animation, and breakpoints: `styles.css`.
- Behaviors and illustrative demos: `app.js`.
- Profile image: `assets/pfp.png` (supplied by the owner, used unchanged).

Google Fonts are optional; local system fonts are used if the font service is unavailable. The site uses no analytics or tracking script. Session storage only remembers whether the intro has already been shown.

## Optional developer preview

`npm ci` followed by `npm run dev` starts the optional local Vite preview. This is not required to publish on GitHub Pages: the HTML, CSS, JavaScript, and assets are already deployable as-is. Do not upload `node_modules` to GitHub.
