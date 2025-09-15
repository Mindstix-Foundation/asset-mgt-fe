# Asset Management Frontend

A modern Vue.js 3 application for managing organizational assets, built with TypeScript, Vite, and Tailwind CSS.

## Features

- 🎯 **Modern Dashboard** - Clean and intuitive asset management interface
- 📊 **Real-time Statistics** - Monitor asset metrics and status
- 🔍 **Advanced Search** - Find assets quickly with powerful filters
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 🎨 **Beautiful UI** - Built with Tailwind CSS and Lucide icons
- ⚡ **Fast Development** - Powered by Vite for lightning-fast builds
- 🔒 **Type Safety** - Full TypeScript support
- 🧪 **Testing Ready** - Configured with Vitest and Cypress

## Tech Stack

- **Framework**: Vue.js 3 with Composition API
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide Vue Next
- **State Management**: Pinia
- **Routing**: Vue Router
- **HTTP Client**: Axios
- **Testing**: Vitest (unit) + Cypress (e2e)
- **Code Quality**: ESLint + Prettier

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API server running (see asset-mgt-be)

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open browser**
   Navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test:unit` - Run unit tests
- `npm run test:e2e` - Run e2e tests
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── assets/          # Static assets and styles
├── components/      # Reusable Vue components
├── router/          # Vue Router configuration
├── services/        # API services and utilities
├── stores/          # Pinia stores for state management
├── views/           # Page components
└── main.ts         # Application entry point
```

## Configuration

The application can be configured through environment variables:

- `VITE_API_BASE_URL` - Backend API base URL (default: http://localhost:3000/api)
- `VITE_APP_TITLE` - Application title
- `VITE_APP_VERSION` - Application version

## API Integration

The frontend communicates with the backend through RESTful APIs. The API service is configured in `src/services/api.ts` with:

- Automatic request/response interceptors
- Authentication token handling
- Error handling and logging
- Typed API endpoints

## Development

### Code Style

- Use TypeScript for type safety
- Follow Vue 3 Composition API patterns
- Use Tailwind CSS utility classes
- Follow ESLint and Prettier configurations

### Component Structure

```vue
<template>
  <!-- Template with Tailwind classes -->
</template>

<script setup lang="ts">
// Composition API with TypeScript
</script>

<style scoped>
/* Component-specific styles if needed */
</style>
```

## Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Related Projects

- [Asset Management Backend](../asset-mgt-be) - Node.js API server

## License

This project is part of the Mindstix Foundation Asset Management System.
