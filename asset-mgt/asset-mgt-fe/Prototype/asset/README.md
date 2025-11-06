# Navbar Assets

This folder contains the separated navbar components for the Asset Management System.

## Files

- **navbar.html** - The main navbar HTML structure
- **navbar.js** - JavaScript functionality for navbar management
- **navbar.css** - Additional styling for the navbar
- **README.md** - This documentation file

## Usage

### Method 1: Include navbar.js (Recommended)

Add these lines to your HTML files in the `<head>` section:

```html
<!-- Include navbar CSS -->
<link rel="stylesheet" href="asset/navbar.css">

<!-- Include navbar JavaScript -->
<script src="asset/navbar.js"></script>
```

The JavaScript will automatically load the navbar HTML and set the active navigation item based on the current page.

### Method 2: Manual Include

If you prefer to include the navbar manually, you can use server-side includes or copy the navbar.html content directly into your pages.

## Features

- **Automatic Loading**: The navbar.js automatically loads the navbar HTML
- **Active State Management**: Automatically highlights the current page in navigation
- **Responsive Design**: Mobile-friendly with collapsible navigation
- **Smooth Animations**: CSS transitions for better user experience
- **Consistent Styling**: Maintains the existing Bootstrap theme

## Customization

### Changing Active States
The JavaScript automatically detects the current page and sets the active state. If you need to manually update the active state:

```javascript
const navbarManager = new NavbarManager();
navbarManager.updateActiveState('dashboard.html');
```

### Styling
Modify `navbar.css` to customize the appearance. The file includes:
- Hover effects
- Active state styling
- Mobile responsiveness
- Animation effects

## Integration Steps

1. **Remove existing navbar HTML** from your individual pages
2. **Add the CSS and JS includes** to the `<head>` section of each page
3. **Test navigation** to ensure active states work correctly

## Browser Compatibility

- Modern browsers with ES6 support
- IE11+ (with polyfills if needed)
- Mobile browsers

## Notes

- The navbar HTML is loaded via fetch API, so pages must be served from a web server (not file://)
- The active state detection works by comparing the current page filename with navigation links
- All existing functionality (Bootstrap dropdowns, responsive behavior) is preserved 