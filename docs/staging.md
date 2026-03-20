# Local staging (real-time preview)

Preview the static site **before** pushing to GitHub.

## Start the server

From the **Portfolio** repo root:

```bash
cd /Users/mojtabatorabi/Desktop/Portfolio
python3 -m http.server 8765
```

## Open in the browser

- **http://127.0.0.1:8765**  
- or **http://localhost:8765**

Refresh after each save to see changes.

## Stop the server

Press `Ctrl+C` in the terminal where it’s running.

## After edits

1. Refresh the staging URL.
2. Run through **`docs/hig-checklist.md`** against the [Apple HIG](https://developer.apple.com/design/human-interface-guidelines).
3. Resize for **phone / tablet / desktop** and check **light / dark / system** theme.
