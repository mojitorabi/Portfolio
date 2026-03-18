#!/bin/bash
# Create MojtabaTorabiii/mojtabat.com on GitHub and push. Run once with your token.
# Usage: GITHUB_TOKEN=your_token ./deploy.sh
# Create a token at: https://github.com/settings/tokens (repo scope)

set -e
cd "$(dirname "$0")"

if [ -z "$GITHUB_TOKEN" ]; then
  echo "Set GITHUB_TOKEN first. Example:"
  echo "  GITHUB_TOKEN=ghp_xxxx ./deploy.sh"
  echo "Create a token: https://github.com/settings/tokens (check 'repo')"
  exit 1
fi

REPO="mojtabat.com"
USER="MojtabaTorabiii"
API="https://api.github.com"

# Create repo if it doesn't exist
echo "Creating repo $USER/$REPO (if not exists)..."
HTTP=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -d "{\"name\":\"$REPO\",\"description\":\"Portfolio\"}" \
  "$API/user/repos")
if [ "$HTTP" = "201" ]; then
  echo "Repo created."
elif [ "$HTTP" = "422" ]; then
  echo "Repo already exists."
else
  echo "Unexpected response: $HTTP"
  exit 1
fi

# Push using token (remote is already origin)
echo "Pushing to origin main..."
git remote set-url origin "https://${GITHUB_TOKEN}@github.com/${USER}/${REPO}.git"
git push -u origin main

# Remove token from remote
git remote set-url origin "https://github.com/${USER}/${REPO}.git"
echo "Done. Enable Pages: Settings → Pages → Source: GitHub Actions."
echo "Site: https://${USER}.github.io/${REPO}"
