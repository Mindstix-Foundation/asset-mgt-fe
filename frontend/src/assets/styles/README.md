# Styles Directory

This directory contains modular CSS files for better organization and maintainability.

## Structure

```
styles/
├── variables.css          # CSS variables & theme colors
├── base.css              # Reset & base styles
├── layout.css            # Layout utilities (container, grid, etc.)
├── components/           # Component-specific styles
│   ├── buttons.css       # Button styles
│   ├── cards.css         # Card styles
│   ├── forms.css         # Form styles
│   ├── tables.css        # Table styles
│   ├── modals.css        # Modal styles
│   ├── badges.css        # Badge styles
│   └── navigation.css    # Navigation styles
├── pages/                # Page-specific styles
│   ├── login.css         # Login page styles
│   └── dashboard.css     # Dashboard page styles
├── utilities.css         # Utility classes
└── index.css             # Main entry point (imports all)
```

## Usage

Import the main index file in your application:

```typescript
import '@/assets/styles/index.css'
```

## Migration Note

The original `main.css` (3223 lines) has been split into modular files for better maintainability.
The styles remain functionally identical but are now organized by concern.

