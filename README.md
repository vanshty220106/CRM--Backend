# 🏢 CRM Backend

A production-ready **Customer Relationship Management** backend built with Node.js, Express.js, and MongoDB.

## ✨ Features

- **Controller-Service-Route** architecture with strict separation of concerns
- **JWT Authentication** with bcrypt password hashing
- **Role-Based Access Control** (Admin / Manager / Sales)
- **Joi Validation** on all request bodies
- **Security Hardened** — Helmet, CORS, rate limiting, NoSQL injection protection
- **Centralized Error Handling** with dev/prod modes
- **Pagination, Search & Filtering** on list endpoints

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | Web framework |
| MongoDB + Mongoose | Database + ODM |
| JWT + bcryptjs | Authentication |
| Joi | Request validation |
| Helmet | Security headers |
| express-rate-limit | Rate limiting |
| express-mongo-sanitize | NoSQL injection prevention |

## 📁 Project Structure

```
├── server.js              # Entry point
├── app.js                 # Middleware pipeline + route wiring
├── config/db.js           # MongoDB connection
├── models/
│   ├── User.js            # Staff with RBAC
│   ├── Customer.js        # Client management
│   └── Lead.js            # Sales pipeline
├── middlewares/
│   ├── auth.js            # JWT verification
│   ├── authorize.js       # Role-based access
│   ├── validate.js        # Joi validation factory
│   └── errorHandler.js    # Global error handler
├── validations/
│   ├── authValidation.js
│   └── customerValidation.js
├── services/
│   ├── authService.js
│   └── customerService.js
├── controllers/
│   ├── authController.js
│   └── customerController.js
└── routes/
    ├── authRoutes.js
    └── customerRoutes.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### Installation

```bash
git clone https://github.com/vanshty220106/CRM--Backend.git
cd CRM--Backend
npm install
```

### Configuration

Copy the example env and fill in your values:

```bash
cp .env.example .env
```

Update `.env` with your MongoDB connection string and a strong JWT secret:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/crm_db
JWT_SECRET=your_strong_secret_key
```

### Run

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login & get JWT token |

### Customers

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/customers` | sales, manager, admin | Create customer |
| `GET` | `/api/customers` | Any authenticated | List all (paginated) |
| `GET` | `/api/customers/:id` | Any authenticated | Get single customer |
| `PUT` | `/api/customers/:id` | sales, manager, admin | Update customer |
| `DELETE` | `/api/customers/:id` | manager, admin | Delete customer |

### Health Check

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Server status check |

### Query Parameters (GET /api/customers)

| Param | Example | Description |
|---|---|---|
| `page` | `?page=2` | Page number |
| `limit` | `?limit=10` | Results per page |
| `status` | `?status=active` | Filter by status |
| `search` | `?search=acme` | Search name, email, company |
| `sort` | `?sort=-createdAt` | Sort order |

## 🔐 Role Permissions

| Action | Sales | Manager | Admin |
|---|:---:|:---:|:---:|
| Create customer | ✅ | ✅ | ✅ |
| View customers | ✅ | ✅ | ✅ |
| Update customer | ✅ | ✅ | ✅ |
| Delete customer | ❌ | ✅ | ✅ |

## 📝 License

ISC
