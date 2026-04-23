# GitHub Pages Deployment Guide

## ✅ What's Been Updated

Your portfolio is now configured for GitHub Pages deployment with your custom domain **aqibfaraz.dev**.

### Changes Made:
1. ✅ **package.json** - Added:
   - `homepage` field pointing to your custom domain
   - `gh-pages` dependency
   - `deploy` and `predeploy` scripts

2. ✅ **public/CNAME** - Created with your domain name (required by GitHub Pages)

3. ✅ **.github/workflows/deploy.yml** - Automated CI/CD pipeline for deployment

---

## 📋 Setup Instructions

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Configure GitHub Pages deployment with custom domain"
git push origin main
```

### Step 2: Configure GitHub Repository Settings
1. Go to your GitHub repository
2. Navigate to **Settings → Pages**
3. Under "Source", select:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
4. Under "Custom domain", enter: `aqibfaraz.dev`
5. Click **Save**
6. Check "Enforce HTTPS"

### Step 3: Configure Your Domain Provider
1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Find DNS settings
3. Add these DNS records:
   ```
   Type    Host        Value
   A       @           185.199.108.153
   A       @           185.199.109.153
   A       @           185.199.110.153
   A       @           185.199.111.153
   CNAME   www         <YOUR_GITHUB_USERNAME>.github.io
   ```

### Step 4: Wait for Deployment
- GitHub Actions will automatically build and deploy when you push to `main`
- Check the **Actions** tab in your repository to monitor the build
- DNS propagation may take 24-48 hours
- Once complete, your site will be live at **https://aqibfaraz.dev**

---

## 🚀 Manual Deployment (Alternative)

If you want to deploy locally instead of using GitHub Actions:

```bash
npm install
npm run deploy
```

This will build and push to the `gh-pages` branch automatically.

---

## 📱 Next Steps

1. Test locally: `npm start`
2. Build & deploy: `npm run deploy` (or push to GitHub if using Actions)
3. Verify at your custom domain once DNS propagates

