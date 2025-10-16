# DineFund - Quick Reference Card

## 🚀 Quick Start Commands

```bash
# Setup (one-time)
createdb dinefund
cd backend && npm install && npm run init-db
cd ../frontend && npm install

# Start Development
# Terminal 1
cd backend && npm run dev

# Terminal 2  
cd frontend && npm start
```

## 🔑 Test Accounts

### Restaurant Owner
```
Email: owner@example.com
Password: password123
Role: restaurant_owner
```

### Investor
```
Email: investor@example.com
Password: password123
Role: investor
```

## 📡 API Quick Reference

### Base URL
```
http://localhost:5000/api
```

### Authentication
```bash
# Register
POST /auth/register
Body: { email, password, full_name, role }

# Login
POST /auth/login
Body: { email, password }

# Get Profile
GET /auth/me
Headers: { Authorization: "Bearer <token>" }
```

### Campaigns
```bash
# List all campaigns
GET /campaigns?status=active&cuisine_type=Italian

# Get campaign details
GET /campaigns/:id

# Create campaign (owner only)
POST /campaigns
Headers: { Authorization: "Bearer <token>" }
Body: { restaurant_id, title, description, funding_goal, interest_rate, duration_months }
```

### Investments
```bash
# Create investment (investor only)
POST /investments
Headers: { Authorization: "Bearer <token>" }
Body: { campaign_id, amount }

# Get my investments
GET /investments/my-investments
Headers: { Authorization: "Bearer <token>" }
```

## 🗂️ Project Structure

```
dinefund/
├── backend/          # Node.js API
│   ├── routes/       # API endpoints
│   ├── middleware/   # Auth, validation
│   ├── config/       # Database config
│   └── server.js     # Entry point
├── frontend/         # React app
│   ├── src/
│   │   ├── pages/    # Page components
│   │   ├── components/ # Reusable components
│   │   ├── context/  # State management
│   │   └── services/ # API client
│   └── public/
└── docs/            # Documentation
```

## 🎯 User Flows

### Restaurant Owner Flow
```
Register → Dashboard → Add Restaurant → Create Campaign → Track Progress
```

### Investor Flow
```
Register → Browse Campaigns → View Details → Invest → Track Portfolio
```

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=5000
DB_NAME=dinefund
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🐛 Common Issues

### Database Connection Error
```bash
# Check PostgreSQL is running
pg_isready

# Verify database exists
psql -l | grep dinefund

# Recreate if needed
dropdb dinefund
createdb dinefund
cd backend && npm run init-db
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>

# Or use different port in backend/.env
PORT=5001
```

### CORS Error
```bash
# Verify backend is running
curl http://localhost:5000/health

# Check CLIENT_URL in backend/.env
CLIENT_URL=http://localhost:3000
```

## 📊 Database Schema Quick View

```sql
users (id, email, password_hash, role, full_name)
  ↓
restaurants (id, owner_id, name, cuisine_type, location)
  ↓
campaigns (id, restaurant_id, title, funding_goal, current_funding, interest_rate)
  ↓
investments (id, campaign_id, investor_id, amount)
```

## 🎨 Key Components

### Frontend
- `<Navbar />` - Navigation bar
- `<CampaignCard />` - Campaign preview card
- `<AuthContext />` - Authentication state
- Protected routes for role-based access

### Backend
- `auth.js` middleware - JWT verification
- `requireRole()` - Role-based authorization
- Database connection pooling
- Input validation with express-validator

## 📝 Useful Commands

```bash
# Backend
npm run dev          # Start with nodemon
npm run init-db      # Initialize database
npm start            # Production start

# Frontend
npm start            # Development server
npm run build        # Production build
npm test             # Run tests

# Database
psql dinefund        # Connect to database
\dt                  # List tables
\d users             # Describe users table
```

## 🔍 Testing Checklist

- [ ] Register restaurant owner account
- [ ] Create restaurant profile
- [ ] Create funding campaign
- [ ] Register investor account
- [ ] Browse campaigns with filters
- [ ] View campaign details
- [ ] Make investment
- [ ] Check investment portfolio
- [ ] Verify funding progress updates
- [ ] Test responsive design on mobile

## 📈 Key Metrics to Monitor

- Total campaigns created
- Total funding raised
- Number of active investors
- Average investment amount
- Campaign success rate
- User registration rate

## 🚀 Deployment Checklist

- [ ] Set NODE_ENV=production
- [ ] Update database to production instance
- [ ] Set strong JWT_SECRET
- [ ] Build frontend: `npm run build`
- [ ] Configure reverse proxy (Nginx)
- [ ] Enable HTTPS/SSL
- [ ] Set up monitoring (PM2, logs)
- [ ] Configure backups
- [ ] Set up CI/CD pipeline

## 📚 Documentation Files

- `README.md` - Main documentation
- `SETUP_GUIDE.md` - Detailed setup instructions
- `PROJECT_SUMMARY.md` - Technical overview
- `prd.txt` - Product requirements
- `QUICK_REFERENCE.md` - This file

## 💡 Tips

1. **Always start backend before frontend**
2. **Check console for errors** - Both browser and terminal
3. **Use browser DevTools** - Network tab for API calls
4. **Test with different roles** - Owner vs Investor
5. **Clear localStorage** - If auth issues occur

## 🎯 Next Steps

1. ✅ Get app running locally
2. 📝 Customize branding and colors
3. 🔐 Add payment gateway (Stripe)
4. 📧 Implement email notifications
5. 📊 Add advanced analytics
6. 🚀 Deploy to production

---

**Quick Help**: See SETUP_GUIDE.md for detailed instructions
**Full Docs**: See README.md for complete documentation
