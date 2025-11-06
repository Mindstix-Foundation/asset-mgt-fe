# Vue.js + Bootstrap 5 Project

A fresh Vue.js 3 project with Vite, TypeScript, and Bootstrap 5 integration.

## 🚀 Features

- **Vue.js 3** - The Progressive JavaScript Framework
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Lightning-fast build tool and dev server
- **Bootstrap 5** - Modern CSS framework with responsive design
- **Vue Router** - Official router for Vue.js
- **Pinia** - State management for Vue.js
- **Vitest** - Unit testing framework
- **Playwright** - End-to-end testing
- **ESLint + Prettier** - Code linting and formatting

## 🛠️ Project Setup

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Run Unit Tests
```bash
npm run test:unit
```

### Run E2E Tests
```bash
npm run test:e2e
```

### Lint and Format
```bash
npm run lint
npm run format
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/     # Vue components
│   ├── views/         # Page components
│   ├── router/        # Vue Router configuration
│   ├── stores/        # Pinia stores
│   ├── assets/        # Static assets
│   ├── App.vue        # Root component
│   └── main.ts        # Application entry point
├── public/            # Public static files
├── e2e/              # End-to-end tests
└── package.json      # Dependencies and scripts
```

## 🎨 Bootstrap Integration

Bootstrap 5 is fully integrated with:
- CSS framework imported in `main.ts`
- JavaScript components available globally
- Responsive navigation bar
- Cards, buttons, forms, and other components
- Utility classes for rapid development

## 🌟 Getting Started

1. The development server should be running on `http://localhost:5173`
2. Navigate between Home and About pages to see Bootstrap components
3. Start building your application by modifying components in `src/`

## 🔧 Customization

- Modify Bootstrap variables by creating a custom SCSS file
- Add new components in the `src/components/` directory
- Create new pages in `src/views/` and add routes in `src/router/`
- Manage global state with Pinia stores in `src/stores/`

Happy coding! 🎉
