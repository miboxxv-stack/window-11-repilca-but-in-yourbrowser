# Windows 11 Replica

A browser-based Windows 11-inspired desktop simulation built with React, TypeScript and Vite.

## Run locally
1. Install Node.js 20 or newer.
2. Open this folder in a terminal.
3. Run `npm install`
4. Run `npm run dev`
5. Open the local URL printed by Vite.

## Build
Run `npm run build`. The production site is created in `dist/`.

## GitHub Pages
This project uses a relative Vite base path (`./`). Build with `npm run build`, then publish the `dist` folder using GitHub Pages (or use a Pages workflow that runs `npm ci` and `npm run build`).

## Included desktop apps
- Start menu, search, taskbar, quick settings and notification panel
- File Explorer-style window
- Edge-style demo browser (local simulated navigation; external links open normally)
- Steam-inspired library with the supplied game lists, filters, selection and demo launch buttons
- Settings, Notepad and Calculator

This is a front-end simulation. It cannot run installed Windows programs or launch real Steam games from a normal browser. Steam branding is represented as a visual demo, not the official Steam client.
