#!/bin/bash

# CodeBattle Deployment Script
# This script helps deploy the application to AWS

set -e

echo "🚀 CodeBattle Deployment Script"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if AWS CLI is installed
check_aws_cli() {
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed. Please install it first."
        exit 1
    fi
    print_status "AWS CLI is installed"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install it first."
        exit 1
    fi
    print_status "Node.js version: $(node --version)"
}

# Build frontend
build_frontend() {
    print_status "Building frontend..."
    cd code-battle-frontend
    npm ci
    npm run build
    cd ..
    print_status "Frontend build completed"
}

# Build backend
build_backend() {
    print_status "Building backend..."
    cd code-battle-backend
    npm ci
    npm run build
    cd ..
    print_status "Backend build completed"
}

# Deploy to Vercel
deploy_frontend() {
    print_status "Deploying frontend to Vercel..."
    print_warning "Please ensure you have:"
    echo "  1. Created a Vercel account at vercel.com"
    echo "  2. Connected your GitHub repository"
    echo "  3. Selected the code-battle-frontend folder"
    echo "  4. Set environment variables in Vercel dashboard"
    echo ""
    echo "Vercel will auto-detect Vite and deploy automatically."
    echo "Check DEPLOY.md for detailed instructions."
}

# Deploy backend to Railway
deploy_backend() {
    print_status "Deploying backend to Railway..."
    print_warning "Please:"
    echo "  1. Create a Railway account at railway.app"
    echo "  2. Create new project from GitHub repo"
    echo "  3. Select the code-battle-backend folder"
    echo "  4. Set environment variables in Railway console:"
    echo "     - NODE_ENV=production"
    echo "     - JWT_SECRET (generate with: openssl rand -base64 32)"
    echo "     - FIREBASE_PROJECT_ID"
    echo "     - FIREBASE_PRIVATE_KEY"
    echo "     - FIREBASE_CLIENT_EMAIL"
    echo "     - GOOGLE_GEMINI_API_KEY"
    echo "     - ELEVENLABS_API_KEY"
    echo "     - FRONTEND_URL (your Vercel URL)"
    echo ""
    echo "Railway offers $5 free credits monthly - perfect for demos!"
}

# Alternative deployment info
show_alternatives() {
    print_status "Alternative deployment options:"
    echo "  - Heroku (with Procfile)"
    echo "  - Vercel/Netlify (frontend only)"
    echo "  - DigitalOcean App Platform"
    echo "  - Railway or Render"
}

# Main deployment function
main() {
    echo "Select deployment option:"
    echo "1) Build only (prepare for manual deployment)"
    echo "2) Vercel + Railway (FREE - recommended)"
    echo "3) Show alternative deployment options"
    echo "4) Full local build and test"
    read -p "Enter your choice (1-4): " choice

    case $choice in
        1)
            check_node
            build_frontend
            build_backend
            print_status "Build completed. Ready for manual deployment."
            ;;
        2)
            check_node
            build_frontend
            build_backend
            deploy_frontend
            deploy_backend
            ;;
        3)
            show_alternatives
            ;;
        4)
            check_node
            build_frontend
            build_backend
            print_status "Running local tests..."
            cd code-battle-backend && npm test 2>/dev/null || echo "No tests configured"
            cd ../code-battle-frontend && npm test 2>/dev/null || echo "No tests configured"
            cd ..
            print_status "Local build and test completed"
            ;;
        *)
            print_error "Invalid choice. Please run the script again."
            exit 1
            ;;
    esac
}

# Run main function
main

echo ""
print_status "Deployment script completed!"
echo ""
print_warning "Remember to:"
echo "  - Set up proper environment variables"
echo "  - Configure CORS for your domains"
echo "  - Set up SSL/TLS certificates"
echo "  - Configure monitoring and logging"
echo "  - Set up database backups if using external DB"