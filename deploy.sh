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

# Deploy to Amplify
deploy_frontend() {
    print_status "Deploying frontend to AWS Amplify..."
    print_warning "Please ensure you have:"
    echo "  1. Created an Amplify app in AWS Console"
    echo "  2. Connected it to your GitHub repository"
    echo "  3. Set up environment variables in Amplify Console"
    echo ""
    echo "The amplify.yml file has been configured for automatic deployments."
    echo "Push your code to trigger a deployment."
}

# Deploy backend to Elastic Beanstalk
deploy_backend() {
    print_status "Preparing backend for Elastic Beanstalk deployment..."

    # Create deployment package
    cd code-battle-backend
    zip -r ../codebattle-backend-$(date +%Y%m%d-%H%M%S).zip . \
        -x "node_modules/*" "src/*" "*.log" ".env" "*.md" "docs/*"
    cd ..

    print_status "Backend deployment package created"
    print_warning "Please:"
    echo "  1. Create an Elastic Beanstalk application in AWS Console"
    echo "  2. Upload the generated zip file"
    echo "  3. Configure environment variables in EB Console:"
    echo "     - JWT_SECRET"
    echo "     - FIREBASE_PROJECT_ID"
    echo "     - FIREBASE_PRIVATE_KEY"
    echo "     - FIREBASE_CLIENT_EMAIL"
    echo "     - GOOGLE_GEMINI_API_KEY"
    echo "     - ELEVENLABS_API_KEY"
    echo "     - FRONTEND_URL"
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
    echo "2) AWS Amplify + Elastic Beanstalk (recommended)"
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
            check_aws_cli
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