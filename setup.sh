#!/bin/bash

# CyberGuard AI - Quick Setup Script
# This script helps you get started quickly

echo "🛡️  CyberGuard AI - Quick Setup"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed. Docker is recommended for databases."
    echo "   You can install it from: https://docs.docker.com/get-docker/"
    echo "   Or continue with manual database setup."
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "⚠️  Python 3 is not installed. It's needed for ML service (Week 5+)."
else
    echo "✅ Python version: $(python3 --version)"
fi

echo ""
echo "📦 Setting up project..."
echo ""

# Backend setup
echo "1️⃣  Setting up Backend..."
cd backend
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "   ✅ Created backend/.env file"
else
    echo "   ⚠️  backend/.env already exists"
fi

echo "   📥 Installing backend dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo "   ✅ Backend dependencies installed"
else
    echo "   ❌ Failed to install backend dependencies"
    exit 1
fi

cd ..

# Frontend setup
echo ""
echo "2️⃣  Setting up Frontend..."
cd frontend
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "   ✅ Created frontend/.env file"
else
    echo "   ⚠️  frontend/.env already exists"
fi

echo "   📥 Installing frontend dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo "   ✅ Frontend dependencies installed"
else
    echo "   ❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..

# ML Service setup (optional for Week 1)
echo ""
echo "3️⃣  Setting up ML Service (optional for now)..."
if command -v pip3 &> /dev/null; then
    cd ml-service
    echo "   📥 Installing Python dependencies..."
    pip3 install -r requirements.txt
    if [ $? -eq 0 ]; then
        echo "   ✅ ML service dependencies installed"
    else
        echo "   ⚠️  Some ML dependencies failed. You can skip this for Week 1."
    fi
    cd ..
else
    echo "   ⚠️  pip3 not found. Skipping ML service setup for now."
fi

# Create logs directory
echo ""
echo "4️⃣  Creating directories..."
mkdir -p backend/logs
mkdir -p ml-service/models
echo "   ✅ Directories created"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Start databases (if using Docker):"
echo "   docker-compose up -d mongodb postgres redis influxdb"
echo ""
echo "2. Start backend (in a new terminal):"
echo "   cd backend && npm run dev"
echo ""
echo "3. Start frontend (in another terminal):"
echo "   cd frontend && npm start"
echo ""
echo "4. Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo "   API Docs: http://localhost:5000/health"
echo ""
echo "📖 Read the Week 1 Guide for detailed instructions:"
echo "   docs/WEEK_1_GUIDE.md"
echo ""
echo "🚀 Happy coding!"
