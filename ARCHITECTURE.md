# DineFund - System Architecture

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           React Frontend (Port 3000)                  │  │
│  │                                                        │  │
│  │  ├─ Pages (Home, Campaigns, Dashboard, etc.)         │  │
│  │  ├─ Components (Navbar, CampaignCard, etc.)          │  │
│  │  ├─ Context (AuthContext for state)                  │  │
│  │  └─ Services (API client with Axios)                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/HTTPS
                            │ REST API Calls
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         API LAYER                            │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │        Express.js Backend (Port 5000)                 │  │
│  │                                                        │  │
│  │  ├─ Middleware (Auth, CORS, Helmet, Validation)      │  │
│  │  ├─ Routes (Auth, Restaurants, Campaigns, Invest)    │  │
│  │  └─ Config (Database connection)                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ SQL Queries
                            │ Connection Pool
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                         │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           PostgreSQL Database                         │  │
│  │                                                        │  │
│  │  ├─ users (authentication & profiles)                │  │
│  │  ├─ restaurants (restaurant data)                    │  │
│  │  ├─ campaigns (funding campaigns)                    │  │
│  │  └─ investments (investment records)                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Diagrams

### Authentication Flow

```
┌─────────┐         ┌─────────┐         ┌──────────┐
│ Browser │         │ Express │         │ Database │
└────┬────┘         └────┬────┘         └────┬─────┘
     │                   │                    │
     │ POST /auth/login  │                    │
     ├──────────────────>│                    │
     │                   │                    │
     │                   │ Query user by email│
     │                   ├───────────────────>│
     │                   │                    │
     │                   │ Return user data   │
     │                   │<───────────────────┤
     │                   │                    │
     │                   │ Verify password    │
     │                   │ (bcrypt.compare)   │
     │                   │                    │
     │                   │ Generate JWT token │
     │                   │                    │
     │ Return token      │                    │
     │<──────────────────┤                    │
     │                   │                    │
     │ Store in localStorage                  │
     │                   │                    │
```

### Investment Flow

```
┌──────────┐      ┌─────────┐      ┌──────────┐      ┌──────────┐
│ Investor │      │ Frontend│      │  Backend │      │ Database │
└────┬─────┘      └────┬────┘      └────┬─────┘      └────┬─────┘
     │                 │                 │                 │
     │ Click "Invest"  │                 │                 │
     ├────────────────>│                 │                 │
     │                 │                 │                 │
     │                 │ POST /investments                 │
     │                 ├────────────────>│                 │
     │                 │ (with JWT)      │                 │
     │                 │                 │                 │
     │                 │                 │ BEGIN TRANSACTION
     │                 │                 ├────────────────>│
     │                 │                 │                 │
     │                 │                 │ Validate campaign│
     │                 │                 │<────────────────┤
     │                 │                 │                 │
     │                 │                 │ Create investment│
     │                 │                 ├────────────────>│
     │                 │                 │                 │
     │                 │                 │ Update campaign  │
     │                 │                 │ current_funding  │
     │                 │                 ├────────────────>│
     │                 │                 │                 │
     │                 │                 │ COMMIT          │
     │                 │                 │<────────────────┤
     │                 │                 │                 │
     │                 │ Success response│                 │
     │                 │<────────────────┤                 │
     │                 │                 │                 │
     │ Show success    │                 │                 │
     │<────────────────┤                 │                 │
     │                 │                 │                 │
```

## 🗄️ Database Entity Relationship Diagram

```
┌─────────────────────┐
│       USERS         │
├─────────────────────┤
│ id (PK)             │
│ email               │
│ password_hash       │
│ role                │◄────┐
│ full_name           │     │
│ phone               │     │
│ created_at          │     │
└─────────────────────┘     │
         │                  │
         │ 1                │ 1
         │                  │
         │ owner_id         │ investor_id
         │                  │
         │ *                │ *
         ▼                  │
┌─────────────────────┐     │
│    RESTAURANTS      │     │
├─────────────────────┤     │
│ id (PK)             │     │
│ owner_id (FK)       │     │
│ name                │     │
│ cuisine_type        │     │
│ location            │     │
│ description         │     │
│ image_url           │     │
└─────────────────────┘     │
         │                  │
         │ 1                │
         │                  │
         │ restaurant_id    │
         │                  │
         │ *                │
         ▼                  │
┌─────────────────────┐     │
│     CAMPAIGNS       │     │
├─────────────────────┤     │
│ id (PK)             │     │
│ restaurant_id (FK)  │     │
│ title               │     │
│ description         │     │
│ funding_goal        │     │
│ current_funding     │     │
│ interest_rate       │     │
│ duration_months     │     │
│ status              │     │
└─────────────────────┘     │
         │                  │
         │ 1                │
         │                  │
         │ campaign_id      │
         │                  │
         │ *                │
         ▼                  │
┌─────────────────────┐     │
│    INVESTMENTS      │     │
├─────────────────────┤     │
│ id (PK)             │     │
│ campaign_id (FK)    │     │
│ investor_id (FK)    │─────┘
│ amount              │
│ investment_date     │
│ status              │
└─────────────────────┘
```

## 🔐 Authentication Architecture

```
┌────────────────────────────────────────────────────────┐
│                  Authentication Flow                    │
└────────────────────────────────────────────────────────┘

Registration:
  User Input → Validation → Hash Password (bcrypt) 
    → Store in DB → Generate JWT → Return to Client

Login:
  Credentials → Find User → Verify Password (bcrypt.compare)
    → Generate JWT → Return to Client

Protected Routes:
  Request → Extract JWT → Verify Token → Decode User Info
    → Check Role → Allow/Deny Access

JWT Structure:
  {
    id: "user-uuid",
    email: "user@example.com",
    role: "investor" | "restaurant_owner",
    iat: timestamp,
    exp: timestamp
  }
```

## 📡 API Request/Response Flow

```
┌─────────────────────────────────────────────────────────┐
│              Typical API Request Flow                    │
└─────────────────────────────────────────────────────────┘

1. Client Request
   ┌──────────────────────────────────────┐
   │ GET /api/campaigns?status=active     │
   │ Headers:                             │
   │   Authorization: Bearer <JWT>        │
   │   Content-Type: application/json     │
   └──────────────────────────────────────┘
                    │
                    ▼
2. Middleware Chain
   ┌──────────────────────────────────────┐
   │ → CORS Check                         │
   │ → Helmet (Security Headers)          │
   │ → Body Parser                        │
   │ → Auth Middleware (if protected)     │
   │ → Route Handler                      │
   └──────────────────────────────────────┘
                    │
                    ▼
3. Route Handler
   ┌──────────────────────────────────────┐
   │ → Parse Query Parameters             │
   │ → Validate Input                     │
   │ → Build SQL Query                    │
   │ → Execute Query                      │
   │ → Format Response                    │
   └──────────────────────────────────────┘
                    │
                    ▼
4. Database Query
   ┌──────────────────────────────────────┐
   │ SELECT c.*, r.name, ...              │
   │ FROM campaigns c                     │
   │ JOIN restaurants r                   │
   │ WHERE c.status = 'active'            │
   │ ORDER BY c.created_at DESC           │
   └──────────────────────────────────────┘
                    │
                    ▼
5. Response
   ┌──────────────────────────────────────┐
   │ {                                    │
   │   "campaigns": [                     │
   │     {                                │
   │       "id": "uuid",                  │
   │       "title": "...",                │
   │       "funding_goal": 50000,         │
   │       ...                            │
   │     }                                │
   │   ]                                  │
   │ }                                    │
   └──────────────────────────────────────┘
```

## 🎨 Frontend Component Hierarchy

```
App
├── AuthProvider (Context)
│   └── Router
│       ├── Navbar
│       └── Routes
│           ├── Public Routes
│           │   ├── Home
│           │   │   └── CampaignCard (featured)
│           │   ├── Login
│           │   ├── Register
│           │   ├── Campaigns
│           │   │   ├── Filters
│           │   │   └── CampaignCard (list)
│           │   └── CampaignDetail
│           │       └── InvestmentForm
│           │
│           ├── Restaurant Owner Routes (Protected)
│           │   ├── Dashboard
│           │   │   └── RestaurantCard (list)
│           │   ├── CreateRestaurant
│           │   │   └── RestaurantForm
│           │   └── CreateCampaign
│           │       └── CampaignForm
│           │
│           └── Investor Routes (Protected)
│               └── MyInvestments
│                   ├── SummaryCards
│                   └── InvestmentCard (list)
```

## 🔄 State Management Flow

```
┌────────────────────────────────────────────────────────┐
│              AuthContext State Flow                     │
└────────────────────────────────────────────────────────┘

Initial Load:
  App Mount → Check localStorage for token & user
    → Set user state → Render appropriate UI

Login:
  Login Form → API Call → Receive token & user
    → Store in localStorage → Update context state
    → Trigger re-render → Redirect to dashboard

Logout:
  Logout Button → Clear localStorage
    → Clear context state → Redirect to home

Protected Route:
  Route Access → Check isAuthenticated()
    → Check user role → Allow/Redirect
```

## 🚀 Deployment Architecture (Future)

```
┌─────────────────────────────────────────────────────────┐
│                    Production Setup                      │
└─────────────────────────────────────────────────────────┘

Internet
   │
   ▼
┌──────────────┐
│   Cloudflare │ (CDN, DDoS Protection, SSL)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    Nginx     │ (Reverse Proxy, Load Balancer)
└──────┬───────┘
       │
       ├─────────────────┬─────────────────┐
       ▼                 ▼                 ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│  Frontend   │   │   Backend   │   │   Backend   │
│  (Static)   │   │  Instance 1 │   │  Instance 2 │
│   Nginx     │   │     PM2     │   │     PM2     │
└─────────────┘   └──────┬──────┘   └──────┬──────┘
                         │                  │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │   PostgreSQL    │
                         │   (Primary)     │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │   PostgreSQL    │
                         │   (Replica)     │
                         └─────────────────┘
```

## 📊 Performance Considerations

### Database Optimization
```
- Indexed foreign keys (owner_id, restaurant_id, etc.)
- Connection pooling (max 20 connections)
- Prepared statements (SQL injection prevention)
- Efficient JOINs for related data
- Aggregate queries for statistics
```

### API Optimization
```
- Stateless JWT authentication (no session storage)
- Response compression (can be added)
- Rate limiting (can be added)
- Caching headers (can be added)
- Pagination (ready to implement)
```

### Frontend Optimization
```
- Code splitting (React.lazy ready)
- Component memoization (React.memo ready)
- Lazy loading images
- Optimized re-renders
- Minified production build
```

## 🔒 Security Layers

```
┌────────────────────────────────────────────────────────┐
│                   Security Stack                        │
└────────────────────────────────────────────────────────┘

Layer 1: Network
  - HTTPS/SSL encryption
  - CORS policy
  - Rate limiting

Layer 2: Application
  - Helmet.js security headers
  - Input validation (express-validator)
  - XSS protection
  - SQL injection prevention

Layer 3: Authentication
  - JWT tokens (7-day expiry)
  - Password hashing (bcrypt, 10 rounds)
  - Role-based access control

Layer 4: Database
  - Parameterized queries
  - Connection pooling
  - Encrypted connections
  - Regular backups
```

---

This architecture is designed to be:
- **Scalable**: Can handle growth in users and data
- **Secure**: Multiple layers of security
- **Maintainable**: Clear separation of concerns
- **Extensible**: Easy to add new features
