# Aqib Faraz Portfolio

Terminal-Industries inspired dark cinematic portfolio.

## Setup & Run

### Requirements
- Node.js 16+ installed (https://nodejs.org)

### Steps

```bash
# 1. Extract the zip
# 2. Open terminal in the aqib-portfolio folder

# Install dependencies
npm install

# Start dev server (opens at http://localhost:3000)
npm start

# Build for production (creates /build folder)
npm run build
```

## Folder Structure

```
aqib-portfolio/
├── public/
│   ├── index.html        ← HTML template
│   └── aqib-photo.png    ← Your photo (replace to update)
├── src/
│   ├── index.js          ← React entry point
│   └── App.js            ← ALL code is here (components, data, styles)
└── package.json
```

## Customization Guide

All editable data is at the TOP of `src/App.js`:

### Change Projects → Edit `PROJECTS` array
### Change Stack → Edit `STACK` array  
### Change Stats → Edit `STATS` array
### Change Roles (typewriter) → Edit `ROLES` array
### Change Email → Search `Aqibfahraz@gmail.com` and replace
### Change Photo → Replace `public/aqib-photo.png` with your new photo (same filename)
### Change Colors → Search `#00cc99` (green accent) or `#02060a` (background)

## Deployment

After `npm run build`, deploy the `/build` folder to:
- Netlify (drag & drop)
- Vercel (connect GitHub repo)
- GitHub Pages
