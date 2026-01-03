# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a "Doraemon World Exploration" website - a full-stack web application with a Node.js/Express backend and Vue 3 frontend. The site is dedicated to Doraemon (哆啦A梦) content and includes user management, blogs, news, and various interactive features.

## Architecture

### Backend (doraemon-nodejs/)
- **Framework**: Express.js with Node.js
- **Database**: MySQL (see doraemon.sql for schema)
- **Authentication**: JWT tokens for users and admins
- **File Upload**: Multer for image handling
- **Key Dependencies**: bcryptjs, ioredis, nodemailer, axios

#### Backend Structure
- `app.js` - Main Express application with CORS setup and route mounting
- `bin/www` - Server startup configuration
- `routes/` - API route definitions:
  - `users.js` - User management endpoints
  - `admin.js` - Admin-specific endpoints
  - `news.js` - News management
  - `blog.js` - Blog functionality
- `controllers/` - Business logic handlers
- `utils/` - Utility functions including authentication middleware

### Frontend (doraemon-vue/)
- **Framework**: Vue 3 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Element Plus
- **State Management**: Vuex with persistence
- **Routing**: Vue Router with role-based guards
- **Key Dependencies**: axios, echarts, leaflet, vue-baidu-map-3x

#### Frontend Structure
- `src/main.ts` - Application entry point with plugin initialization
- `src/router/index.ts` - Route definitions with authentication guards
- `src/router/admin.ts` - Admin-specific routes
- `src/router/users.ts` - User-specific routes
- `src/components/` - Vue components organized by feature
- `src/store/` - Vuex store modules

## Development Commands

### Backend (doraemon-nodejs/)
```bash
cd doraemon-nodejs
npm start          # Start development server with nodemon
```

### Frontend (doraemon-vue/)
```bash
cd doraemon-vue
npm run dev        # Start Vite development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint with auto-fix
```

## Key Features

### User Management
- Registration/login with email verification
- Profile management with avatar uploads
- Password recovery via email
- User feedback system

### Content Management
- Blog system with categories and comments
- News system with categories
- Image upload functionality
- Collection/favorites system

### Administrative Features
- Admin dashboard with authentication
- User management (CRUD operations)
- Content moderation (blogs, news)
- Platform analytics and statistics

### Interactive Features
- Interactive maps (using Baidu Maps and Leaflet)
- Multimedia content (music, video sharing)
- Responsive design for mobile devices

## Database Schema

The MySQL database includes tables for:
- Users (authentication and profiles)
- Blogs and blog categories
- News and news categories
- Comments and collections
- User feedback

See `doraemon.sql` for the complete schema.

## Authentication & Authorization

- JWT tokens for both users and admins
- Separate token storage and validation
- Route guards based on user roles
- Middleware for token verification in backend routes

## Development Notes

- Backend runs on default port (usually 3000)
- Frontend development server runs on port 5173
- CORS is configured for these origins
- Image uploads are stored in `public/images/` with organized subdirectories
- The project includes comprehensive error handling and validation