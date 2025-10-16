# DineFund - Restaurant Crowdfunding Platform

A full-stack web application that connects local restaurants with investors, enabling community-driven funding for food businesses.

## 🎯 Features

### For Investors
- Browse and discover local restaurant campaigns
- Filter by location, cuisine type, and funding status
- View detailed campaign information and restaurant profiles
- Make secure investments with transparent terms
- Track investment portfolio and potential returns
- View investment history and analytics

### For Restaurant Owners
- Create and manage restaurant profiles
- Launch funding campaigns with custom terms
- Set funding goals and interest rates
- Track campaign progress and investor engagement
- Manage multiple restaurants and campaigns

### Core Features
- Secure JWT-based authentication
- Role-based access control (Restaurant Owner vs Investor)
- Real-time funding progress tracking
- Responsive, mobile-first design
- RESTful API architecture

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt, helmet, CORS
- **Validation**: express-validator

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **Styling**: Custom CSS with responsive design

## 📋 Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
cd /Users/gonzalomoal/CascadeProjects/dinefund
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your database credentials
# Update DB_PASSWORD and JWT_SECRET
```

### 3. Database Setup

```bash
# Create PostgreSQL database
createdb dinefund

# Or using psql
psql -U postgres
CREATE DATABASE dinefund;
\q

# Initialize database tables
npm run init-db
```

### 4. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

### 5. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# App runs on http://localhost:3000
```

## 📁 Project Structure

```
dinefund/
├── backend/
│   ├── config/
│   │   └── database.js          # PostgreSQL connection
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js              # Authentication endpoints
│   │   ├── restaurants.js       # Restaurant CRUD operations
│   │   ├── campaigns.js         # Campaign management
│   │   └── investments.js       # Investment operations
│   ├── scripts/
│   │   └── initDatabase.js      # Database initialization
│   ├── .env.example
│   ├── package.json
│   └── server.js                # Express server entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── CampaignCard.js
│   │   ├── context/
│   │   │   └── AuthContext.js   # Authentication state management
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Campaigns.js
│   │   │   ├── CampaignDetail.js
│   │   │   ├── Dashboard.js
│   │   │   ├── CreateRestaurant.js
│   │   │   ├── CreateCampaign.js
│   │   │   └── MyInvestments.js
│   │   ├── services/
│   │   │   └── api.js           # API client with Axios
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── .env.example
│   └── package.json
│
├── prd.txt                       # Product Requirements Document
└── README.md
```

## 🔐 Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dinefund
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Restaurants
- `POST /api/restaurants` - Create restaurant (owner only)
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant details
- `PUT /api/restaurants/:id` - Update restaurant (owner only)
- `GET /api/restaurants/my/restaurants` - Get owner's restaurants

### Campaigns
- `POST /api/campaigns` - Create campaign (owner only)
- `GET /api/campaigns` - Get all campaigns (with filters)
- `GET /api/campaigns/:id` - Get campaign details
- `PUT /api/campaigns/:id` - Update campaign (owner only)
- `GET /api/campaigns/:id/investments` - Get campaign investments

### Investments
- `POST /api/investments` - Create investment (investor only)
- `GET /api/investments/my-investments` - Get user's investments
- `GET /api/investments/stats` - Get investment statistics

## 👥 User Roles

### Restaurant Owner
- Create and manage restaurant profiles
- Launch and manage funding campaigns
- View investor information
- Track funding progress

### Investor
- Browse available campaigns
- Make investments
- Track investment portfolio
- View potential returns

## 🎨 Key Features Implemented

1. **Authentication System**
   - Secure registration and login
   - JWT token-based authentication
   - Role-based access control

2. **Campaign Management**
   - Create campaigns with funding goals
   - Set interest rates and duration
   - Real-time funding progress tracking
   - Campaign status management (active/funded/closed)

3. **Investment System**
   - Secure investment processing
   - Automatic campaign funding updates
   - Investment portfolio tracking
   - Returns calculation

4. **User Experience**
   - Responsive design for all devices
   - Intuitive navigation
   - Real-time feedback
   - Clean, modern UI

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Input validation and sanitization
- SQL injection prevention
- XSS protection with helmet
- CORS configuration

## 🚧 Future Enhancements

- Payment gateway integration (Stripe/PayPal)
- Email notifications
- Advanced analytics dashboard
- Document upload for business plans
- Social sharing features
- Mobile applications
- Secondary market for investments
- Review and rating system
- Real-time chat between investors and owners

## 📝 Database Schema

### Users
- id, email, password_hash, role, full_name, phone, timestamps

### Restaurants
- id, owner_id, name, cuisine_type, location, address, description, image_url, timestamps

### Campaigns
- id, restaurant_id, title, description, funding_goal, current_funding, interest_rate, duration_months, status, dates

### Investments
- id, campaign_id, investor_id, amount, investment_date, status, timestamps

## 🧪 Testing

To test the application:

1. **Register as Restaurant Owner**
   - Create account with role "restaurant_owner"
   - Add a restaurant
   - Create a funding campaign

2. **Register as Investor**
   - Create account with role "investor"
   - Browse campaigns
   - Make an investment

3. **Verify Features**
   - Check funding progress updates
   - View investment portfolio
   - Test filtering and search

## 📄 License

MIT License

## 👨‍💻 Development

Built with ❤️ for local communities and restaurants.

---

For questions or support, please refer to the PRD document in `prd.txt`.
