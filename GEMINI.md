# GEMINI.md — wp-react-page

## Project Overview
A React + Tailwind v4 + Vite app that builds into a single `bundle.js` + `bundle.css` and gets embedded into a specific WordPress/Elementor page via a child theme. The rest of the WordPress site is untouched.

## Stack
- **React 18** — UI
- **Tailwind CSS v4** — styling (uses `@tailwindcss/vite` plugin, no config file needed)
- **Vite 6** — bundler
- **WordPress child theme** — enqueues the bundle on one specific page

## Project Structure
```
wp-react-page/
  src/
    main.jsx          # mounts React to #root
    App.jsx           # homepage root component — start here
    index.css         # Tailwind import + WordPress reset styles
    components/       # shared components
  index.html          # dev server entry (not deployed to WP)
  vite.config.js      # outputs bundle.js + bundle.css to dist/
  package.json

  # WordPress files (upload to child theme root)
  functions.php       # enqueues bundle on specific page + wp_localize_script
  style.css           # child theme declaration
```

## Build & Dev
```bash
npm install       # first time setup
npm run dev       # local dev at localhost:5173 — full HMR, no WP needed
npm run build     # outputs dist/bundle.js + dist/bundle.css
```

## Deployment Workflow
1. `npm run build`
2. Upload `dist/` folder to `wp-content/themes/your-child-theme/dist/`
3. Done — WordPress enqueues it automatically on the target page

## WordPress Integration

### Mounting Point
In Elementor on the target page, add an **HTML widget** containing:
```html
<div id="root"></div>
```

### Passing WP Data to React
Data is injected via `wp_localize_script` in `functions.php` and available globally:
```js
window.wpData.siteUrl   // site URL
window.wpData.apiUrl    // WP REST API base URL
window.wpData.nonce     // REST API nonce for authenticated requests
window.wpData.userId    // current logged-in user ID (0 if logged out)
```
Add more keys in `functions.php` under `wp_localize_script`.

### Page Targeting
The bundle only loads on one page. Controlled by `functions.php`:
```php
if (!is_page('your-page-slug')) return;
```

## Key Config: vite.config.js
```js
base: '/wp-content/themes/your-child-theme/dist/'
```
Must match the actual child theme folder name on the server — affects asset URLs in the bundle.

## Styling Notes
- Tailwind v4 — no `tailwind.config.js` needed, configured via `@tailwindcss/vite` plugin
- `src/index.css` has `#root { all: unset }` to prevent Elementor/WP global styles bleeding in
- Add any WordPress style overrides in `index.css`

## Conventions
- All new components go in `src/components/`
- `App.jsx` is the page root — treat it like a normal React page component
- No React Router needed (single page, no client-side routing)
- Use `window.wpData` for any WordPress-side data, never hardcode URLs

## Things to Change Before Using
| File | What to change |
|------|---------------|
| `vite.config.js` | `base` → your child theme folder name |
| `functions.php` | `is_page('home')` → your page slug |
| `functions.php` | child theme folder name in `get_stylesheet_directory_uri()` paths |
| `style.css` | `Template:` → your parent theme folder name |