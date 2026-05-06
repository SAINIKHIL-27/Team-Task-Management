================================================
TEAM TASK MANAGER — Full Stack Web Application
================================================

LIVE URL:
https://innovative-motivation-production-8e2c.up.railway.app

GITHUB REPO:
https://github.com/SAINIKHIL-27/Team-Task-Management

================================================
PROJECT OVERVIEW
================================================
A production-ready team task management application where users can
create projects, assign tasks, track progress, and manage team members
with role-based access control (Admin/Member).

================================================
KEY FEATURES
================================================
✅ JWT Authentication (Signup / Login / Logout)
✅ Role-based access control (Admin / Member)
✅ Create, update, delete Projects
✅ Add team members to projects
✅ Create tasks with priority levels (Low / Medium / High)
✅ Task status tracking (Todo / In Progress / Completed)
✅ Due dates on tasks
✅ Dashboard with stats: Total, Completed, In Progress, Overdue
✅ Tasks page with filter by status and priority
✅ Fully deployed on Railway + MongoDB Atlas

================================================
TECH STACK
================================================
Frontend:
- React + Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hook Form
- React Hot Toast
- Context API (Auth state)

Backend:
- Node.js
- Express.js
- MongoDB Atlas + Mongoose
- JWT Authentication
- bcryptjs (password hashing)
- CORS

Deployment:
- Frontend: Railway
- Backend: Railway
- Database: MongoDB Atlas (cloud)

================================================
LOCAL SETUP INSTRUCTIONS
================================================

1. Clone the repository:
   git clone https://github.com/SAINIKHIL-27/team-task-manager.git
   cd team-task-manager

2. Setup Backend:
   cd server
   npm install
   Create a .env file with:
     PORT=5000
     MONGO_URI=mongodb+srv://dharamsainikhil_db_user:xxxxxxxxx@cluster0.j7ao7ic.mongodb.net/teamtasks?appName=Cluster0
     JWT_SECRET=xxxxxxxxxxxxxxxxxxxxxxx26cf1a318b27d7764cf2a72320439c1713
     CLIENT_URL=https://innovative-motivation-production-8e2c.up.railway.app
   npm run dev

3. Setup Frontend:
   cd client
   npm install
   npm run dev

4. Open browser at: http://localhost:5173

================================================
API ENDPOINTS
================================================

AUTH:
POST   /api/auth/signup     - Register new user
POST   /api/auth/login      - Login user
GET    /api/auth/me         - Get current user (protected)

PROJECTS:
GET    /api/projects        - Get all projects for user
POST   /api/projects        - Create new project
GET    /api/projects/:id    - Get single project
PUT    /api/projects/:id    - Update project
DELETE /api/projects/:id    - Delete project
POST   /api/projects/:id/members - Add member to project

TASKS:
GET    /api/tasks           - Get all tasks (with optional filters)
POST   /api/tasks           - Create new task
PUT    /api/tasks/:id       - Update task (status, priority, etc.)
DELETE /api/tasks/:id       - Delete task

DASHBOARD:
GET    /api/dashboard       - Get stats (totals, overdue, my tasks)

================================================
ENVIRONMENT VARIABLES
================================================

Backend (server/.env):
  PORT=5000
  MONGO_URI=mongodb+srv://dharamsainikhil_db_user:xxxxxxxxx@cluster0.j7ao7ic.mongodb.net/teamtasks?appName=Cluster0
  JWT_SECRET=xxxxxxxxxxxxxxx39725d26cf1a318b27d7764cf2a72320439c1713
  CLIENT_URL=https://innovative-motivation-production-8e2c.up.railway.app

Frontend (Railway Variables):
  VITE_API_URL=https://team-task-management-production-0e06.up.railway.app/api

================================================
DEPLOYMENT
================================================
- Backend deployed on Railway (Root Dir: server)
- Frontend deployed on Railway (Root Dir: client)
- Database hosted on MongoDB Atlas (Free Tier)
- Both services connected via environment variables

================================================
TEST CREDENTIALS (for demo)
================================================
You can sign up directly on the live app.
Recommended: Create one Admin account + one Member account
to demonstrate role-based features.

================================================
FOLDER STRUCTURE
================================================

team-task-manager/
├── client/                  (React Frontend)
│   ├── src/
│   │   ├── api/axios.js
│   │   ├── components/layout/
│   │   ├── context/AuthContext.jsx
│   │   └── pages/
│   └── package.json
│
├── server/                  (Express Backend)
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/db.js
│   └── server.js
│
└── README.txt
