# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SMP Notice Board is a full-stack notice board application for Sanjay Memorial Polytechnic, Sagar. It's a Vite + React + TypeScript frontend with an Express + TypeScript backend, using Nile Database (PostgreSQL) for data persistence.

## Development Commands

### Starting the Application

**Recommended (Windows):** Use startup scripts that open servers in separate windows:
- `start.bat` - Opens both servers in CMD windows
- `.\start.ps1` - Opens both servers in PowerShell windows

**Manual start (use 2 terminals):**
```bash
# Terminal 1 - Backend (runs on http://localhost:3001)
npm run server

# Terminal 2 - Frontend (runs on http://localhost:5173)
npm run dev
```

### Other Commands
```bash
npm run build        # TypeScript compile + Vite build
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Backend-specific (in server/ directory)
cd server && npm run dev      # Start backend with tsx watch
cd server && npm run build    # Compile TypeScript
cd server && npm run start    # Run compiled backend
```

## Architecture

### Authentication Flow
- JWT-based authentication managed by `AuthContext` (src/context/AuthContext.tsx)
- Tokens stored in localStorage with key `smp_auth_token`
- Auth utilities in `src/utils/auth.ts` handle token/user persistence
- `ProtectedRoute` component (src/components/ProtectedRoute.tsx) wraps admin routes
- Backend middleware `authenticateToken` (server/index.ts:24) validates JWT tokens
- Default credentials: username=`admin`, password=`teju2015`

### API Client Architecture
- Centralized API client in `src/api/client.ts`
- Two main API namespaces: `authAPI` and `circularsAPI`
- `getAuthHeader()` helper automatically injects Bearer token from localStorage
- API_URL defaults to `http://localhost:3001` but can be overridden via VITE_API_URL env var
- All authenticated requests (POST/PUT/DELETE/PATCH) include Authorization header
- Runtime detection for Netlify deployment: when hostname includes `netlify.app`, API uses relative URLs

### Backend API Structure
- RESTful API with Express (server/index.ts)
- PostgreSQL connection via `pg` Pool with SSL enabled
- JWT_SECRET from env or defaults to 'default_secret'
- CORS enabled for all origins
- JSON body limit set to 50mb to support base64 file uploads

**API Endpoints:**
- `POST /api/auth/login` - Login with username/password
- `GET /api/circulars` - List circulars (query params: department, featured)
- `GET /api/circulars/:id` - Get single circular
- `POST /api/circulars` - Create circular (protected)
- `PUT /api/circulars/:id` - Update circular (protected)
- `DELETE /api/circulars/:id` - Delete circular (protected)
- `PATCH /api/circulars/:id/featured` - Toggle featured status (protected)
- `GET /health` - Health check

### Database Schema

**circulars table:**
- `id` (UUID, primary key)
- `title` (TEXT)
- `date` (DATE)
- `subject` (TEXT)
- `department` (TEXT) - One of the Department types
- `body` (TEXT)
- `attachments` (JSONB) - Array of FileAttachment objects
- `is_featured` (BOOLEAN) - Only one circular should be featured at a time
- `created_at` (TIMESTAMP)

**admin_users table:**
- `id` (UUID, primary key)
- `username` (TEXT)
- `password_hash` (TEXT) - Currently plain text, should use bcrypt in production
- `created_at` (TIMESTAMP)

### Department System
- Department codes and styling defined in `src/utils/departments.ts`
- Each department has: code, name, color, lightColor, and Tailwind CSS classes
- Engineering departments: CE (Civil), ME (Mechanical), CS (Computer Science), EC (Electronics), EE (Electrical)
- Special categories: All, Office, Results, Fee Dues, Exams, Scholarships, Internship, Annual Day, Functions, Admission Ticket, Admissions
- Department color coding applied via `DepartmentBadge` component
- Type-safe Department union type in `src/types/index.ts`

### File Attachments
- Files stored as base64-encoded strings in JSONB
- `FileAttachment` interface: name, type, size, base64
- Supported file types: PDF, JPG, PNG
- File size limit: 10MB per file
- Drag-and-drop upload in CircularForm component

### Component Hierarchy
- `App.tsx` - Root component with Router and AuthProvider
- `Layout.tsx` - Shared layout wrapper with Header and Footer
- **Pages:**
  - `Dashboard.tsx` - Home page with ticker, featured circular, department badges, recent circulars
  - `AllCirculars.tsx` - Grid view with department filter
  - `AdminPanel.tsx` - Protected admin CRUD interface
  - `Login.tsx` - Authentication page
- **Key Components:**
  - `CircularTicker` - Auto-scrolling marquee of circular titles
  - `CSVTicker` - Alternative ticker component for CSV-based data
  - `CircularCard` - Display card for circulars
  - `CircularModal` - Full circular detail modal
  - `CircularForm` - Create/edit form with file upload
  - `RichTextEditor` - Text editor component for circular body content
  - `DepartmentBadge` - Color-coded department labels

### Routing
- React Router DOM v6
- Routes defined in App.tsx:
  - `/` - Dashboard
  - `/circulars` - All Circulars page
  - `/admin` - Admin Panel (protected route)
  - `/login` - Login page

### State Management
- No global state library (Redux/Zustand)
- Authentication state managed via React Context (`AuthContext`)
- Component-level state with useState for UI and data fetching
- API calls made directly from components using `circularsAPI` methods

### Utilities
- `src/utils/auth.ts` - Authentication token/user management
- `src/utils/departments.ts` - Department definitions and styling
- `src/utils/linkify.tsx` - URL detection and automatic link creation in text

## Important Notes

### Security Considerations
- Password stored as plain text in database - use bcrypt for production
- JWT_SECRET should be a strong random string in production
- File size validation happens client-side only
- No rate limiting on API endpoints

### Featured Circular Logic
- Only ONE circular can be featured at a time
- When toggling featured status, backend first unsets all featured flags, then sets the selected one
- Featured circular always appears first in lists (ORDER BY is_featured DESC)
- Dashboard displays featured circular in large card at top

### Department Filtering
- When filtering by department, circulars marked "All" are also included
- Backend query: `WHERE department = $1 OR department = 'All'`
- "All" department acts as a wildcard visible to all filters

### TypeScript Configuration
- Frontend: tsconfig.app.json for app code, tsconfig.node.json for Vite config
- Backend: server/tsconfig.json with ES module target
- Both use strict mode

### Styling
- Tailwind CSS with custom department color classes
- Mobile-first responsive design
- Lucide React for icons
