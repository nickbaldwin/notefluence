# Product Requirements Document (PRD)
# Notefluence - Wiki-Style Projects with Jupyter Notebooks

## 1. Executive Summary

### Product Vision
Notefluence is a modern SaaS application that combines wiki-style project management with Jupyter-style interactive notebooks. Users can create, organize, and share interactive documentation with embedded code execution capabilities.

### Target Users
- **Developers** - Creating technical documentation with executable code examples
- **Data Scientists** - Sharing analysis notebooks and reports
- **Technical Writers** - Building interactive documentation
- **Educators** - Creating interactive learning materials
- **Teams** - Collaborative knowledge management

### Key Value Propositions
- **Interactive Documentation** - Code that actually runs in the browser
- **Wiki Organization** - Hierarchical project structure for easy navigation
- **Modern UI/UX** - Clean, responsive design with excellent developer experience
- **Secure & Scalable** - Built on modern cloud infrastructure
- **Real-time Collaboration** - Multiple users can work together

## 2. Product Features

### 2.1 Core Features

#### Authentication & User Management
- **OAuth Integration**
  - Google OAuth provider
  - GitHub OAuth provider
  - Secure JWT token management
  - User profile management
  - Onboarding flow for new users

#### Project Management
- **Project Creation**
  - Title, description, and visibility settings
  - Public/private project options
  - Automatic slug generation from title
  - Project metadata (created date, last updated, owner)

- **Project Organization**
  - Hierarchical page structure
  - Drag-and-drop page reordering
  - Page nesting capabilities
  - Breadcrumb navigation

#### Interactive Notebooks
- **Cell Types**
  - Markdown cells (rich text, code blocks, images)
  - Code cells (JavaScript execution)
  - Output cells (display results)

- **Code Execution**
  - In-browser JavaScript execution
  - Sandboxed execution environment
  - Console output capture
  - Error handling and display
  - Execution timeout protection

- **Rich Text Editing**
  - Markdown support with live preview
  - Syntax highlighting for code blocks
  - Image embedding and management
  - Mathematical notation support (KaTeX)

#### File Management
- **File Upload**
  - Drag-and-drop file uploads
  - Image, document, and code file support
  - File size limits and validation
  - File organization within projects

#### Search & Navigation
- **Full-text Search**
  - Search across all user-accessible projects
  - Search within project content
  - Search result highlighting
  - Search filters and sorting

### 2.2 Advanced Features

#### Collaboration
- **Real-time Updates**
  - Live data synchronization via Supabase
  - User presence indicators
  - Conflict resolution for concurrent edits

#### Export & Sharing
- **Export Options**
  - PDF export
  - HTML export
  - Markdown export
  - Code-only export

- **Sharing Controls**
  - Public project visibility
  - Private project access
  - Link sharing capabilities

#### Analytics & Insights
- **Usage Tracking**
  - Project view counts
  - User engagement metrics
  - Popular content identification

## 3. Technical Architecture

### 3.1 Frontend Architecture

#### Technology Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **Forms**: React Hook Form with Zod validation
- **Code Editor**: Monaco Editor
- **Animations**: Framer Motion
- **Markdown**: React Markdown with syntax highlighting

#### Key Components
- **Layout Components**
  - Main layout with sidebar navigation
  - Responsive design for mobile/tablet/desktop
  - Dark/light theme support

- **Project Components**
  - Project card grid/list views
  - Project creation form
  - Project detail pages
  - Page tree navigation

- **Notebook Components**
  - Cell editor (markdown/code)
  - Code execution engine
  - Output display
  - Cell toolbar with actions

- **UI Components**
  - Button variants (primary, secondary, ghost)
  - Form inputs with validation
  - Modal dialogs
  - Toast notifications
  - Loading states and skeletons

### 3.2 Backend Architecture

#### Database (Supabase)
- **PostgreSQL Database**
  - Users table (linked to Supabase auth)
  - Projects table with RLS policies
  - Pages table for hierarchical content
  - Activities table for usage tracking
  - User profiles table

- **Row Level Security (RLS)**
  - Users can only access their own projects
  - Public projects visible to all authenticated users
  - Secure data isolation between users

- **Authentication**
  - Supabase Auth with OAuth providers
  - JWT token management
  - Session handling
  - User profile creation on first login

#### Real-time Features
- **Supabase Realtime**
  - Live project updates
  - User presence tracking
  - Collaborative editing indicators

### 3.3 Infrastructure

#### Deployment
- **Platform**: Vercel
- **Domain**: Custom domain support
- **SSL**: Automatic HTTPS
- **CDN**: Global content delivery

#### Environment Management
- **Development**: Local development with hot reload
- **Production**: Automatic deployments from GitHub
- **Environment Variables**: Secure configuration management

## 4. Database Schema

### 4.1 Core Tables

#### users
```sql
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  is_onboarded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### projects
```sql
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  owner_id UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### pages
```sql
CREATE TABLE pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content JSONB,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES pages(id),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### activities
```sql
CREATE TABLE activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  project_id UUID REFERENCES projects(id),
  activity_type TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4.2 Row Level Security Policies

```sql
-- Users can only see their own projects or public projects
CREATE POLICY "Users can view own projects or public projects" ON projects
  FOR SELECT USING (
    owner_id = auth.uid() OR is_public = true
  );

-- Users can only modify their own projects
CREATE POLICY "Users can modify own projects" ON projects
  FOR ALL USING (owner_id = auth.uid());

-- Similar policies for pages and activities
```

## 5. User Interface Design

### 5.1 Design System

#### Color Palette
- **Primary**: Blue (#3B82F6)
- **Secondary**: Gray (#6B7280)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)
- **Background**: White/Light Gray or Dark Gray/Black

#### Typography
- **Headings**: Inter font family
- **Body**: Inter font family
- **Code**: JetBrains Mono or Fira Code

#### Spacing
- **Base unit**: 4px
- **Common spacings**: 8px, 16px, 24px, 32px, 48px

### 5.2 Key Pages

#### Dashboard
- Project grid/list view
- Create new project button
- Search functionality
- User profile menu
- Recent projects section

#### Project Detail
- Page tree sidebar
- Main content area
- Page toolbar with actions
- Breadcrumb navigation
- Project settings

#### Notebook Editor
- Cell-based interface
- Markdown/code cell types
- Execution controls
- Output display
- Cell toolbar

## 6. Code Execution Engine

### 6.1 JavaScript Execution
- **Sandboxed Environment**
  - Iframe-based isolation
  - Restricted API access
  - Timeout protection
  - Memory usage limits

- **Console Output Capture**
  - Console.log, console.error, console.warn
  - Structured output display
  - Error stack traces
  - Execution timing

### 6.2 Security Considerations
- **Code Validation**
  - Pre-execution syntax checking
  - Dangerous function blocking
  - Resource usage monitoring
  - Network request restrictions

## 7. Development Workflow

### 7.1 Setup Instructions
1. **Clone Repository**
2. **Install Dependencies**
3. **Configure Environment Variables**
4. **Set up Supabase Project**
5. **Run Database Migrations**
6. **Start Development Server**

### 7.2 Environment Variables
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GITHUB_CLIENT_ID=your_github_client_id
```

### 7.3 Build & Deployment
- **Development**: `npm run dev`
- **Build**: `npm run build`
- **Production**: Automatic deployment via Vercel
- **Testing**: Jest with React Testing Library

## 8. Performance Requirements

### 8.1 Performance Targets
- **Page Load**: < 2 seconds
- **Code Execution**: < 5 seconds
- **Search Results**: < 1 second
- **Real-time Updates**: < 500ms

### 8.2 Scalability
- **Concurrent Users**: Support 1000+ simultaneous users
- **Database**: Handle 10,000+ projects
- **File Storage**: Support up to 100MB per project
- **Code Execution**: Handle 100+ concurrent executions

## 9. Security Requirements

### 9.1 Authentication & Authorization
- **OAuth 2.0** with Google and GitHub
- **JWT tokens** with secure storage
- **Row Level Security** for data isolation
- **Session management** with automatic refresh

### 9.2 Data Protection
- **HTTPS** for all communications
- **Input validation** and sanitization
- **XSS protection** in code execution
- **CSRF protection** for forms

### 9.3 Privacy
- **User data isolation** via RLS
- **Minimal data collection** principle
- **Data retention** policies
- **GDPR compliance** considerations

## 10. Testing Strategy

### 10.1 Test Types
- **Unit Tests**: Component and utility functions
- **Integration Tests**: API endpoints and database operations
- **E2E Tests**: Critical user workflows
- **Performance Tests**: Load testing and optimization

### 10.2 Test Coverage
- **Frontend**: 80%+ component coverage
- **Backend**: 90%+ API coverage
- **Database**: All RLS policies tested
- **Security**: Authentication and authorization flows

## 11. Monitoring & Analytics

### 11.1 Application Monitoring
- **Error Tracking**: Sentry or similar
- **Performance Monitoring**: Vercel Analytics
- **User Analytics**: Privacy-compliant tracking
- **Database Monitoring**: Supabase dashboard

### 11.2 Key Metrics
- **User Engagement**: Daily/Monthly active users
- **Feature Usage**: Most used features
- **Performance**: Page load times, execution times
- **Errors**: Error rates and types

## 12. Future Enhancements

### 12.1 Planned Features
- **Real-time Collaboration**: Multi-user editing
- **Advanced Code Execution**: Python, R, SQL support
- **Version Control**: Git integration for projects
- **API Integration**: External service connections
- **Mobile App**: Native iOS/Android apps

### 12.2 Technical Improvements
- **Offline Support**: Service worker implementation
- **Advanced Search**: Elasticsearch integration
- **File Storage**: S3-compatible storage
- **Caching**: Redis for performance optimization

## 13. Success Metrics

### 13.1 User Metrics
- **User Registration**: 1000+ users in first 6 months
- **User Retention**: 60%+ monthly retention
- **Project Creation**: 5000+ projects created
- **Code Execution**: 10,000+ code runs per month

### 13.2 Technical Metrics
- **Uptime**: 99.9% availability
- **Performance**: < 2s page load times
- **Security**: Zero security incidents
- **Scalability**: Handle 10x user growth

---

## Implementation Notes for AI Agent

### Critical Implementation Details
1. **Start with Supabase setup** - Database and authentication first
2. **Implement RLS policies** - Security is critical from day one
3. **Build cell-based editor** - Core differentiator of the product
4. **Focus on code execution** - Sandboxed JavaScript execution
5. **Implement proper error handling** - Especially for code execution
6. **Use TypeScript throughout** - Type safety is essential
7. **Follow Next.js 14 patterns** - App Router and server components
8. **Implement responsive design** - Mobile-first approach
9. **Add comprehensive testing** - Unit, integration, and E2E tests
10. **Document everything** - Code, API, and user documentation

### Key Dependencies to Include
- `@supabase/supabase-js` for database and auth
- `@monaco-editor/react` for code editing
- `react-markdown` for markdown rendering
- `zustand` for state management
- `react-hook-form` + `zod` for forms
- `framer-motion` for animations
- `tailwindcss` for styling

### Common Pitfalls to Avoid
1. **Don't skip RLS policies** - Security is non-negotiable
2. **Don't use client-side routing for auth** - Use Supabase auth properly
3. **Don't forget error boundaries** - Code execution can fail
4. **Don't skip TypeScript** - Type safety prevents many bugs
5. **Don't ignore mobile** - Responsive design is essential
6. **Don't forget loading states** - User experience matters
7. **Don't skip validation** - Both client and server-side validation needed
