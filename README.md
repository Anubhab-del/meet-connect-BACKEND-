# MeetConnect Backend API 🚀

> RESTful API for MeetConnect — A Mock Interview Scheduling Platform built with Node.js, Express and MongoDB.

![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express-4.18.2-000000?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)
![Render](https://img.shields.io/badge/Deployed-Render-46E3B7?style=for-the-badge&logo=render)

---

## 🌐 Live API
```
https://meet-connect-backend-nz6c.onrender.com
```

Health check:
```
https://meet-connect-backend-nz6c.onrender.com/
```

Expected response:
```json
{ "message": "MeetConnect API is running 🚀" }
```

---

## 📁 Folder Structure
```
meetconnect-server/
├── controllers/
│   ├── authController.js        # Register and Login logic
│   ├── interviewController.js   # Interview CRUD operations
│   ├── practiceController.js    # Questions and Blogs data
│   └── userController.js        # Profile get and update
├── middleware/
│   └── authMiddleware.js        # JWT protect middleware
├── models/
│   ├── User.js                  # User Mongoose schema
│   └── Interview.js             # Interview Mongoose schema
├── routes/
│   ├── authRoutes.js            # /api/auth
│   ├── interviewRoutes.js       # /api/interviews
│   ├── practiceRoutes.js        # /api/practice
│   └── userRoutes.js            # /api/users
├── .env                         # Environment variables
├── package.json
└── server.js                    # Express app entry point
```

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | /api/auth/register | Register new user | ❌ |
| POST | /api/auth/login | Login user | ❌ |

### Interviews
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | /api/interviews | Schedule interview | ✅ |
| GET | /api/interviews/upcoming | Get upcoming interviews | ✅ |
| GET | /api/interviews/completed | Get completed interviews | ✅ |
| PUT | /api/interviews/:id | Update interview | ✅ |
| DELETE | /api/interviews/:id | Cancel interview | ✅ |

### Practice
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | /api/practice/questions | Get paginated questions | ✅ |
| GET | /api/practice/blogs | Get blog links | ✅ |

### Users
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | /api/users/profile | Get user profile | ✅ |
| PUT | /api/users/profile | Update user profile | ✅ |

---

## ⚙️ Local Setup

### 1. Install Dependencies
```bash
cd meetconnect-server
npm install
```

### 2. Create `.env` file
```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key_here
PORT=5000
```

### 3. Start Development Server
```bash
npm run dev
```

Server runs on:
```
http://localhost:5000
```

---

## 🚀 Deployment on Render
```
Root Directory  → meetconnect-server
Build Command   → npm install
Start Command   → node server.js
```

### Environment Variables on Render
```
MONGO_URI  → your mongodb atlas uri
JWT_SECRET → your secret key
PORT       → 5000
```

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 22.x | Runtime |
| Express.js | 4.18.2 | Web Framework |
| MongoDB Atlas | Cloud | Database |
| Mongoose | 8.0.3 | ODM |
| JSON Web Token | 9.0.2 | Authentication |
| Bcryptjs | 2.4.3 | Password Hashing |
| CORS | 2.8.5 | Cross-Origin Requests |
| Dotenv | 16.3.1 | Environment Variables |
| Nodemon | 3.0.2 | Dev Auto-restart |

---

## 🔒 Security

- Passwords hashed with bcryptjs before storing
- JWT tokens expire after 7 days
- All sensitive routes protected with auth middleware
- Environment variables used for all secrets
- CORS configured to allow all origins in production

---

## 👥 Author

Built with ❤️ by **Anubhab Dash**
