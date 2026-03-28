# 🏛️ CivicFlow — Civic Grievance Management System

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/License-ISC-blue?style=for-the-badge" />
</p>

A full-stack, production-ready **civic complaint tracking platform** where citizens can report public issues and track their resolution in real time — just like a delivery tracker. Admins manage, update, and resolve complaints with proof uploads. Built with Node.js, Express.js, MongoDB (with local file fallback), React, Firebase Auth, and Leaflet Maps.

---

## ✨ Feature Highlights

### 👤 Citizen Experience
- **Submit Complaints** with category, description, pin-on-map location, and photo evidence
- **Full-Page Success Screen** after submission with "Track My Complaint" and "Submit Another" action buttons
- **Delivery-Style Complaint Tracker** — animated step-by-step progress bar, color-coded status badges, and live admin message updates
- **My Complaints Dashboard** — filterable stats (Total / Active / Resolved), expandable complaint cards

### 🛡️ Admin Experience
- **Admin Operations Hub** — see all citizen complaints in one place with search + filter
- **Quick-Update Buttons** — one click to change status directly from the complaint card
- **Full Update Panel** — pick status from visual grid buttons, add a message, upload proof image
- **Real-Time UI Update** — status changes reflect instantly without page refresh
- **Refresh Button** to re-fetch the latest complaints

### 🔐 Authentication & Security
- **Dual-Role System** — Citizen and Admin roles with strict route protection
- **Firebase Auth** (Email/Password + Google OAuth) bridged to backend JWT
- **Double-Confirmation Logout** — 2-step modal prevents accidental sign-outs (step indicator, spinner)
- **JWT Auth Middleware** with secure token verification

### 🗄️ Smart Database Fallback
- **Auto-detects MongoDB Atlas availability** on startup
- **Local JSON File Storage** (`backend/data/`) kicks in automatically if Atlas is unreachable (e.g., IP not whitelisted)
- **Navbar badge** shows `Local Mode` 🟡 or `Atlas Live` 🟢 so you always know the DB state
- **Zero code changes needed** — same API, same routes, same experience

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend Runtime** | Node.js v18+ / Express.js |
| **Primary Database** | MongoDB Atlas + Mongoose |
| **Fallback Database** | Local JSON file store (`localDb.js`) |
| **Frontend** | React 18 + Vite |
| **Styling** | TailwindCSS v4 |
| **Authentication** | Firebase Auth (Google + Email) |
| **Mapping** | React-Leaflet |
| **Analytics** | Recharts |
| **Animations** | Framer Motion |
| **File Uploads** | Multer |
| **HTTP Client** | Axios |

---

## 📁 Project Structure

```
CRM--Backend/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection with retry + fallback
│   ├── controllers/
│   │   ├── authController.js
│   │   └── complaintController.js
│   ├── data/                  # 📁 Local JSON storage (auto-created, git-ignored)
│   │   ├── complaints.json
│   │   └── users.json
│   ├── middlewares/
│   │   ├── auth.js            # JWT verification + fallback
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   └── Complaint.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── complaintRoutes.js
│   ├── services/
│   │   └── authService.js
│   ├── utils/
│   │   ├── dbAdapter.js       # Transparent Atlas ↔ local DB proxy
│   │   └── localDb.js         # Full JSON file-based DB engine
│   ├── .env                   # ← Not committed (see .env.example)
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── layout/        # Navbar, Sidebar, DashboardLayout
│       │   ├── local/         # AdminDashboard, ComplaintCard, StatusTimeline
│       │   └── ui/            # Button, LogoutModal, Input
│       ├── context/           # AuthContext (Firebase ↔ JWT bridge)
│       ├── pages/
│       │   ├── SubmitComplaint.jsx   # Full success screen + Submit Another
│       │   ├── MyComplaints.jsx      # Delivery-style tracker
│       │   └── Dashboard.jsx
│       └── services/
│           └── complaintService.js
├── package.json               # Monorepo root (concurrently)
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- A [Firebase project](https://console.firebase.google.com) with Email/Password and Google sign-in enabled
- MongoDB Atlas cluster **OR** just run it — local file storage kicks in automatically

### 1. Clone the repo

```bash
git clone https://github.com/vanshty220106/CRM--Backend.git
cd CRM--Backend
```

### 2. Install dependencies

```bash
npm install          # installs root + both workspaces
```

### 3. Configure environment

Create `backend/.env` (copy from `backend/.env.example`):

```env
NODE_ENV=development
PORT=5001

# MongoDB Atlas — leave blank or invalid to use local file storage
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/crm_db?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_strong_random_secret_here
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

Configure Firebase in `frontend/src/firebase/config.js` with your project credentials.

### 4. Run

```bash
npm run dev
```

This starts **both** the backend (port 5001) and frontend (port 5173) simultaneously via `concurrently`.

| URL | Description |
|---|---|
| `http://localhost:5173` | Frontend (React) |
| `http://localhost:5001/api/health` | Backend health check + DB mode |

---

## 🗄️ Database Modes

The backend intelligently handles database availability:

| Scenario | Behaviour |
|---|---|
| Atlas connected ✅ | All data stored in MongoDB Atlas |
| Atlas unreachable ⚠️ | Switches to local JSON files in `backend/data/` |
| IP not whitelisted | Auto-retries 3× then falls back — **server always starts** |

**To enable Atlas:** Go to [MongoDB Atlas](https://cloud.mongodb.com) → Network Access → Add your IP (or `0.0.0.0/0` for development).

The navbar shows a badge indicating the current mode.

---

## 🔐 Role Permissions

| Action | Citizen | Admin |
|---|:---:|:---:|
| Register / Login | ✅ | ✅ |
| Submit Complaint | ✅ | ✅ |
| View Own Complaints + Tracker | ✅ | ❌ |
| View All Complaints | ❌ | ✅ |
| Update Complaint Status | ❌ | ✅ |
| Upload Resolution Proof | ❌ | ✅ |
| View Public Analytics | ✅ | ✅ |

---

## 📡 API Reference

### Auth

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/auth/firebase-sync` | Bridge Firebase user to backend JWT |
| `POST` | `/api/auth/register` | Register email/password user |
| `POST` | `/api/auth/login` | Login and receive JWT |

### Complaints

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/api/complaints` | Public | Get all complaints |
| `GET` | `/api/complaints/stats` | Public | Aggregated stats for dashboard |
| `GET` | `/api/complaints/me` | 🔒 JWT | Get logged-in user's complaints |
| `POST` | `/api/complaints` | 🔒 JWT | Submit a new complaint |
| `PATCH` | `/api/complaints/:id/status` | 🔒 JWT | Admin: update tracking status |

---

## 📸 Key UX Flows

### Citizen — Submit & Track
1. Login → Submit Complaint (with map pin + photo)
2. **Success Screen** appears with complaint title, animated checkmark, and ripple effect
3. Click **"Track My Complaint"** → redirected to **My Complaints**
4. Expandable complaint card shows **delivery-style step tracker** with progress bar

### Admin — Review & Update
1. Login as Admin → **Admin Operations Hub**
2. See all complaints with search + status filter
3. Click **quick-update buttons** to pre-select a new status
4. Expand card → write a message → upload proof (required for "Resolved") → **Apply Update**
5. Citizen sees the change instantly on next visit

### Logout
- Both the sidebar icon and navbar button trigger a **2-step confirmation modal**
- Step 1: "Are you sure?" | Step 2: "Absolutely sure?" with a step indicator

---

## 📝 License

ISC © 2026 CivicFlow
