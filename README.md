# Task Management Application

A modern, full-stack task management application with role-based access control built with MERN stack.

## Features

- **Role-Based Access Control**: Super Admin, Organization, and Member roles
- **Task Management**: Create, update, delete, and track tasks
- **Organization Management**: Organizations can manage their members and tasks
- **User Management**: Bulk user creation, password reset
- **Analytics Dashboard**: Role-specific statistics and insights
- **Modern UI**: Clean SaaS-style design with Tailwind CSS

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React
- React Router
- Axios
- Tailwind CSS
- React Hot Toast

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (already created with default values):
```
PORT=8080
NODE_ENV=development
MONGO_URI=
JWT_TOKEN=
```

4. Create Super Admin user:
```bash
node scripts/createSuperAdmin.js
```

5. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:8080`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Default Credentials

**Super Admin:**
- Email: `superadmin@gmail.com`
- Password: `superadmin`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register/organization` - Register organization
- `POST /api/auth/register/member` - Register member
- `GET /api/auth/me` - Get current user

### Tasks
- `GET /api/tasks` - Get all tasks (filtered by role)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Organizations
- `GET /api/organizations` - Get all organizations (Super Admin only)
- `GET /api/organizations/:id` - Get single organization
- `PUT /api/organizations/:id` - Update organization
- `GET /api/organizations/:id/members` - Get organization members
- `GET /api/organizations/:id/analytics` - Get organization analytics

### Users
- `GET /api/users` - Get all users (filtered by role)
- `POST /api/users` - Create user
- `POST /api/users/bulk` - Bulk create users
- `PUT /api/users/:id/password` - Reset password
- `GET /api/users/dashboard/stats` - Get dashboard statistics

## Role Permissions

### Super Admin
- View all organizations, users, and tasks
- Create/edit/delete tasks for any organization
- Assign tasks to any user
- View organization-wise analytics

### Organization
- View and manage organization profile
- Create, update, and delete tasks
- View all organization members
- Invite or upload members in bulk
- Reset member passwords (for members they created)

### Member
- View all tasks in their organization
- Create tasks
- Update task status
- Edit/delete tasks they created
- View task details (created by, assigned to, status, time)

## Project Structure

```
TaskTest/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   ├── organizationController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Organization.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── tasks.js
│   │   ├── organizations.js
│   │   └── users.js
│   ├── scripts/
│   │   └── createSuperAdmin.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Development

- Backend uses nodemon for auto-reload
- Frontend uses Vite for fast HMR
- CORS is enabled for development
- API proxy configured in Vite config

## License

MIT

