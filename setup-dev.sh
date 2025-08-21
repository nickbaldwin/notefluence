#!/bin/bash

echo "🚀 Setting up Notefluence development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm run install-all

# Create environment file if it doesn't exist
if [ ! -f "client/.env.local" ]; then
    echo "📝 Creating environment file..."
    cat > client/.env.local << EOF
# Supabase Configuration
# Get these values from your Supabase project dashboard
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Development Settings
NODE_ENV=development
EOF
    echo "⚠️  Please update client/.env.local with your Supabase credentials"
fi

echo "🎉 Notefluence development environment setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Create a Supabase project at https://supabase.com"
echo "2. Run the SQL schema from supabase-schema.sql in your Supabase SQL editor"
echo "3. Copy your Supabase URL and anon key to client/.env.local"
echo "4. Configure OAuth providers in your Supabase dashboard"
echo "5. Run 'npm run dev' to start the development server"
echo ""
echo "🔗 Useful links:"
echo "- Supabase Dashboard: https://supabase.com/dashboard"
echo "- Vercel Dashboard: https://vercel.com/dashboard"
echo "- Project Documentation: SUPABASE_SETUP.md"
