# Personal build log

This repo now powers a lightweight Next.js site deployed via GitHub Pages. The landing page doubles as a resume surface, while `/blog` lists markdown entries grouped by year/date.

## Requirements

- Node.js 20+
- npm 10+

## Setup

```bash
npm install
npm run dev # localhost:3000
```

`npm run build` outputs the static bundle that Pages can serve.

## Writing posts

1. Create a file under `src/content/blog/<year>/<YYYY-MM-DD-slug>.md`.
2. Use plain markdown—first level-one heading becomes the title and the first paragraph becomes the summary.
3. Commit and push. The loader calculates reading time, sorts by date, and exposes the entry at `/blog/<year>/<filename>`.

## Updating the resume

Edit `src/data/resume.ts`. All sections on the landing page map directly to the exported object, so you can drop in the final resume copy without touching components.

## Styling

The entire site sticks to a blue / black / white palette with gentle Material-inspired elevation. Shared styles live in `src/app/globals.css`, and the MUI theme is defined in `src/app/theme.ts` if you need component-level overrides.
