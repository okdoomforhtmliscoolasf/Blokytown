# BLOCKTOWN 10.2 — MOBILE + START FIX

A local-first isometric city-building game. No accounts, server, API keys, or build tools required.

## Run
Open `index.html` in a modern browser, or upload all four files to a GitHub repository and enable GitHub Pages.

## Included
- Title screen, new game, continue, save slots, pause/resume, settings
- 16×16 isometric city grid with 4 view rotations, zoom, grid and labels
- 25+ placeable land, road, residential, commercial, civic and decorative items
- Construction costs, starting budget, daily income/upkeep, population and happiness estimates
- City report, milestones, service overview, day/season clock and 1×/2×/3× simulation speed
- Undo/redo, bulldozer refund, autosave, quick save, 3 save slots
- JSON import/export and PNG map export
- Light/dark appearance, mobile layout, keyboard-friendly controls

## Notes
This is a self-contained browser game prototype. Economy, services and citizen metrics are intentionally lightweight simulation systems, not a real-world planning model. Saves remain in the browser's local storage; export JSON for a portable backup.


## Start screen reliability
The main menu buttons include a small emergency screen-transition fallback, and the JavaScript URL is cache-busted. Replace all four files when updating the GitHub Pages deployment.
