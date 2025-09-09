# Mental Health Support Platform

## Overview

This is a comprehensive mental health support web application built with React, Express.js, and PostgreSQL. The platform provides users with mood tracking capabilities, real-time chat support with counselors, gamification features to encourage daily check-ins, and crisis intervention tools. The application focuses on creating a safe, supportive environment for users to monitor their mental wellness and connect with help when needed.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and dark/light mode support
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Authentication**: Session-based authentication with protected routes

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Authentication**: Passport.js with local strategy and session-based auth
- **Session Storage**: PostgreSQL-backed session store using connect-pg-simple
- **Real-time Communication**: WebSocket integration for live chat functionality
- **API Design**: RESTful endpoints with consistent error handling and logging middleware

### Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Management**: Type-safe schema definitions with Zod validation
- **Key Tables**:
  - Users with streak tracking and achievement metrics
  - Mood entries with 1-10 scale and categorical mood types
  - Chat sessions and messages for counselor communication
  - Achievements system for gamification
  - Crisis alerts for emergency intervention

### Core Features
- **Mood Tracking**: Daily mood check-ins with numerical and categorical ratings, optional notes, and historical visualization
- **Real-time Chat**: WebSocket-powered chat system connecting users with counselors or peer support groups
- **Gamification**: Streak tracking, achievement system, and progress visualization to encourage consistent engagement
- **Crisis Support**: Automatic detection of low mood levels triggering crisis intervention resources and emergency contacts
- **Progressive Web App**: Responsive design optimized for both desktop and mobile usage

### Security & Privacy
- **Authentication**: Secure password hashing using Node.js scrypt with salt
- **Session Management**: Secure HTTP-only cookies with PostgreSQL session persistence
- **Data Protection**: User data isolation and privacy-focused design
- **Crisis Prevention**: Automated mood level monitoring with intervention triggers

## External Dependencies

### Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **WebSocket Support**: Native WebSocket implementation for real-time features

### UI & Design System
- **Radix UI**: Accessible, unstyled UI primitives for complex components
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library providing consistent iconography
- **Custom Fonts**: Google Fonts integration (DM Sans, Geist Mono, Fira Code)

### Development & Build Tools
- **Vite**: Fast development server and build tool with React plugin
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast JavaScript bundler for production builds
- **Replit Integration**: Development environment plugins and runtime error handling

### Authentication & Validation
- **Passport.js**: Authentication middleware with local strategy
- **Zod**: Runtime type validation and schema definition
- **React Hook Form**: Form state management with validation integration

### Data Management
- **TanStack Query**: Server state management with caching and synchronization
- **Date-fns**: Date manipulation and formatting utilities
- **Drizzle Kit**: Database migration and schema management tools