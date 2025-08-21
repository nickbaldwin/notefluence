# Notefluence

A modern SaaS product that combines wiki-style project management with Jupyter-style notebooks using React. Create, collaborate, and share interactive documentation with code execution capabilities.

## Features

### 🚀 Core Features
- **Wiki-style Projects**: Organize content in hierarchical project structures
- **Jupyter-style Notebooks**: Interactive cells with code execution and markdown
- **Real-time Collaboration**: Multiple users can edit simultaneously
- **Code Execution**: Run JavaScript with sandboxed execution
- **Rich Text Editing**: Markdown support with live preview
- **File Management**: Upload and manage images, documents, and code files
- **Search & Navigation**: Full-text search across all projects
- **Version Control**: Track changes and revert to previous versions

### 🎨 Modern UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Mode**: Toggle between themes
- **Drag & Drop**: Intuitive file and cell management
- **Keyboard Shortcuts**: Power user features for efficiency
- **Real-time Updates**: Live collaboration indicators

### 🔐 SaaS Features
- **User Authentication**: Secure OAuth login with Google/GitHub
- **Project Sharing**: Public and private project options
- **Team Management**: Invite collaborators and manage permissions
- **Usage Analytics**: Track project views and engagement
- **Export Options**: PDF, HTML, and Markdown export

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Next.js 14** for SSR and routing
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Monaco Editor** for code editing
- **React Query** for data fetching
- **Zustand** for state management

### Backend & Database
- **Supabase** for database, authentication, and real-time features
- **PostgreSQL** for database (via Supabase)
- **Row Level Security** for data protection
- **OAuth** for authentication (Google, GitHub)

### Infrastructure
- **Vercel** for deployment and hosting
- **GitHub** for version control
- **Automatic CI/CD** pipeline

## Project Structure

```
notefluence/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js app router
│   │   ├── components/    # Reusable UI components
│   │   ├── stores/        # Zustand state stores
│   │   ├── types/         # TypeScript type definitions
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
├── supabase/              # Database migrations
│   └── migrations/        # SQL migration files
├── server/                # Legacy Express backend (not used)
└── docs/                  # Documentation
```

## Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nickbaldwin/notefluence.git
   cd notefluence
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Add your Supabase credentials to client/.env.local
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the migrations in `supabase/migrations/`
   - Configure OAuth providers

5. **Start development server**
   ```bash
   npm run dev
   ```

## Deployment

### Automatic Deployment
This project is configured for automatic deployment to Vercel:

1. **Push to GitHub** - Automatic deployment triggers
2. **Vercel builds** and deploys your changes
3. **Production site** is updated automatically

### Manual Deployment
```bash
cd client
vercel --prod
```

## Documentation

- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Complete deployment instructions
- [Deployment Checklist](DEPLOYMENT_CHECKLIST.md) - Step-by-step checklist
- [Supabase Migration Guide](SUPABASE_MIGRATION_GUIDE.md) - Database setup
- [Security Fix Guide](SECURITY_FIX_GUIDE.md) - Security configuration

## Live Demo

Visit the live application: [https://notefluence.vercel.app](https://notefluence.vercel.app)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
