# task-board-app

The phone app for the task board. It's a single static page served by GitHub Pages.

- No tasks or tokens live in this repo. The app reads and writes `tasks.json` in the private `task-board` repo through GitHub's API, using a token stored only on your phone.
- Open the Pages link in Safari on iPhone, then Share → Add to Home Screen.
- `sw.js` caches the app so it opens offline and shows your last-synced list. Editing needs a connection.
