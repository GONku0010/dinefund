#!/bin/bash

echo "🍽️  DineFund Setup Script"
echo "=========================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL is not installed. Please install PostgreSQL first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js version: $(node --version)${NC}"
echo -e "${GREEN}✅ npm version: $(npm --version)${NC}"
echo -e "${GREEN}✅ PostgreSQL installed${NC}"
echo ""

# Backend setup
echo -e "${YELLOW}📦 Setting up backend...${NC}"
cd backend

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit backend/.env with your database credentials${NC}"
    echo -e "${YELLOW}   Update DB_PASSWORD and JWT_SECRET${NC}"
fi

npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install backend dependencies${NC}"
    exit 1
fi

cd ..

# Frontend setup
echo ""
echo -e "${YELLOW}📦 Setting up frontend...${NC}"
cd frontend

if [ ! -f ".env" ]; then
    cp .env.example .env
fi

npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
    exit 1
fi

cd ..

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your database credentials"
echo "2. Create database: createdb dinefund"
echo "3. Initialize database: cd backend && npm run init-db"
echo "4. Start backend: cd backend && npm run dev"
echo "5. Start frontend: cd frontend && npm start"
echo ""
echo "See SETUP_GUIDE.md for detailed instructions."
