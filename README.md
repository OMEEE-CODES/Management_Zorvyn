# Finance Data Processing and Access Control Backend

A RESTful backend for a finance dashboard system where users interact with financial records based on their role. Built with Node.js, Express, and MongoDB.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** express-validator + Mongoose schema validation

## Project Structure

```
src/
├── config/         # Database connection, role/permission definitions
├── controllers/    # Route handlers (thin layer, delegates to services)
├── middleware/      # Auth, authorization, validation, error handling
├── models/         # Mongoose schemas (User, Record)
├── routes/         # Express route definitions
├── services/       # Business logic layer
└── utils/          # Seed script
```

## Architecture & Design Decisions

- **Separation of Concerns:** Routes → Controllers → Services → Models. Controllers are thin; business logic lives in services.
- **Role-Based Access Control:** A permission matrix in `config/roles.js` maps each role (viewer, analyst, admin) to allowed actions on each resource. The `authorize` middleware checks this before every route.
- **Centralized Error Handling:** All errors flow through a single `errorHandler` middleware that formats Mongoose validation errors, duplicate key errors, and cast errors consistently.
- **Pagination:** All list endpoints support `page` and `limit` query parameters.
- **Filtering:** Records can be filtered by `type`, `category`, `startDate`, and `endDate`.

## Roles & Permissions

| Action                  | Viewer | Analyst | Admin |
|-------------------------|--------|---------|-------|
| View records            | Yes    | Yes     | Yes   |
| Create/Update/Delete records | No | No    | Yes   |
| View dashboard summary  | Yes    | Yes     | Yes   |
| View monthly trends     | No     | Yes     | Yes   |
| Manage users            | No     | No      | Yes   |

## Setup

### Prerequisites

- Node.js (v18+)
- MongoDB (running locally or a connection URI)

### Installation

```bash
npm install
```

### Configuration

Copy `.env.example` to `.env` and update values if needed:

```bash
cp .env.example .env
```

Environment variables:
- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing (change in production)
- `JWT_EXPIRES_IN` - Token expiry duration (default: 24h)

### Seed Database

```bash
npm run seed
```

This creates three test users and 15 sample financial records.

**Test Credentials:**
| Role    | Email               | Password     |
|---------|---------------------|--------------|
| Admin   | admin@example.com   | password123  |
| Analyst | analyst@example.com | password123  |
| Viewer  | viewer@example.com  | password123  |

### Start Server

```bash
npm start
```

Server runs at `http://localhost:3000`.

## API Endpoints

### Authentication

| Method | Endpoint          | Description         | Auth Required |
|--------|-------------------|---------------------|---------------|
| POST   | /api/auth/register | Register new user  | No            |
| POST   | /api/auth/login    | Login              | No            |
| GET    | /api/auth/profile  | Get current user   | Yes           |

### Users (Admin only)

| Method | Endpoint        | Description       | Query Params          |
|--------|-----------------|-------------------|-----------------------|
| GET    | /api/users      | List all users    | page, limit, role, isActive |
| GET    | /api/users/:id  | Get user by ID    |                       |
| PATCH  | /api/users/:id  | Update user       |                       |
| DELETE | /api/users/:id  | Delete user       |                       |

### Financial Records

| Method | Endpoint          | Description          | Access       | Query Params                              |
|--------|-------------------|----------------------|--------------|--------------------------------------------|
| GET    | /api/records      | List records         | All roles    | page, limit, type, category, startDate, endDate, sortBy, order |
| GET    | /api/records/:id  | Get record by ID     | All roles    |                                            |
| POST   | /api/records      | Create record        | Admin        |                                            |
| PATCH  | /api/records/:id  | Update record        | Admin        |                                            |
| DELETE | /api/records/:id  | Delete record        | Admin        |                                            |

**Record fields:** `amount` (number), `type` ("income"/"expense"), `category` (enum), `date` (ISO date), `description` (optional string)

**Categories:** salary, investment, freelance, rent, utilities, food, transport, healthcare, entertainment, education, other

### Dashboard

| Method | Endpoint              | Description              | Access          |
|--------|-----------------------|--------------------------|-----------------|
| GET    | /api/dashboard/summary    | Total income, expenses, balance | All roles |
| GET    | /api/dashboard/categories | Spending by category     | All roles       |
| GET    | /api/dashboard/recent     | Recent activity          | All roles       |
| GET    | /api/dashboard/trends     | Monthly income/expense trends | Analyst, Admin |

## Example Requests

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "email": "john@example.com", "password": "pass123", "role": "viewer"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "password123"}'
```

### Create Record (Admin)
```bash
curl -X POST http://localhost:3000/api/records \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"amount": 3000, "type": "income", "category": "salary", "date": "2026-04-01", "description": "April salary"}'
```

### Get Records with Filters
```bash
curl "http://localhost:3000/api/records?type=expense&category=rent&startDate=2026-01-01&endDate=2026-03-31&page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

### Dashboard Summary
```bash
curl http://localhost:3000/api/dashboard/summary \
  -H "Authorization: Bearer <token>"
```

## Assumptions

1. **Registration is open:** Any user can register and choose their role. In production, admin role assignment would be restricted.
2. **All records are shared:** All authenticated users can view all records (filtered by role permissions). There is no per-user record ownership restriction for viewing.
3. **Soft delete not implemented:** Records and users are hard-deleted. Soft delete could be added as an enhancement.
4. **Single-tenant system:** The system operates as a single organization's dashboard.

## Error Handling

All error responses follow a consistent format:

```json
{
  "success": false,
  "message": "Description of what went wrong",
  "errors": ["Optional array of specific validation errors"]
}
```

HTTP status codes used:
- `200` - Success
- `201` - Created
- `400` - Validation error / Bad request
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Resource not found
- `409` - Conflict (duplicate resource)
- `500` - Internal server error
