# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AIMadeThis is an AI product discovery platform built with Next.js 15 (App Router), Supabase, and TypeScript. It's a community-driven platform for discovering, sharing, and discussing AI products.

## Development Commands

```bash
# Development server (uses Turbopack)
npm run dev

# Production build (uses Turbopack)
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Tech Stack & Architecture

### Framework: Next.js 15 (App Router)
- Uses the App Router paradigm (not Pages Router)
- Server Components by default, Client Components marked with `"use client"`
- Route groups: `(auth)` for authentication pages

### Layout Architecture
**CRITICAL**: All pages automatically include Navbar and Footer from the root layout.

- **Root Layout** (`app/layout.tsx`): Wraps all pages with `<Navbar />` and `<Footer />`
- **Auth Layout** (`app/(auth)/layout.tsx`): Overrides root layout to exclude Navbar/Footer for clean auth experience
- **When creating new pages**: Do NOT manually add `<Navbar />` or `<Footer />` - they're automatically included
- **Exception**: Pages in `(auth)` route group (login, signup) intentionally exclude navigation

**Before creating any new page**, verify with the ui-design-expert agent that the layout is correct and Navbar/Footer will appear automatically.

### Database: Supabase (PostgreSQL)
- **Client-side**: Use `createClient()` from `@/lib/supabase/client.ts`
- **Server-side**: Use `createClient()` from `@/lib/supabase/server.ts`
- **Middleware**: Session management handled in `@/lib/supabase/middleware.ts`
- All clients are typed with `Database` from `@/types/database.types.ts`

### Authentication Flow
- Server actions in `@/lib/auth/actions.ts` handle sign up, sign in, sign out
- Zod schemas validate auth inputs (`signUpSchema`, `signInSchema`)
- User profiles extend Supabase `auth.users` with username and metadata
- Protected routes defined in `lib/supabase/middleware.ts:46-50` (e.g., `/products/new`, `/profile/settings`)
- Auth routes automatically redirect logged-in users to home (line 58-66)
- **Development bypass**: Set `NEXT_PUBLIC_BYPASS_AUTH=true` in `.env.local` to skip auth checks (only works in NODE_ENV=development)

### State Management
- **React Query** (`@tanstack/react-query`) configured in `components/providers.tsx`
  - Default staleTime: 1 minute
  - Default gcTime: 5 minutes
- **Theme**: `next-themes` for dark/light mode

### Forms & Validation
- React Hook Form + Zod for form validation
- Use `@hookform/resolvers/zod` for schema integration

### Styling
- TailwindCSS v4 (with `@tailwindcss/postcss`)
- shadcn/ui components in `components/ui/`
- Global styles in `app/globals.css`
- Use `cn()` utility from `@/lib/utils.ts` for conditional classes

## Key Architecture Patterns

### Supabase Client Usage
**IMPORTANT**: Always use the correct Supabase client for the context:

```typescript
// Client Components (browser)
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()

// Server Components, Server Actions, Route Handlers
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient() // Note: awaited!
```

### Database Schema Structure
The schema (`lib/db/schema.sql`, 400 lines) includes:
- `profiles` - User profiles (extends `auth.users`)
- `products` - AI product listings
- `categories` - Product categories
- `tags` - Product tags
- `product_tags` - Many-to-many junction table
- `reviews` - Product reviews with ratings
- `votes` - Upvotes/downvotes
- `bookmarks` - User saved products
- `comments` - Product discussions
- `follows` - User follows (products/creators)

All tables have Row Level Security (RLS) enabled.

### Server Actions Pattern
Server actions are marked with `"use server"` directive (see `lib/auth/actions.ts`):
- Always validate inputs with Zod schemas
- Use server-side Supabase client
- Return `{ error: string }` or `{ success: true, data: ... }`
- Use `redirect()` for navigation after mutations

### Path Aliases
The project uses `@/*` to reference root directory files (configured in `tsconfig.json:22`).

## Environment Setup

Required environment variables (see `.env.local.example`):
```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Development
NEXT_PUBLIC_BYPASS_AUTH=false        # Set to 'true' to bypass auth in local dev (only works when NODE_ENV=development)

# Optional
NEXT_PUBLIC_GA_MEASUREMENT_ID=       # Google Analytics
OPENAI_API_KEY=                       # AI features (metadata generation)
```

## Database Type Generation

After schema changes, regenerate TypeScript types:
```bash
npx supabase login
npx supabase link --project-ref your-project-ref
npx supabase gen types typescript --linked > types/database.types.ts
```

## Adding UI Components

Use shadcn/ui CLI:
```bash
npx shadcn@latest add button
npx shadcn@latest add card
# etc.
```

Components are installed to `components/ui/` with full source code (not imported from a package).

## Middleware & Route Protection

The middleware (`middleware.ts`) runs on all routes except static assets. It:
1. Refreshes Supabase sessions on every request
2. Redirects unauthenticated users from protected routes to `/login`
3. Redirects authenticated users away from auth pages (`/login`, `/signup`)

Protected routes are explicitly listed in `lib/supabase/middleware.ts:42`.

## Post-Implementation Workflow

**IMPORTANT**: After completing each feature implementation or bug fix, you MUST follow this workflow:

1. **Run Project-Specific Agents** (in order):
   - `git-commit-helper` - Create a conventional commit with proper type, scope, and message
   - `requirements-tracker` - Verify implementation against requirements and update tracking status

2. **Agent Execution Rules**:
   - Always run these agents proactively, even if the user doesn't explicitly request it
   - Run them in sequence: commit first, then verify requirements
   - These agents are defined in `.claude/agents/` folder
   - This ensures code quality, proper version control, and requirement traceability

3. **When to Trigger**:
   - After completing any feature implementation
   - After fixing bugs or issues
   - After making significant refactors
   - Before ending a development session
   - When user indicates work is complete ("done", "finished", "that's it", etc.)

Example workflow:
```
User: "The dropdown fix looks good now"
Assistant:
1. Uses git-commit-helper agent to commit changes
2. Uses requirements-tracker agent to verify and track completion
3. Confirms to user that changes are committed and tracked
```

## Current Project Status

**Phase:** Phase 4 - Community Features & Discovery Enhancement (57% Complete)
**Last Updated:** October 7, 2025
**Production URL:** https://aimademethis.vercel.app

### ✅ Completed Features (Phase 1-4)

#### Core Platform (Phase 1-2)
- ✅ Authentication system (email + OAuth with Google/GitHub)
- ✅ User profiles with avatar upload
- ✅ Profile editing and settings
- ✅ Product submission with comprehensive fields
- ✅ Product listing and detail pages
- ✅ Product editing and deletion
- ✅ Draft/Published status management
- ✅ Homepage with hero and stats sections
- ✅ Navigation and footer
- ✅ Dark/light theme support

#### Dashboard System (Phase 3)
- ✅ Modern sidebar-based dashboard layout
- ✅ Dashboard home with statistics
- ✅ My Products management page
- ✅ Product CRUD within dashboard
- ✅ Quick actions and empty states

#### Discovery Features (Phase 3)
- ✅ Advanced search with multiple filters
- ✅ Category, tag, AI model, AI tool filtering
- ✅ Trending algorithm (time-decay scoring)
- ✅ Sort options (Trending, Newest, Most Voted, etc.)
- ✅ Filter badges with removal
- ✅ URL state management

#### Community Features (Phase 3-4)
- ✅ Voting system (upvote/downvote)
- ✅ Reviews & ratings (5-star + text)
- ✅ Comments system with threading
- ✅ Bookmarks functionality
- ✅ Notifications system with real-time badge
- ✅ User following system (follow users)
- ✅ Followers/Following list pages
- ✅ Follow button with optimistic UI

### 🚧 In Progress / Remaining Work

For detailed breakdown, see: `/docs/implementation/Phase 4/work-remaining.md`

**🚨 CRITICAL - Launch Blockers (Priority 0):**
- **Base Pages:** About Us, Contact Us, Categories, Trending pages
- **Legal Pages:** Privacy Policy, Terms of Service (GDPR compliance)
- **Dashboard Fixes:** Mobile responsiveness, navigation, statistics
- **Estimated:** 8-11 hours (2-3 sessions) **← START HERE**

**High Priority (Phase 4 Features):**
- Following dashboard integration (feed of products from followed users)
- Product following (follow products, not just users)
- Activity feed/timeline
- Enhanced notifications (product updates, replies)

**Medium Priority:**
- Profile enhancements (statistics, badges)
- Product page enhancements (share, changelog)
- Search enhancements (autocomplete, history)
- Dashboard analytics

**Low Priority:**
- Collections/lists
- Admin panel
- Email system
- Mobile app (PWA)

**Timeline:**
- Launch Readiness: 8-11 hours (2-3 sessions)
- Phase 4 Complete: 20-26 hours (5-6 sessions)
- Full Polish: 32-41 hours (8-10 sessions)

### Key Documentation
- **PRD:** `/docs/PRD.md` - Complete product requirements
- **Work Remaining:** `/docs/implementation/Phase 4/work-remaining.md` - Detailed task breakdown
- **Phase 3 Summary:** `/docs/implementation/Phase 3/DASHBOARD_REDESIGN_SUMMARY.md`
- **Database Schema:** `/lib/db/schema.sql` - All tables with RLS policies
