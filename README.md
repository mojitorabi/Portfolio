# Mojtaba Torabi — Portfolio

Minimal portfolio site. Hosted on GitHub Pages at [www.mojtabat.com](https://www.mojtabat.com).

## Custom domain (www.mojtabat.com)

1. In this repo: **Settings → Pages** → under "Custom domain" enter `www.mojtabat.com` and save. The `CNAME` file in the repo is already set to `www.mojtabat.com`.
2. At your domain registrar (where you bought mojtabat.com), add these DNS records:
   - **A**: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - **CNAME** (if supported): `www` → `YOUR_USERNAME.github.io` (replace with your GitHub username)
3. Wait for DNS to propagate (up to 48 hours). GitHub will show a green check when the domain is verified.
4. Optionally enable "Enforce HTTPS" in Pages settings after the domain is verified.

## Local preview

Open `index.html` in a browser, or run a simple server:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000

## Structure

- `index.html` — Home (hero, work, kind words)
- `resume.html` — Resume
- `my-story.html` — My Story
- `ux-notes.html` — UX Notes
- `work/*.html` — Case study placeholders (Torob, Baloot, Shams-ol-Emareh, Amanj)

Social links in the footer point to LinkedIn, Twitter, SoundCloud, GitHub, Instagram — update URLs in each HTML file to your real profiles.
