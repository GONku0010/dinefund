# Railway Deployment Guide for DineFund

## 🚂 Deploying to Railway

This guide will help you deploy the DineFund backend API to Railway.

## 📋 Prerequisites

1. Railway account (sign up at https://railway.app)
2. PostgreSQL database on Railway
3. GitHub repository (already done: https://github.com/GONku0010/dinefund)

## 🗄️ Step 1: Create PostgreSQL Database

1. Go to https://railway.app/new
2. Click **"New Project"**
3. Select **"Provision PostgreSQL"**
4. Wait for the database to be created
5. Click on the PostgreSQL service
6. Go to **"Variables"** tab
7. Copy these variables (you'll need them):
   - `DATABASE_URL` (or individual: `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`)

## 🚀 Step 2: Deploy Backend API

### Option A: Deploy from GitHub (Recommended)

1. In the same Railway project, click **"New"** → **"GitHub Repo"**
2. Select your repository: **GONku0010/dinefund**
3. Railway will detect the configuration files

### Option B: Deploy with Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# Deploy
railway up
```

## ⚙️ Step 3: Configure Environment Variables

In your Railway backend service:

1. Go to **"Variables"** tab
2. Add these variables:

```
NODE_ENV=production
PORT=5000
JWT_SECRET=your_secure_random_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=https://your-frontend-url.com

# Database (use Railway's PostgreSQL variables)
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
```

**Note**: Railway can auto-reference PostgreSQL variables using `${{Postgres.VARIABLE_NAME}}`

## 🗃️ Step 4: Initialize Database

After deployment, you need to create the database tables:

### Option 1: Using Railway CLI
```bash
railway run npm run init-db
```

### Option 2: Using Railway Shell
1. Go to your backend service in Railway
2. Click **"Settings"** → **"Deploy"**
3. Open the shell and run:
```bash
cd backend && npm run init-db
```

### Option 3: Manual SQL Execution
1. Connect to your PostgreSQL database
2. Run the SQL from `backend/scripts/initDatabase.js` manually

## 🌐 Step 5: Get Your API URL

1. Go to your backend service in Railway
2. Click **"Settings"** → **"Networking"**
3. Click **"Generate Domain"**
4. Your API will be available at: `https://your-app.up.railway.app`

## 🎨 Step 6: Deploy Frontend (Optional)

For the frontend, you have several options:

### Option A: Vercel (Recommended for React)
```bash
cd frontend
npm install -g vercel
vercel
```

### Option B: Netlify
1. Go to https://app.netlify.com
2. Drag and drop the `frontend` folder
3. Set build command: `npm run build`
4. Set publish directory: `build`

### Option C: Railway (Static Site)
1. Create a new service in Railway
2. Deploy from the same GitHub repo
3. Set root directory to `frontend`
4. Set build command: `npm run build`
5. Set start command: `npx serve -s build -l $PORT`

## 🔧 Configuration Files Created

The following files have been added for Railway deployment:

- **`railway.json`** - Railway configuration
- **`nixpacks.toml`** - Build configuration

## ✅ Verify Deployment

Test your API:
```bash
curl https://your-app.up.railway.app/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "DineFund API is running"
}
```

## 🔐 Important Security Notes

1. **Never commit `.env` files** - Already in .gitignore
2. **Use strong JWT_SECRET** - Generate with: `openssl rand -base64 32`
3. **Set NODE_ENV=production** in Railway
4. **Enable CORS** only for your frontend domain
5. **Use HTTPS** (Railway provides this automatically)

## 📊 Monitoring

Railway provides:
- **Logs**: View in the "Deployments" tab
- **Metrics**: CPU, Memory, Network usage
- **Alerts**: Set up in project settings

## 🐛 Troubleshooting

### Build Fails
- Check that `nixpacks.toml` and `railway.json` are in the root directory
- Verify all dependencies are in `package.json`
- Check Railway build logs

### Database Connection Error
- Verify PostgreSQL service is running
- Check database environment variables
- Ensure database is initialized (run init-db script)

### Port Issues
- Railway automatically sets `PORT` environment variable
- Backend uses `process.env.PORT || 5000`

### CORS Errors
- Update `CLIENT_URL` in Railway environment variables
- Ensure frontend URL is correct

## 💰 Cost Estimate

Railway Pricing:
- **Hobby Plan**: $5/month (includes $5 credit)
- **PostgreSQL**: ~$5-10/month
- **Backend API**: Based on usage

## 🔄 Continuous Deployment

Railway automatically deploys when you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Railway will automatically deploy
```

## 📚 Additional Resources

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Nixpacks Docs: https://nixpacks.com

---

Need help? Check the Railway logs or contact support!
