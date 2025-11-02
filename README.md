# 🔐 MERN Authentication System

A clean, production-ready authentication starter built with the MERN stack (MongoDB, Express, React, Node) and styled with Tailwind CSS. It includes user registration and login flows, secure password handling, and a minimal, easy-to-extend structure so you can get an auth-enabled app up and running quickly.

---

Table of contents
- About
- Features
- Tech stack
- Folder structure
- Getting started
  - Prerequisites
  - Backend setup
  - Frontend setup
- Environment variables
- API routes
- Scripts
- Security notes & recommendations
- Contributing
- License
- Author

---

## About

This repository is a minimal, well-organized example of how to implement authentication in a MERN application. It is intended as a starter template for learning or accelerating real projects where user accounts are required.

---

## Features

- User registration (secure password hashing)
- User login (JWT-based / session-ready)
- Clean separation of frontend and backend
- Tailwind CSS for utility-first styling
- Easy to extend: add email verification, password reset, or OAuth later

---

## Tech stack

- Frontend: React (Vite) + Tailwind CSS + Axios
- Backend: Node.js + Express.js + Mongoose (MongoDB)
- Dev tooling: dotenv, nodemon

---

## Folder structure

Top-level layout used in this project:

mern-auth/
├── backend/
│   ├── controllers/
│   │   └── authController.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── authRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── tailwind.config.js
    ├── package.json
    └── vite.config.js

---

## Getting started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (local or Atlas)

### Backend setup

1. Open a terminal and navigate to the backend folder:
   cd backend

2. Install dependencies:
   npm install

   (If package.json is not present, you can initialize and install)
   npm init -y
   npm install express mongoose dotenv cors bcryptjs jsonwebtoken

3. Create a .env file in backend/ (see Environment variables below).

4. Start the dev server:
   npm run dev

Expected output:
- Server running on http://localhost:5000
- MongoDB connected

> Note: Ensure nodemon is configured in package.json scripts (e.g., "dev": "nodemon server.js").

### Frontend setup

1. Open a terminal and navigate to the frontend folder:
   cd frontend

2. If the project was scaffolded with Vite, install dependencies:
   npm install

3. Install Tailwind and init if needed:
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p

4. Configure tailwind.config.js (example provided below):

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
}

5. Import Tailwind directives into src/index.css:
@tailwind base;
@tailwind components;
@tailwind utilities;

6. Start the dev server:
   npm run dev

Expected output:
VITE vX.X.X ready in XXX ms
➜ Local: http://localhost:5173/

---

## Environment variables

Create a .env in backend/ with these example values:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

Keep .env out of version control and use secure secrets for production deployments.

---

## API routes

Base: http://localhost:5000 (default)

- POST /api/register
  - Registers a new user.
  - Body: { name, email, password }
  - Response: newly created user (without password) or error

- POST /api/login
  - Authenticates a user and returns a token (or session).
  - Body: { email, password }
  - Response: { token, user } or error

(Adjust endpoints and responses to match your implementation — e.g., return JWT or set HttpOnly cookie.)

---

## Scripts

Suggested scripts in package.json

Backend package.json scripts:
- "start": "node server.js"
- "dev": "nodemon server.js"

Frontend package.json scripts (Vite default):
- "dev": "vite"
- "build": "vite build"
- "preview": "vite preview"

---

## Security notes & recommendations

- Always hash passwords (bcrypt) — do not store plaintext passwords.
- Use HTTPS in production.
- Store JWTs in secure, HttpOnly cookies to mitigate XSS risks, or use secure storage with proper CSRF protections.
- Validate and sanitize incoming data on the backend.
- Rate-limit auth endpoints to slow brute-force attempts.
- Rotate and protect your JWT secret and DB credentials (use managed secrets where possible).

---

## Contributing

Contributions, issues, and feature requests are welcome. To contribute:
1. Fork the repo
2. Create a branch (feature/your-feature)
3. Make your changes
4. Open a pull request with a clear description of changes

---

## License

This project is provided as-is. Add an appropriate license (MIT recommended) if you intend to share it publicly.

---

## Author

Shahid Shaikh  
MERN Stack Developer | Web Developer | AI %ML  
Pune, India

- GitHub: https://github.com/Shahid9370
- LinkedIn:https://www.linkedin.com/in/shahid-shaikh-developer/

---

## Next goals (Roadmap)

- Day 4: Connect frontend Login/Register → MongoDB through Express API (complete)
- Add JWT refresh tokens & cookie-based auth
- Add email verification and password reset
- Add role-based access controls and user profiles

---