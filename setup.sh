#!/bin/bash

# Notebook Wiki SaaS Setup Script
# This script will set up the entire development environment

set -e

echo "🚀 Setting up Notebook Wiki SaaS..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking system requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed."
        exit 1
    fi
    
    # Check Docker (optional)
    if command -v docker &> /dev/null; then
        print_success "Docker is available"
    else
        print_warning "Docker is not installed. You can still run the app locally."
    fi
    
    # Check Git
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed."
        exit 1
    fi
    
    print_success "System requirements check passed!"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install root dependencies
    npm install
    
    # Install server dependencies
    cd server
    npm install
    cd ..
    
    # Install client dependencies
    cd client
    npm install
    cd ..
    
    print_success "Dependencies installed successfully!"
}

# Setup environment variables
setup_environment() {
    print_status "Setting up environment variables..."
    
    if [ ! -f .env ]; then
        cp env.example .env
        print_success "Environment file created from template"
        print_warning "Please edit .env file with your configuration"
    else
        print_warning "Environment file already exists"
    fi
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    # Check if PostgreSQL is running
    if command -v pg_isready &> /dev/null; then
        if pg_isready -q; then
            print_success "PostgreSQL is running"
        else
            print_warning "PostgreSQL is not running. Please start it manually."
        fi
    else
        print_warning "PostgreSQL client not found. Please install PostgreSQL."
    fi
    
    # Setup Prisma
    cd server
    npx prisma generate
    print_success "Prisma client generated"
    cd ..
}

# Build the application
build_application() {
    print_status "Building the application..."
    
    # Build server
    cd server
    npm run build
    cd ..
    
    # Build client
    cd client
    npm run build
    cd ..
    
    print_success "Application built successfully!"
}

# Setup Git hooks
setup_git_hooks() {
    print_status "Setting up Git hooks..."
    
    if [ -d .git ]; then
        # Create pre-commit hook
        cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "Running pre-commit checks..."

# Run linting
cd client && npm run lint
cd ../server && npm run lint

# Run type checking
cd ../client && npm run type-check
cd ../server && npm run type-check

echo "Pre-commit checks passed!"
EOF
        
        chmod +x .git/hooks/pre-commit
        print_success "Git hooks configured"
    else
        print_warning "Not a Git repository. Skipping Git hooks setup."
    fi
}

# Create development scripts
create_scripts() {
    print_status "Creating development scripts..."
    
    # Create start script
    cat > start-dev.sh << 'EOF'
#!/bin/bash
echo "Starting development servers..."
npm run dev
EOF
    
    chmod +x start-dev.sh
    
    # Create database reset script
    cat > reset-db.sh << 'EOF'
#!/bin/bash
echo "Resetting database..."
cd server
npx prisma migrate reset --force
npx prisma migrate dev
cd ..
echo "Database reset complete!"
EOF
    
    chmod +x reset-db.sh
    
    print_success "Development scripts created!"
}

# Display next steps
show_next_steps() {
    echo ""
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Edit the .env file with your configuration"
    echo "2. Start PostgreSQL and Redis (if using Docker: docker-compose up postgres redis)"
    echo "3. Run database migrations: cd server && npx prisma migrate dev"
    echo "4. Start the development servers: ./start-dev.sh"
    echo ""
    echo "The application will be available at:"
    echo "  - Frontend: http://localhost:3000"
    echo "  - Backend API: http://localhost:5000"
    echo "  - Health check: http://localhost:5000/health"
    echo ""
    echo "For production deployment:"
    echo "  - Use Docker: docker-compose up -d"
    echo "  - Or deploy to Vercel/Heroku/AWS"
    echo ""
}

# Main setup function
main() {
    echo "=========================================="
    echo "  Notebook Wiki SaaS Setup Script"
    echo "=========================================="
    echo ""
    
    check_requirements
    install_dependencies
    setup_environment
    setup_database
    build_application
    setup_git_hooks
    create_scripts
    show_next_steps
}

# Run main function
main "$@"
