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

From git status, recent work includes:
- Authentication pages in `app/(auth)/` (login, signup)
- Auth server actions in `lib/auth/`
- UI components: form, input, label
- Styling updates to globals.css, navbar, button

The project is in early development with authentication and basic UI in place. The database schema supports full features (reviews, votes, bookmarks, comments) but many features are not yet implemented in the UI.
