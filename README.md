# EduSync

EduSync is a comprehensive student management system designed to streamline academic operations, including attendance tracking, marks management, circular distributions, and activity coordination.

## Tech Stack

### Backend
- **Node.js & Express:** Robust server-side framework.
- **MongoDB & Mongoose:** Scalable NoSQL database with object data modeling.
- **JWT (JSON Web Tokens):** Secure authentication with access and refresh tokens.
- **Bcrypt.js:** Industry-standard password hashing.
- **Dotenv:** Environment configuration management.

### Frontend
- **React (Vite):** Modern, fast frontend library and build tool.
- **React Router DOM:** Declarative routing for single-page applications.
- **Tailwind CSS:** Utility-first CSS framework for modern UI design.
- **Axios:** Promise-based HTTP client for API interactions.
- **Lucide React:** Beautifully simple icon library.
- **Recharts:** Composable charting library for data visualization.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or a remote URI)

### Quick Start (Recommended)

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd EduSync
   ```

2. **Install all dependencies:**
   This command installs dependencies for the root, server, and client:
   ```bash
   npm run install-all
   ```

3. **Configure Environment Variables:**
   Ensure `server/.env` contains the following:
   ```env
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_access_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   PORT=5000
   ```
   *Note: If using MongoDB Atlas, ensure your IP address is whitelisted.*

4. **Seed and Run:**
   ```bash
   # Seed the database (if first time)
   npm run seed
   
   # Start both server and client
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

### Manual Setup

If you prefer to run server and client separately:

#### 1. Server Setup
```bash
cd server
npm install
# Configure .env as shown above
npm run seed  # Only required once
npm run dev
```

#### 2. Client Setup
```bash
cd client
npm install
npm run dev
```

## Default Student Credentials

After seeding the database, you can log in with the following student accounts:

| Enrollment No. | Password | Name |
| :--- | :--- | :--- |
| `24100991556` | `student123` | Paras Rana |
| `24100991557` | `student456` | John Doe |

## Features
- **Dashboard:** Overview of attendance and upcoming events.
- **My Info:** Personal details and academic profile.
- **Attendance:** Subject-wise attendance visualization.
- **Circulars:** Official university announcements.
- **Activities:** Upcoming campus events and registration links.
- **Security:** Protected routes and session management with JWT.
