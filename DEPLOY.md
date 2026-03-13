# Deploy to GitHub (one-time)

Your remote is already set to: `https://github.com/MojtabaTorabiii/mojtabat.com.git`

## 1. Create the repository on GitHub

Click this link (it opens a new repo with the name pre-filled):

**https://github.com/new?name=mojtabat.com&description=Portfolio**

- Leave **“Add a README”** unchecked.
- Click **Create repository**.

## 2. Push from your Mac

In **Terminal**, run:

```bash
cd /Users/mojtabatorabi/Desktop/Portfolio
git push -u origin main
```

Sign in with your GitHub account if asked. After the push, the GitHub Actions workflow will run and deploy your site.

## 3. Turn on GitHub Pages

In the repo: **Settings → Pages** → under **Build and deployment**, set **Source** to **GitHub Actions**.

## 4. (Optional) Use www.mojtabat.com

In **Settings → Pages** → **Custom domain**, enter `www.mojtabat.com` and save. Then add the DNS records at your domain registrar (see README).
