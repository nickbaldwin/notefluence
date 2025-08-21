#!/bin/bash

echo "🚀 Notefluence Deployment Setup (Single Database)"
echo "================================================="

# Check if .env.local exists
if [ ! -f "client/.env.local" ]; then
    echo "❌ client/.env.local not found!"
    echo "Please create client/.env.local with your Supabase credentials:"
    echo ""
    echo "NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co"
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key"
    echo ""
    echo "You can find these in your Supabase project settings."
    echo ""
    echo "Note: This same database will be used for both development and production."
    exit 1
fi

echo "✅ Environment file found"

# Check if Git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Check if remote is set
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🌐 No remote repository set"
    echo "Please create a GitHub repository and run:"
    echo "git remote add origin https://github.com/yourusername/notefluence.git"
    echo "git push -u origin main"
else
    echo "✅ Remote repository configured"
fi

# Check for build issues
echo "🔨 Checking build configuration..."

cd client

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing client dependencies..."
    npm install
fi

# Try to build
echo "🏗️  Testing build..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Build successful"
else
    echo "❌ Build failed! Please fix build issues before deploying."
    echo "Run 'npm run build' in the client directory to see detailed errors."
    exit 1
fi

cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Single Database Approach:"
echo "   • Using same Supabase database for dev and production"
echo "   • Be careful with destructive operations"
echo "   • Always backup before major changes"
echo "   • Test migrations carefully"
echo ""
echo "🚀 Next steps:"
echo "1. Create a GitHub repository and push your code"
echo "2. Create a Vercel account and connect your repository"
echo "3. Set up environment variables in Vercel (same as .env.local)"
echo "4. Deploy!"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md"
echo ""
echo "⚠️  Important: Since you're using a single database, be extra careful"
echo "   when making changes that could affect production data!"
