# 🎓 Online Clearance Officer Admin SystemS

> A comprehensive React-based web application for managing student clearance processes in educational institutions.

[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.11-cyan.svg)](https://tailwindcss.com/)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-5.26.0-red.svg)](https://ant.design/)

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [User Roles & Access](#user-roles--access)
- [API Integration](#api-integration)
- [Authentication System](#authentication-system)
- [Project Structure](#project-structure)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

The Online Clearance Officer Admin System is a modern, responsive web application designed to streamline the student clearance process in educational institutions. It provides a comprehensive platform for managing student records, clearance requirements, and permit generation with QR code verification.

### 🎯 Purpose

This system eliminates the traditional paper-based clearance process by providing:

- **Digital document processing** with automated forms
- **Real-time status tracking** for students and administrators
- **Secure data management** with role-based access control
- **QR code permit generation** for instant verification
- **Mobile-responsive design** for accessibility across devices

## ✨ Key Features

### 🔐 Authentication & Authorization

- **JWT-based authentication** with automatic token refresh
- **Role-based access control** (Admin, Clearing Officer, Student)
- **Secure session management** with automatic logout on expiry
- **Protected routes** with role-specific access

### 👥 User Management

- **Admin Dashboard** for system administration
- **Student Management** with comprehensive record keeping
- **Clearing Officer Management** with department assignments
- **Account Settings** for profile management

### 📚 Clearance Management

- **Digital Clearance Forms** with automated processing
- **Requirement Tracking** by department and course
- **Status Monitoring** with real-time updates
- **Document Verification** system

### 🎫 Permit System

- **QR Code Generation** for exam permits
- **Digital Permit Verification** with mobile scanning
- **Expiration Management** with automatic notifications
- **Print-friendly** permit layouts

### 📊 Analytics & Reporting

- **Dashboard Analytics** with key performance indicators
- **Clearance Statistics** by department and time period
- **Completion Rate Tracking** for better process optimization
- **Event Management** for academic calendar integration

### 📱 Mobile-First Design

- **Responsive UI** optimized for all device sizes
- **Touch-friendly interfaces** for mobile users
- **Progressive Web App** capabilities
- **Offline functionality** for core features

## 🏗️ Architecture

The application follows a modern React architecture with the following patterns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Presentation  │    │    Business     │    │      Data       │
│      Layer      │◄──►│     Logic       │◄──►│      Layer      │
│                 │    │                 │    │                 │
│ • Components    │    │ • Redux Store   │    │ • API Services  │
│ • Pages         │    │ • Context API   │    │ • Local Storage │
│ • Layouts       │    │ • Custom Hooks  │    │ • Token Mgmt    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 🔄 Data Flow

1. **User Interaction** → Component triggers action
2. **State Management** → Redux/Context updates state
3. **API Calls** → Axios interceptors handle requests
4. **Response Handling** → Data updates and UI re-renders

## 🛠️ Technology Stack

### Frontend Framework

- **React 19.1.0** - Modern React with concurrent features
- **TypeScript 5.8.3** - Type-safe development
- **Vite 6.3.5** - Fast build tool and dev server

### UI & Styling

- **Ant Design 5.26.0** - Enterprise-class UI components
- **TailwindCSS 4.1.11** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **Framer Motion** - Animation library

### State Management

- **Redux Toolkit** - Predictable state management
- **React Context API** - Authentication state
- **React Hook Form** - Form state management

### HTTP Client & Authentication

- **Axios** - HTTP client with interceptors
- **JWT Tokens** - Secure authentication
- **Cookie Management** - Refresh token handling

### Development Tools

- **ESLint** - Code linting and formatting
- **Vitest** - Unit testing framework
- **MSW** - API mocking for development

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Git** for version control

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/clearing-officer-admin.git
   cd clearing-officer-admin
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**

   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
# or
pnpm build
```

The built files will be in the `dist/` directory.

## 👥 User Roles & Access

### 🔑 Default Credentials

#### Admin Access

```
Email: anthony.dev@gmail.com
Password: Anthony@123
```

#### Clearing Officer Access

```
Email: cawasa@gmail.com
Password: Cawasa@123
```

#### Student Access

```
Email: marjoe@gmail.com
Password: Marjoe@123
```

### 🛡️ Role Permissions

#### Admin (`/admin-side`)

- ✅ System dashboard and analytics
- ✅ Student management (add/edit/delete)
- ✅ Clearing officer management
- ✅ Account settings and system configuration
- ✅ Full system access

#### Clearing Officer (`/clearing-officer`)

- ✅ Personal dashboard
- ✅ Clearance processing
- ✅ Student record management
- ✅ Requirements management
- ✅ Event coordination
- ✅ Account settings

#### Student (`/`)

- ✅ View clearance status
- ✅ Submit clearance documents
- ✅ Track requirement completion
- ✅ View exam permits
- ✅ Access QR code permits

## 🔌 API Integration

The application integrates with a backend API for data management:

### Authentication Endpoints

- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `POST /auth/refresh-token` - Token refresh
- `POST /auth/logout` - User logout

### Core API Endpoints

- `GET /api/students` - Fetch student records
- `POST /api/students` - Create new student
- `GET /api/clearance` - Fetch clearance data
- `POST /api/clearance` - Process clearance
- `GET /api/qr-code/view-permit` - View permit with token

### API Configuration

```typescript
// Base API configuration
const API_BASE_URL = process.env.VITE_API_BASE_URL || "http://localhost:3000";

// Axios instance with interceptors
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});
```

## 🔐 Authentication System

The application implements a robust JWT-based authentication system:

### Key Components

#### 1. AuthContext (`src/authentication/AuthContext.tsx`)

- Centralized authentication state management
- Login/logout functionality
- User data persistence

#### 2. TokenService (`src/authentication/tokenService.ts`)

- JWT token management
- Automatic token refresh
- Secure token storage

#### 3. Protected Routes (`src/components/ProtectedRoute.tsx`)

- Route-level authentication
- Role-based access control
- Automatic redirects

#### 4. Axios Interceptors

- Automatic token attachment
- Token refresh on expiry
- Error handling and logout

### Security Features

- **Automatic token refresh** before expiration
- **Secure token storage** in memory and cookies
- **Session timeout** handling
- **Role-based route protection**
- **CSRF protection** with secure cookies

## 📁 Project Structure

```
src/
├── api/                          # API configuration
│   ├── axios.ts                 # Base axios instance
│   ├── axiosPrivate.ts          # Authenticated requests
│   └── authentication.api.ts    # Auth API calls
├── authentication/              # Authentication system
│   ├── AuthContext.tsx          # Main auth provider
│   ├── AuthContext.types.ts     # TypeScript interfaces
│   ├── tokenService.ts          # Token management
│   └── redirectService.ts       # Navigation handling
├── components/                  # Reusable components
│   ├── admin-side/             # Admin-specific components
│   ├── clearing-officer/       # Officer-specific components
│   ├── ui/                     # Base UI components
│   └── myUi/                   # Custom UI components
├── layouts/                     # Page layouts
│   ├── AdminLayout.tsx         # Admin dashboard layout
│   ├── ClearingOfficerLayout.tsx # Officer dashboard layout
│   └── Layout.tsx              # General layout
├── pages/                       # Page components
│   ├── admin-side/             # Admin pages
│   ├── clearing-officer/       # Officer pages
│   ├── auth/                   # Authentication pages
│   └── landingPage/            # Public pages
├── store/                       # State management
│   ├── index.ts                # Store configuration
│   └── slices/                 # Redux slices
├── hooks/                       # Custom React hooks
├── lib/                         # Utility libraries
├── routes/                      # Routing configuration
└── types/                       # TypeScript type definitions
```

## 🧪 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run tests

# Package Management
npm install          # Install dependencies
npm ci               # Clean install for CI/CD
```

### Code Quality

The project enforces high code quality standards:

- **ESLint** configuration for consistent code style
- **TypeScript** for type safety
- **Prettier** for code formatting
- **Husky** for pre-commit hooks (if configured)

### Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### CI/CD Pipeline

The project includes a GitHub Actions workflow (`.github/workflows/ci-cd.yml`) that:

1. **Builds and tests** the application on push/PR
2. **Runs linting** and type checking
3. **Builds production** artifacts
4. **Uploads build** artifacts for deployment

### Deployment Options

#### Static Hosting (Recommended)

- **Vercel** - Zero-config deployment
- **Netlify** - Git-based deployment
- **GitHub Pages** - Free static hosting

#### Traditional Hosting

- **Apache/Nginx** - Serve static files
- **Docker** - Containerized deployment
- **AWS S3 + CloudFront** - Scalable hosting

### Environment Variables

Create a `.env.local` file for local development:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=Clearing Officer Admin
VITE_APP_VERSION=1.0.0
```

## 🤝 Contributing

We welcome contributions to improve the Clearing Officer Admin System!

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Add tests** for new functionality
5. **Run the test suite**
   ```bash
   npm test
   ```
6. **Commit your changes**
   ```bash
   git commit -m "Add: your feature description"
   ```
7. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Create a Pull Request**

### Development Guidelines

- Follow the existing code style and patterns
- Write meaningful commit messages
- Add TypeScript types for new features
- Include tests for new functionality
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- **Documentation**: Check this README and inline code comments
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions

## 🎉 Acknowledgments

- **React Team** for the amazing framework
- **Ant Design** for the comprehensive UI components
- **Vite** for the fast development experience
- **TypeScript** for type safety
- **All contributors** who help improve this project

---

<div align="center">

**Built with ❤️ for educational institutions**

[Report Bug](https://github.com/your-username/clearing-officer-admin/issues) · [Request Feature](https://github.com/your-username/clearing-officer-admin/issues) · [Documentation](https://github.com/your-username/clearing-officer-admin/wiki)

</div>
