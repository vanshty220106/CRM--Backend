# 🏢 CivicFlow CRM

A production-ready **Civic Grievance Management System** built with Node.js, Express.js, MongoDB, React, Firebase Auth, and Leaflet Maps.

## ✨ Features

- **Dual-Role Dashboard Architecture** (Citizen vs. Admin)
- **Firebase Authentication** mapped securely to local DB tokens.
- **Robust Sync Bridging** guaranteeing JWT token fetching prevents initial sign-up dashboard routing errors.
- **Interactive Map Pinning** using React-Leaflet for location tracking.
- **Real-Time Analytics Dashboard** powered by Recharts (Publicly Accessible).
- **Status Timeline Tracking** keeping Citizens informed of Admin resolutions.
- **Media Uploads** (Multer) for Citizen evidence and Admin proof of resolution.
- **Success Notification Popups** confirming database ingestion explicitly before exiting submission forms.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js / Express.js | Backend Runtime & Framework |
| MongoDB + Mongoose | Database & Aggregations |
| React + Vite + TailwindCSS | Frontend SPA |
| Firebase Auth | Secure Google & Email Authentication |
| React-Leaflet | Geographic Coordinate Mapping |
| Recharts | Analytics Visualizations |
| Framer Motion | UI Animations |

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Firebase Project for Authentication

### Installation

```bash
git clone https://github.com/vanshty220106/CRM--Backend.git
cd CRM--Backend
npm install
cd frontend && npm install
```

### Configuration

Update `.env` in the `backend/` directory:

```env
PORT=5001
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/civicflow
JWT_SECRET=your_strong_secret_key
```

### Run

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

## 🔐 Role Permissions

| Action | Citizen | Admin |
|---|:---:|:---:|
| Submit Complaint | ✅ | ❌ |
| View Personal History | ✅ | ❌ |
| View All Complaints | ❌ | ✅ |
| Update Complaint Status | ❌ | ✅ |
| Upload Resolution Proof | ❌ | ✅ |
| View Public Analytics | ✅ | ✅ |

## 📝 License

ISC
