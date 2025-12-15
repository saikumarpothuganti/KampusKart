#!/bin/bash

# KampusKart Project Setup Script
# This script sets up both frontend and backend with all dependencies

echo "🚀 KampusKart Setup Script"
echo "=============================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

echo -e "${BLUE}✓ Node.js version: $(node --version)${NC}"
echo -e "${BLUE}✓ npm version: $(npm --version)${NC}"
echo ""

# Backend Setup
echo -e "${BLUE}Setting up Backend...${NC}"
cd server

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env file from .env.example${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please fill in your .env file with actual credentials${NC}"
    echo -e "${YELLOW}   1. MONGODB_URI - MongoDB Atlas connection string${NC}"
    echo -e "${YELLOW}   2. JWT_SECRET - Your JWT secret${NC}"
    echo -e "${YELLOW}   3. Cloudinary credentials${NC}"
    echo ""
fi

echo -e "${BLUE}Installing backend dependencies...${NC}"
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend setup complete${NC}"
else
    echo -e "${YELLOW}✗ Failed to install backend dependencies${NC}"
    exit 1
fi

echo ""

# Frontend Setup
echo -e "${BLUE}Setting up Frontend...${NC}"
cd ../client

echo -e "${BLUE}Installing frontend dependencies...${NC}"
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend setup complete${NC}"
else
    echo -e "${YELLOW}✗ Failed to install frontend dependencies${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo "Next steps:"
echo "1. Fill in your .env file in server/ directory"
echo "2. Run backend: cd server && npm run dev"
echo "3. Run frontend: cd client && npm run dev"
echo ""
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "See QUICKSTART.md for more information"
