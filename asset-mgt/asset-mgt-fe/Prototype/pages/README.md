# Asset Management Pages

This directory contains all the main application pages organized in separate folders for better structure and maintainability.

## Directory Structure

```
Prototype/
├── pages/
│   ├── dashboard/
│   │   └── dashboard.html    # Dashboard page
│   ├── assets/
│   │   └── assets.html       # Assets management page
│   ├── employees/
│   │   └── employees.html    # Employee management page
│   ├── inventory/
│   │   └── inventory.html    # Inventory tracking page
│   ├── maintenance/
│   │   └── maintenance.html  # Maintenance scheduling page
│   └── reports/
│       └── reports.html      # Reports and analytics page
├── asset/
│   ├── navbar.html          # Shared navbar component
│   ├── navbar.js            # Navbar functionality
│   ├── navbar.css           # Navbar styling
│   └── README.md            # Navbar documentation
├── styles.css               # Global styles
├── script.js                # Global JavaScript
└── index.html               # Main landing page
```

## Navigation

All pages now use a centralized navbar system:

- **Navbar Component**: Located in `../asset/navbar.html`
- **Navbar JavaScript**: Automatically loads navbar and manages active states
- **Navigation URLs**: 
  - Dashboard: `pages/dashboard/dashboard.html`
  - Assets: `pages/assets/assets.html`
  - Employees: `pages/employees/employees.html`
  - Inventory: `pages/inventory/inventory.html`
  - Maintenance: `pages/maintenance/maintenance.html`
  - Reports: `pages/reports/reports.html`

## File Paths

Each page uses relative paths to access shared resources:

- **CSS Files**: `../../styles.css` and `../../asset/navbar.css`
- **JavaScript Files**: `../../script.js` and `../../asset/navbar.js`
- **Navbar HTML**: Loaded automatically via JavaScript from `../../asset/navbar.html`

## Benefits of This Structure

1. **Modular Organization**: Each page has its own dedicated folder
2. **Descriptive Filenames**: Clear, meaningful filenames instead of generic `index.html`
3. **Centralized Navbar**: Single source of truth for navigation
4. **Easy Maintenance**: Changes to navbar affect all pages automatically
5. **Scalability**: Easy to add new pages by creating new folders
6. **Asset Organization**: Shared assets are clearly separated

## Adding New Pages

To add a new page:

1. Create a new folder in `pages/` directory
2. Add an HTML file with a descriptive name (e.g., `settings.html`):

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Asset Management - Your Page</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link href="../../styles.css" rel="stylesheet">
    <link rel="stylesheet" href="../../asset/navbar.css">
    <script src="../../asset/navbar.js"></script>
</head>
<body style="background-color: #ffffff;">
    <!-- Navbar will be automatically loaded here -->
    
    <!-- Your page content here -->
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../../script.js"></script>
</body>
</html>
```

3. Update the navbar component (`../asset/navbar.html`) to include your new page link
4. Update the navbar JavaScript (`../asset/navbar.js`) to handle the active state for your new page

## File Naming Convention

- Use descriptive names that match the page purpose
- Use lowercase with hyphens for multi-word names (e.g., `user-settings.html`)
- Keep folder names singular and lowercase
- Maintain consistency across all pages 