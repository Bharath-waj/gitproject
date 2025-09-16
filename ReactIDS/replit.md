# SecureGuard IDS Dashboard

## Overview

SecureGuard is a real-time Intrusion Detection System (IDS) dashboard built for network security monitoring and threat analysis. The application provides a comprehensive security operations center interface featuring live threat detection, network traffic monitoring, endpoint status tracking, and security event logging. It's designed to give security teams immediate visibility into their network infrastructure with real-time alerts and detailed threat analysis capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side is built using **React with TypeScript** and follows a modern component-based architecture:

- **UI Framework**: React 18 with functional components and hooks
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design system
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Real-time Updates**: WebSocket integration for live data streaming
- **Build Tool**: Vite for fast development and optimized production builds

The frontend uses a dashboard-centric design with modular components for different security monitoring aspects (threat analysis, network traffic, system status, event logs).

### Backend Architecture
The server implements a **Node.js Express** application with TypeScript:

- **Runtime**: Node.js with ES modules
- **Framework**: Express.js for REST API endpoints
- **Real-time Communication**: WebSocket server for live updates to connected clients
- **Development**: tsx for TypeScript execution in development
- **Production Build**: esbuild for optimized server bundling

The backend provides RESTful endpoints for security data and maintains WebSocket connections for broadcasting real-time threat alerts and system updates.

### Data Storage Solutions
The application uses **Drizzle ORM** with **PostgreSQL** for data persistence:

- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Development Storage**: In-memory storage implementation for development/demo
- **Session Management**: PostgreSQL-based session storage using connect-pg-simple

The database schema includes tables for users, threats, endpoints, event logs, and network traffic data with proper indexing for real-time queries.

### Authentication and Authorization
Basic authentication infrastructure is in place:

- **Session Management**: Server-side sessions stored in PostgreSQL
- **User Management**: User creation and authentication endpoints
- **Security**: Session-based authentication with secure cookie configuration

### Real-time Data Architecture
The application implements a real-time monitoring system:

- **WebSocket Server**: Dedicated WebSocket server running alongside HTTP server
- **Client Management**: Active connection tracking for broadcasting updates
- **Data Broadcasting**: Real-time threat alerts, system status changes, and network traffic updates
- **Automatic Reconnection**: Client-side reconnection logic with exponential backoff
- **Live Queries**: Periodic data refetching combined with WebSocket updates for data freshness

### Component Architecture
The frontend follows a hierarchical component structure:

- **Pages**: Route-level components (Dashboard, NotFound)
- **Dashboard Components**: Specialized widgets for different monitoring aspects
- **UI Components**: Reusable shadcn/ui components with consistent theming
- **Hooks**: Custom hooks for WebSocket management, mobile detection, and toast notifications
- **Utilities**: Helper functions for styling and data formatting

## External Dependencies

### Core Frontend Libraries
- **React & React DOM**: UI framework and rendering
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight routing solution
- **recharts**: Data visualization and charting
- **date-fns**: Date manipulation and formatting

### UI Component System
- **shadcn/ui**: Complete component library built on Radix UI primitives
- **@radix-ui/***: Unstyled, accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority & clsx**: Dynamic class name generation
- **lucide-react**: Icon library

### Backend Infrastructure
- **express**: Web application framework
- **drizzle-orm**: TypeSQL ORM
- **@neondatabase/serverless**: Neon PostgreSQL client
- **connect-pg-simple**: PostgreSQL session store
- **ws**: WebSocket implementation
- **zod**: Runtime type validation
- **drizzle-zod**: Integration between Drizzle and Zod

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Type system
- **tsx**: TypeScript execution for Node.js
- **esbuild**: JavaScript bundler for production
- **@replit/vite-plugin-***: Replit-specific development enhancements

### Database and Storage
- **PostgreSQL**: Primary database (configured for Neon serverless)
- **Drizzle Kit**: Database migration and introspection tool

The application is configured for deployment on Replit with specialized plugins for development experience, error handling, and debugging capabilities.