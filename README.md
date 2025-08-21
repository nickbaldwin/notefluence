# Notebook Wiki SaaS

A modern SaaS product that combines wiki-style project management with Jupyter-style notebooks using React. Create, collaborate, and share interactive documentation with code execution capabilities.

## Features

### 🚀 Core Features
- **Wiki-style Projects**: Organize content in hierarchical project structures
- **Jupyter-style Notebooks**: Interactive cells with code execution and markdown
- **Real-time Collaboration**: Multiple users can edit simultaneously
- **Code Execution**: Run JavaScript, Python (via API), and other languages
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
- **User Authentication**: Secure login with JWT tokens
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

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **PostgreSQL** for database
- **Prisma** for ORM
- **JWT** for authentication
- **Socket.io** for real-time features
- **Multer** for file uploads

### Infrastructure
- **Docker** for containerization
- **Redis** for caching and sessions
- **AWS S3** for file storage
- **Vercel** for deployment

## Project Structure

```
notebook-wiki-saas/
├── client/                 # React frontend
│   ├── components/         # Reusable UI components
│   ├── pages/             # Next.js pages
│   ├── hooks/             # Custom React hooks
│   ├── stores/            # Zustand state stores
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Express middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   └── services/         # Business logic
├── shared/               # Shared types and utilities
└── docs/                 # Documentation
```

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- Redis 6+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd notebook-wiki-saas
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   cd server
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start the development servers**
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Development

### Running Tests
```bash
# Frontend tests
cd client && npm test

# Backend tests
cd server && npm test
```

### Building for Production
```bash
npm run build
```

### Docker Deployment
```bash
docker-compose up -d
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions, please open an issue on GitHub or contact the development team.
# Updated Thu Aug 21 12:34:01 AEST 2025
# Test deployment - Thu Aug 21 15:02:02 AEST 2025
