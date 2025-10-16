# DineFund - Quick Setup Guide

Follow these steps to get DineFund up and running on your local machine.

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js (v14+) installed: `node --version`
- ✅ PostgreSQL (v12+) installed: `psql --version`
- ✅ npm installed: `npm --version`

## Step-by-Step Setup

### Step 1: Database Setup

```bash
# Option A: Using createdb command
createdb dinefund

# Option B: Using psql
psql -U postgres
CREATE DATABASE dinefund;
\q
```

### Step 2: Backend Configuration

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your settings
# IMPORTANT: Update these values:
# - DB_PASSWORD: Your PostgreSQL password
# - JWT_SECRET: A random secret key (e.g., use: openssl rand -base64 32)
```

**Edit backend/.env:**
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dinefund
DB_USER=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD_HERE
JWT_SECRET=YOUR_RANDOM_SECRET_KEY_HERE
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

### Step 3: Initialize Database

```bash
# Still in backend directory
npm run init-db
```

You should see: `✅ Database tables created successfully!`

### Step 4: Frontend Configuration

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

The default frontend .env should work as-is:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 5: Start the Application

**Open two terminal windows:**

**Terminal 1 - Backend Server:**
```bash
cd backend
npm run dev
```

Expected output:
```
🚀 DineFund API server running on port 5000
📍 Environment: development
Database connected successfully
```

**Terminal 2 - Frontend App:**
```bash
cd frontend
npm start
```

The app will automatically open at `http://localhost:3000`

## Testing the Application

### Test 1: Create Restaurant Owner Account

1. Go to `http://localhost:3000`
2. Click "Sign Up"
3. Select "Restaurant Owner" from dropdown
4. Fill in the form:
   - Full Name: John Doe
   - Email: owner@example.com
   - Password: password123
5. Click "Create Account"

### Test 2: Add a Restaurant

1. You'll be redirected to the Dashboard
2. Click "Add Restaurant"
3. Fill in restaurant details:
   - Name: The Golden Spoon
   - Cuisine Type: Italian
   - Location: New York, NY
   - Description: A family-owned Italian restaurant...
4. Click "Create Restaurant"

### Test 3: Create a Campaign

1. From Dashboard, click "+ New Campaign"
2. Fill in campaign details:
   - Title: Expansion to Second Location
   - Description: We're raising funds to open our second location...
   - Funding Goal: 50000
   - Interest Rate: 8.5
   - Duration: 12 months
3. Click "Create Campaign"

### Test 4: Create Investor Account

1. Logout (top right)
2. Click "Sign Up"
3. Select "Investor" from dropdown
4. Fill in the form:
   - Full Name: Jane Smith
   - Email: investor@example.com
   - Password: password123
5. Click "Create Account"

### Test 5: Make an Investment

1. Click "Browse Campaigns"
2. Find the campaign you created
3. Click "View Details"
4. Enter an investment amount (e.g., 1000)
5. Click "Invest Now"
6. Check "My Investments" to see your portfolio

## Common Issues & Solutions

### Issue: Database connection error
**Solution:** 
- Verify PostgreSQL is running: `pg_isready`
- Check DB credentials in backend/.env
- Ensure database exists: `psql -l | grep dinefund`

### Issue: Port already in use
**Solution:**
```bash
# Find process using port 5000
lsof -i :5000
# Kill the process
kill -9 <PID>
```

### Issue: npm install fails
**Solution:**
```bash
# Clear npm cache
npm cache clean --force
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json
# Reinstall
npm install
```

### Issue: CORS errors
**Solution:**
- Ensure backend is running on port 5000
- Verify CLIENT_URL in backend/.env is http://localhost:3000
- Check frontend .env has correct API URL

## Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run init-db` - Initialize database tables

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## API Testing with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User",
    "role": "investor"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Campaigns
```bash
curl http://localhost:5000/api/campaigns
```

## Next Steps

1. ✅ Application is running
2. 📝 Review the PRD in `prd.txt`
3. 🎨 Customize the UI colors and branding
4. 🔐 Add payment gateway integration
5. 📧 Implement email notifications
6. 🚀 Deploy to production

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in backend
2. Update database credentials for production DB
3. Build frontend: `npm run build`
4. Use a process manager like PM2 for backend
5. Set up reverse proxy with Nginx
6. Enable HTTPS with SSL certificates
7. Set up proper environment variables

## Support

If you encounter any issues:
1. Check the console for error messages
2. Review the logs in terminal
3. Verify all environment variables are set correctly
4. Ensure PostgreSQL is running and accessible

---

Happy coding! 🚀
