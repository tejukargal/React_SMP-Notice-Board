# SMP Notice Board

A modern notice board application for Sanjay Memorial Polytechnic, Sagar.

## Features

- **Dashboard**: Auto-scrolling ticker, featured latest circular, department badges
- **All Circulars**: Filterable grid view with department-wise color coding
- **Admin Panel**: CRUD operations for circulars with file upload support
- **Authentication**: Secure JWT-based admin login
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Department Color Coding**:
  - CE (Civil): Blue
  - ME (Mechanical): Green
  - CS (Computer Science): Purple
  - EC (Electronics): Orange
  - EE (Electrical): Red
  - All Departments: Gray

## Tech Stack

- **Frontend**: Vite + React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: Nile Database (PostgreSQL)
- **Authentication**: JWT

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd server && npm install
   ```

3. Configure environment variables:
   - Frontend `.env` is already configured
   - Backend `server/.env` has database connection

### Running the Application

#### Option 1: Use the startup scripts (recommended for Windows):

**For Windows - Double-click one of these:**
- `start.bat` - Opens both servers in separate CMD windows
- `start.ps1` - Opens both servers in separate PowerShell windows

**Or run from terminal:**
```bash
# Using batch file
start.bat

# Using PowerShell
.\start.ps1
```

#### Option 2: Start servers manually in separate terminals:

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Default Admin Credentials

- **Username**: admin
- **Password**: admin123

## Usage

1. Visit http://localhost:5173
2. Browse circulars on the Dashboard and All Circulars pages
3. Login at /login with admin credentials
4. Access Admin Panel to add/edit/delete circulars
5. Upload PDF/JPG/PNG attachments with drag-and-drop

## Department Codes

- **CE**: Civil Engineering
- **ME**: Mechanical Engineering
- **CS**: Computer Science
- **EC**: Electronics & Communication
- **EE**: Electrical Engineering
- **All**: All Departments

## Database

The application uses Nile Database with the following schema:

### circulars table
- id (UUID)
- title (TEXT)
- date (DATE)
- subject (TEXT)
- department (TEXT)
- body (TEXT)
- attachments (JSONB)
- created_at (TIMESTAMP)

### admin_users table
- id (UUID)
- username (TEXT)
- password_hash (TEXT)
- created_at (TIMESTAMP)

## Project Structure

```
├── src/                    # Frontend source
│   ├── api/               # API client
│   ├── components/        # React components
│   ├── context/          # React context (Auth)
│   ├── pages/            # Page components
│   ├── types/            # TypeScript types
│   ├── utils/            # Utility functions
│   └── App.tsx           # Main app component
├── server/                # Backend source
│   ├── index.ts          # Express server
│   ├── package.json      # Backend dependencies
│   └── .env             # Backend config
└── README.md             # This file
```

## Features in Detail

### Dashboard
- Auto-scrolling ticker with circular titles
- Featured latest circular in large card
- Quick access department badges
- Recent circulars preview

### All Circulars
- Responsive grid layout (1/2/3 columns)
- Filter by department
- Sorted by date (newest first)
- Click to view full details in modal
- Attachment download support

### Admin Panel
- Protected route (requires authentication)
- Table view of all circulars
- Add/Edit/Delete operations
- File upload with drag-and-drop
- Form validation
- Real-time updates

## Security Notes

- JWT tokens for API authentication
- Protected admin routes
- File type validation (PDF, JPG, PNG only)
- File size limit (10MB per file)
- Password stored in database (use bcrypt in production)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

© 2025 Sanjay Memorial Polytechnic, Sagar. All rights reserved.
