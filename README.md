# Domio - Real Estate Platform

A modern real estate platform for Afghanistan, built using MERN stack.

## Features

### Public Website
- **Home Page**: Hero section, featured properties, features showcase
- **Properties**: Browse all properties with filters (Apartments, Homes, Shops)
- **About**: Company information
- **Contact**: Contact form and company details

### Admin Portal
- **Dashboard**: Overview and statistics
- **Agents**: Manage real estate agents
- **Properties**: Manage properties (Apartments, Homes, Shops)
- **User Management**: Manage platform users
- **Settings**: Platform settings

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: Zustand
- **Icons**: Lucide React
- **HTTP Client**: Axios

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

### Running the Application

1. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

2. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

3. Open http://localhost:5173 in your browser

## Project Structure

```
Domio/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminLayout.jsx       # Admin portal layout
│   │   │   ├── website/              # Public website components
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Hero.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── WebsiteLayout.jsx
│   │   │   └── sidebar/
│   │   ├── pages/
│   │   │   ├── Auth/
│   │   │   │   ├── SignIn.jsx
│   │   │   │   └── SignUp.jsx
│   │   │   ├── website/              # Public website pages
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── Properties.jsx
│   │   │   │   ├── About.jsx
│   │   │   │   └── Contact.jsx
│   │   │   ├── Map/
│   │   │   │   └── MapPage.jsx
│   │   │   └── Common/
│   │   ├── router/
│   │   │   └── index.jsx             # Route configuration
│   │   ├── store/
│   │   │   └── authStore.js          # Authentication state
│   │   ├── hooks/
│   │   │   └── useAuth.js            # Auth hooks
│   │   └── lib/
│   │       └── axiosClient.js         # HTTP client
│   ├── tailwind.config.js
│   └── vite.config.js
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── config/
│   └── package.json
└── README.md
```

## License

MIT
