# Deploy to GitHub (one-time)

Your remote is set to: `https://github.com/MojtabaTorabiii/mojtabat.com.git`

## Option A — One command (recommended)

This creates the repo and pushes in one go. You need a [Personal Access Token](https://github.com/settings/tokens) with **repo** scope.

In **Terminal**:

```bash
cd /Users/mojtabatorabi/Desktop/Portfolio
GITHUB_TOKEN=ghp_YourTokenHere ./deploy.sh
```

Replace `ghp_YourTokenHere` with your token. The script creates `MojtabaTorabiii/mojtabat.com` if it doesn't exist, then pushes. It does **not** store the token in git config.

## Option B — Manual

1. Create the repo: **https://github.com/new?name=mojtabat.com&description=Portfolio** (do not add a README).
2. In Terminal: `cd /Users/mojtabatorabi/Desktop/Portfolio && git push -u origin main`
3. Sign in with GitHub if prompted.

## After the first push

- **Settings → Pages** → **Source**: **GitHub Actions**.
- Site: **https://MojtabaTorabiii.github.io/mojtabat.com**
- (Optional) **Custom domain**: `www.mojtabat.com` — then set DNS (see README).
