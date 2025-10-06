# Product Requirements Document (PRD)
# AIMadeThis - AI Product Discovery Platform

**Version:** 1.0
**Last Updated:** October 2025
**Status:** Active Development
**Product URL:** https://aimademethis.vercel.app

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Product Overview](#product-overview)
3. [User Personas](#user-personas)
4. [Features & Requirements](#features--requirements)
5. [Technical Architecture](#technical-architecture)
6. [User Flows](#user-flows)
7. [Data Models](#data-models)
8. [Security & Privacy](#security--privacy)
9. [SEO Strategy](#seo-strategy)
10. [Success Metrics](#success-metrics)
11. [Roadmap](#roadmap)
12. [Design System](#design-system)
13. [API Specifications](#api-specifications)
14. [Deployment & Operations](#deployment--operations)

---

## Executive Summary

### Vision
AIMadeThis is a community-driven platform designed to become the go-to destination for discovering, sharing, and discussing AI products built by innovators worldwide. We aim to create a vibrant ecosystem where AI creators can showcase their work and users can discover cutting-edge AI tools and applications.

### Mission
To democratize AI product discovery by providing a platform that connects creators with users, fostering innovation and collaboration in the AI space.

### Target Market
- **Primary:** AI/ML developers, indie hackers, and startups building AI products
- **Secondary:** Tech enthusiasts, early adopters, and businesses seeking AI solutions
- **Market Size:** 4.5M+ AI developers globally (GitHub, 2024)

### Key Objectives
1. Build a comprehensive directory of AI products across all categories
2. Create an engaged community of 10,000+ active users within 6 months
3. Achieve 100,000+ monthly product views by Q2 2026
4. Establish partnerships with 50+ AI product creators

---

## Product Overview

### What is AIMadeThis?

AIMadeThis is a web-based platform that enables users to:
- **Discover** AI products through curated listings, categories, and search
- **Submit** their own AI products with detailed descriptions and media
- **Engage** with the community through reviews, ratings, and discussions
- **Track** their favorite products and creators through bookmarks and follows
- **Vote** on products to surface the best AI tools to the top

### Value Proposition

**For AI Creators:**
- Free platform to showcase their AI products
- Built-in audience of early adopters and tech enthusiasts
- Direct feedback through reviews and community engagement
- SEO-optimized product pages for organic discovery
- Analytics on views, engagement, and user interest

**For Users:**
- Centralized hub for discovering new AI products
- Community-vetted recommendations through voting and reviews
- Personalized discovery through categories and tags
- Save and organize favorite products
- Direct access to creators and product information

### Competitive Advantages
1. **Community-First Approach:** Focus on user-generated content and community curation
2. **Modern Tech Stack:** Built with Next.js 15, ensuring fast performance and SEO
3. **OAuth Integration:** Seamless sign-up with Google and GitHub
4. **Open Platform:** Transparent, community-driven moderation
5. **Developer-Friendly:** API-first architecture for future integrations

---

## User Personas

### Persona 1: Alex - The AI Creator
**Demographics:**
- Age: 28-35
- Occupation: Indie developer / Startup founder
- Tech Savvy: High
- Location: Global (predominantly US, Europe, Asia)

**Goals:**
- Get visibility for their AI product
- Gather user feedback early in development
- Build a user base and community
- Track product performance and engagement

**Pain Points:**
- Hard to get initial traction for new products
- Limited marketing budget
- Difficulty reaching target audience
- Fragmented platforms for product promotion

**How AIMadeThis Helps:**
- Free product listing with SEO benefits
- Built-in audience of interested users
- Direct feedback mechanism
- Simple submission process (< 5 minutes)

### Persona 2: Sarah - The AI Enthusiast
**Demographics:**
- Age: 25-40
- Occupation: Product Manager / Tech professional
- Tech Savvy: Medium-High
- Location: Urban areas, tech hubs

**Goals:**
- Discover new AI tools for work and personal projects
- Stay updated on AI innovation
- Find reliable, community-vetted products
- Save and organize interesting finds

**Pain Points:**
- Overwhelmed by the number of AI tools
- Unsure which products are legitimate/useful
- Time-consuming to research and compare products
- Missing out on new releases

**How AIMadeThis Helps:**
- Curated, categorized product listings
- Community ratings and reviews
- Bookmark and follow features
- Trending and featured sections

### Persona 3: Marcus - The Business Decision Maker
**Demographics:**
- Age: 35-50
- Occupation: CTO / Engineering Manager
- Tech Savvy: Medium-High
- Location: Global, corporate environments

**Goals:**
- Find AI solutions for business problems
- Evaluate tools before making purchasing decisions
- Understand market trends in AI
- Connect with product creators for demos

**Pain Points:**
- Risk of choosing wrong tools
- Need for validated, proven solutions
- Limited time for research
- Concerns about product longevity

**How AIMadeThis Helps:**
- Detailed product information and metadata
- Community reviews and ratings
- Direct contact with creators
- Transparent product history and updates

---

## Features & Requirements

### Phase 1: MVP (Current Development) ✅

#### 1.1 User Authentication ✅ IMPLEMENTED
- **Email/Password Authentication**
  - User registration with username, email, password
  - Email validation with Zod
  - Password minimum length: 6 characters
  - Username constraints: 3-30 characters, alphanumeric + underscore/hyphen

- **OAuth Integration** ✅ IMPLEMENTED
  - Google OAuth
  - GitHub OAuth
  - Automatic profile creation from OAuth metadata
  - Seamless redirect flow

- **Session Management**
  - Cookie-based sessions via Supabase Auth
  - Automatic session refresh in middleware
  - Protected route handling

#### 1.2 User Profiles ✅ IMPLEMENTED (Database Ready)
- **Profile Data:**
  - Username (unique, required)
  - Full name (optional)
  - Avatar URL (from OAuth or upload)
  - Bio (optional, text area)
  - Website link (optional)
  - Social links: Twitter, GitHub
  - Badges array (for achievements)
  - Created/updated timestamps

- **Profile Actions:**
  - View profile page
  - Edit own profile
  - View other users' profiles

#### 1.3 Homepage ✅ IMPLEMENTED
- **Hero Section**
  - Attention-grabbing headline
  - Value proposition
  - CTA buttons (Explore Products, Submit Product)
  - Gradient badge with Sparkles icon

- **Stats Section**
  - Product count
  - Community member count
  - New products this week

- **Featured Products Section**
  - Grid layout (3 columns on desktop)
  - Placeholder cards (to be replaced with real data)
  - Category labels
  - Upvote counts

- **Call-to-Action Section**
  - Encourage product submissions
  - Link to submission form

#### 1.4 Navigation ✅ IMPLEMENTED
- **Navbar Component**
  - Brand logo with gradient
  - Navigation links: Explore, Categories, Trending
  - Theme toggle (dark/light mode)
  - Conditional authentication UI:
    - **Logged Out:** Sign in, Sign up buttons
    - **Logged In:** Profile link, Submit Product button, Sign out

- **Footer Component** ✅ IMPLEMENTED
  - Standard footer with links and branding

#### 1.5 Design System ✅ IMPLEMENTED
- **Theme Support**
  - Light mode with proper contrast
  - Dark mode with muted backgrounds
  - System preference detection
  - Toggle component in navbar

- **Component Library (shadcn/ui)**
  - Button (with variants)
  - Card
  - Input
  - Label
  - Form components
  - All components customizable via Tailwind

- **Color Scheme**
  - Primary: Purple gradient (262 83% 58%)
  - Accent: Blue gradient
  - Proper contrast ratios for accessibility

### Phase 2: Core Features 🚧 IN PROGRESS

#### 2.1 Product Management 📋 DATABASE READY
- **Product Submission**
  - Form fields:
    - Name (3-100 characters, required)
    - Tagline (10-200 characters, required)
    - Description (rich text, required)
    - Image upload (Supabase Storage)
    - Demo URL (optional)
    - Website URL (required)
    - GitHub URL (optional)
    - Category selection (dropdown)
    - Tags (multi-select, create new)
  - Draft/Publish status
  - Auto-generate slug from name
  - Validation with Zod

- **Product Listing Page**
  - Grid/List view toggle
  - Filters:
    - Category
    - Tags
    - Featured status
    - Date range
  - Sorting:
    - Most recent
    - Most upvoted
    - Trending (combination of recency + votes)
  - Pagination (20 items per page)
  - Search functionality (full-text)

- **Product Detail Page**
  - Hero section with image/video
  - Product information
  - Upvote button
  - Bookmark button
  - Share buttons
  - Creator profile card
  - Related products section
  - Comments section
  - Reviews section

- **Product Edit/Delete**
  - Edit form (same as submission)
  - Soft delete (archive status)
  - Only creator can edit/delete

#### 2.2 Discovery Features 📋 PLANNED
- **Search**
  - Full-text search on name, tagline, description
  - Real-time results
  - Search suggestions
  - Filter integration

- **Categories**
  - Predefined categories:
    - Productivity
    - Development Tools
    - Content Creation
    - Marketing
    - Data Analysis
    - Education
    - Entertainment
    - Healthcare
    - Finance
    - Other
  - Category landing pages
  - Category icons

- **Tags**
  - User-generated tags
  - Tag clouds
  - Tag-based filtering
  - Popular tags widget

- **Trending Algorithm**
  - Formula: `(upvotes * 0.7) + (views * 0.2) + (comments * 0.1)` / days_since_published
  - Time decay factor
  - Refresh every 6 hours

#### 2.3 Community Features 📋 DATABASE READY

**Voting System**
- Upvote/downvote on products
- One vote per user per product
- Vote count displayed prominently
- Real-time updates
- Vote history in user profile

**Reviews & Ratings**
- 5-star rating system
- Text review (optional)
- One review per user per product
- Edit/delete own reviews
- Average rating calculation
- Review helpful votes (future)

**Bookmarks**
- Save products for later
- Organize into collections (future)
- Bookmark count for products
- User bookmark page

**Comments**
- Comment on products
- Nested comments (parent_id support)
- Edit/delete own comments
- Markdown support (future)
- @mentions (future)
- Comment threading

**Follows**
- Follow creators
- Follow products for updates
- Follower/following counts
- Follow feed (future)

### Phase 3: Growth Features 📋 PLANNED

#### 3.1 User Engagement
- **Notifications**
  - New followers
  - Product updates from followed creators
  - Comments on own products
  - Review notifications
  - Email digest (opt-in)

- **User Dashboard**
  - Submitted products
  - Bookmarks
  - Following feed
  - Activity history
  - Analytics for creators

- **Badges & Achievements**
  - Early adopter
  - Top contributor
  - Product of the month
  - Active commenter
  - Displayed on profiles

#### 3.2 Content & Curation
- **Product Collections**
  - Curated lists by admins
  - User-created collections
  - Theme-based (e.g., "Best AI Writing Tools")
  - Share collections

- **Featured Products**
  - Admin-selected featured products
  - Rotation schedule
  - Featured badge
  - Homepage placement

- **Newsletter**
  - Weekly digest
  - Featured products
  - Trending products
  - Community highlights

#### 3.3 Creator Tools
- **Analytics Dashboard**
  - Views over time
  - Engagement metrics
  - Geographic data
  - Referral sources

- **Product Updates**
  - Changelog feature
  - Notify followers
  - Version history

- **Verified Badges**
  - Verification for official products
  - Creator verification

### Phase 4: Platform Expansion 📋 FUTURE

#### 4.1 API & Integrations
- **Public API**
  - RESTful API
  - Rate limiting
  - API keys
  - Documentation

- **Webhooks**
  - New product notifications
  - Update notifications

- **Integrations**
  - Product Hunt
  - Discord bot
  - Slack integration
  - Twitter bot

#### 4.2 Monetization (Optional)
- **Premium Listings**
  - Featured placement
  - Enhanced visibility
  - Analytics access

- **Sponsored Products**
  - Clearly marked as sponsored
  - Priority placement

- **Job Board**
  - AI-related job postings
  - Connection with products

#### 4.3 Advanced Features
- **AI Recommendations**
  - Personalized product suggestions
  - Similar products
  - "You might also like"

- **Product Comparison**
  - Side-by-side comparison
  - Feature matrix

- **Video Reviews**
  - Video upload support
  - YouTube embeds

---

## Technical Architecture

### Technology Stack

**Frontend:**
- **Framework:** Next.js 15.5.4
  - App Router architecture
  - Server Components by default
  - Turbopack for fast builds
- **Language:** TypeScript 5.9.3
- **Styling:** TailwindCSS v4
- **UI Components:** shadcn/ui (source-based, not package)
- **Icons:** Lucide React
- **Animations:** Framer Motion

**Backend:**
- **Database:** Supabase PostgreSQL
- **Authentication:** Supabase Auth
  - Email/Password
  - OAuth (Google, GitHub)
- **Storage:** Supabase Storage (for images, media)
- **Realtime:** Supabase Realtime (for live updates)

**State Management:**
- **Client State:** React Query (@tanstack/react-query)
  - Stale time: 1 minute
  - GC time: 5 minutes
- **Server State:** Server Components + Server Actions
- **Forms:** React Hook Form + Zod validation

**Deployment:**
- **Hosting:** Vercel
- **Domain:** aimademethis.vercel.app
- **Environment:** Production, Preview, Development

**Development Tools:**
- **Linting:** ESLint 9 with Next.js config
- **Type Checking:** TypeScript strict mode
- **Package Manager:** npm
- **Version Control:** Git + GitHub

### System Architecture

```
┌─────────────────┐
│   Vercel CDN    │ ← Static assets, edge caching
└────────┬────────┘
         │
┌────────▼────────┐
│   Next.js App   │ ← Server-side rendering, API routes
│   (App Router)  │
└────────┬────────┘
         │
┌────────▼────────┐
│    Supabase     │ ← Database, Auth, Storage, Realtime
│   (PostgreSQL)  │
└─────────────────┘
```

### Database Architecture

**Total Tables:** 10
- profiles
- products
- categories
- tags
- product_tags (junction)
- reviews
- votes
- bookmarks
- comments
- follows

**Key Features:**
- Row Level Security (RLS) enabled on all tables
- Optimized indexes for common queries
- Full-text search on products
- Referential integrity with foreign keys
- Soft deletes via status field

### Authentication Flow

```
1. User visits /login or /signup
2. Chooses authentication method:
   a) Email/Password → Server Action → Supabase Auth
   b) OAuth (Google/GitHub) → OAuth flow → Supabase callback
3. Supabase creates session
4. Middleware refreshes session on each request
5. Protected routes check session
6. User redirected appropriately
```

### Data Flow

**Product Submission Flow:**
```
1. User fills form (Client Component)
2. Form validation (Zod schema)
3. Submit → Server Action
4. Upload image to Supabase Storage (if provided)
5. Insert product into database
6. RLS policy checks user owns product
7. Redirect to product page
8. Revalidate product list cache
```

### API Routes (Planned)

**Public Routes:**
- `GET /api/products` - List products (with filters)
- `GET /api/products/[slug]` - Get product details
- `GET /api/categories` - List categories
- `GET /api/tags` - List tags
- `GET /api/search` - Search products

**Authenticated Routes:**
- `POST /api/products` - Create product
- `PATCH /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product
- `POST /api/products/[id]/vote` - Vote on product
- `POST /api/products/[id]/bookmark` - Bookmark product
- `POST /api/products/[id]/review` - Review product
- `POST /api/products/[id]/comment` - Comment on product
- `POST /api/upload` - Upload image

### Performance Optimization

**Strategies:**
1. **Static Site Generation (SSG):**
   - Homepage
   - Category pages
   - Product detail pages (ISR with revalidation)

2. **Incremental Static Regeneration (ISR):**
   - Product pages revalidate every 60 seconds
   - Category pages revalidate on demand

3. **Server Components:**
   - Default for all pages
   - Reduce client-side JavaScript
   - Faster initial page loads

4. **Image Optimization:**
   - Next.js Image component
   - Automatic WebP conversion
   - Lazy loading
   - Responsive sizes

5. **Database Optimization:**
   - Strategic indexes
   - Query optimization
   - Connection pooling via Supabase

6. **Caching Strategy:**
   - React Query for client-side caching
   - Vercel edge caching
   - Supabase query caching

### Security Measures

1. **Row Level Security (RLS):**
   - Enforced at database level
   - User can only modify own content
   - Public data readable by all

2. **Authentication:**
   - Secure session management
   - HTTP-only cookies
   - CSRF protection

3. **Input Validation:**
   - Zod schemas on client and server
   - SQL injection prevention (Supabase client)
   - XSS prevention

4. **Rate Limiting (Planned):**
   - API rate limits
   - Form submission throttling
   - IP-based limits

5. **Environment Variables:**
   - Secrets never in code
   - Vercel environment management
   - Separate dev/prod credentials

---

## User Flows

### Flow 1: New User Sign Up

```
1. User lands on homepage
2. Clicks "Sign up" in navbar
3. Arrives at /signup page
4. Chooses auth method:
   Option A - Email/Password:
   - Enters username, email, password
   - Clicks "Create Account"
   - Form validates with Zod
   - Server action creates user + profile
   - Success message shown
   - Redirects to homepage (logged in)

   Option B - OAuth (Google/GitHub):
   - Clicks "Continue with Google/GitHub"
   - Redirects to OAuth provider
   - Authorizes application
   - Redirects back to /auth/callback
   - Callback creates/updates profile
   - Redirects to homepage (logged in)
5. Navbar now shows username and "Submit Product" button
```

### Flow 2: Product Submission

```
1. User clicks "Submit Product" (navbar or CTA)
2. Middleware checks authentication:
   - If not logged in → redirect to /login
   - If logged in → proceed to /products/new
3. User fills product submission form:
   - Name
   - Tagline
   - Description
   - Upload image (optional)
   - Website URL
   - Demo URL (optional)
   - GitHub URL (optional)
   - Select category
   - Add tags
4. Client-side validation (React Hook Form + Zod)
5. Submit → Server Action
6. Image upload to Supabase Storage (if provided)
7. Product inserted into database
8. Success! Redirect to new product page
9. Product appears in "Explore" and homepage
```

### Flow 3: Product Discovery

```
1. User lands on homepage
2. Sees featured products in grid
3. Clicks "Explore Products" or navbar "Explore"
4. Arrives at /products page
5. Sees product grid with filters:
   - Category filter (sidebar)
   - Tag filter
   - Sort options (Newest, Most Upvoted, Trending)
6. User applies filters:
   - URL updates (e.g., /products?category=productivity&sort=trending)
   - Page re-renders with filtered results
7. User clicks on product card
8. Arrives at /products/[slug] page
9. Sees full product details, comments, reviews
10. Can upvote, bookmark, or comment (if logged in)
```

### Flow 4: Upvoting a Product

```
1. User viewing product detail page
2. Sees upvote button with count
3. Clicks upvote button:
   - If not logged in → modal prompts to sign in
   - If logged in → proceed
4. Optimistic UI update (button fills, count increments)
5. API call to /api/products/[id]/vote
6. Server action:
   - Checks if user already voted
   - If yes: toggle vote (remove or change)
   - If no: create new vote
   - Update product upvotes_count
7. UI confirms vote with animation
8. Vote persists in database
```

### Flow 5: Leaving a Review

```
1. User on product detail page
2. Scrolls to "Reviews" section
3. Clicks "Write a Review" button:
   - If not logged in → redirect to /login
   - If logged in → review form appears
4. User selects star rating (1-5)
5. User writes review text (optional)
6. Clicks "Submit Review"
7. Client validation
8. Server action:
   - Checks user hasn't reviewed before
   - Inserts review
   - Recalculates average rating
9. Review appears in list
10. User can edit/delete own review
```

---

## Data Models

### Table: profiles
**Description:** User profiles extending Supabase auth.users

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, FK to auth.users | User ID from Supabase Auth |
| username | TEXT | UNIQUE, NOT NULL | Unique username, 3-30 chars |
| full_name | TEXT | NULL | User's full name |
| avatar_url | TEXT | NULL | Profile picture URL |
| bio | TEXT | NULL | User bio/description |
| website | TEXT | NULL | Personal website |
| twitter | TEXT | NULL | Twitter handle |
| github | TEXT | NULL | GitHub username |
| badges | TEXT[] | DEFAULT '{}' | Achievement badges |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Account creation time |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last profile update |

**Indexes:**
- `idx_profiles_username` on username

**RLS Policies:**
- Public profiles viewable by everyone
- Users can insert their own profile
- Users can update their own profile

---

### Table: products
**Description:** AI product listings

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Product ID |
| slug | TEXT | UNIQUE, NOT NULL | URL-friendly identifier |
| name | TEXT | NOT NULL, 3-100 chars | Product name |
| tagline | TEXT | NOT NULL, 10-200 chars | Short description |
| description | TEXT | NOT NULL | Full description |
| image_url | TEXT | NULL | Product image/logo |
| demo_url | TEXT | NULL | Demo or video URL |
| website_url | TEXT | NULL | Official website |
| github_url | TEXT | NULL | GitHub repository |
| category_id | UUID | FK to categories | Product category |
| user_id | UUID | FK to profiles, NOT NULL | Creator/submitter |
| featured | BOOLEAN | DEFAULT FALSE | Featured status |
| status | TEXT | DEFAULT 'published' | draft/published/archived |
| metadata | JSONB | NULL | Additional structured data |
| views_count | INTEGER | DEFAULT 0 | View count |
| upvotes_count | INTEGER | DEFAULT 0 | Upvote count |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Submission time |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last update time |

**Indexes:**
- `idx_products_slug` on slug
- `idx_products_user_id` on user_id
- `idx_products_category_id` on category_id
- `idx_products_status` on status
- `idx_products_created_at` on created_at DESC
- `idx_products_upvotes` on upvotes_count DESC
- `idx_products_featured` on featured (partial, WHERE featured = TRUE)
- `idx_products_search` Full-text search (GIN index)

**RLS Policies:**
- Published products viewable by everyone
- Users can view their own drafts
- Users can insert their own products
- Users can update their own products
- Users can delete their own products

---

### Table: categories
**Description:** Product categories

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Category ID |
| name | TEXT | NOT NULL | Category name |
| slug | TEXT | UNIQUE, NOT NULL | URL-friendly identifier |
| description | TEXT | NULL | Category description |
| icon | TEXT | NULL | Icon identifier |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Creation time |

**RLS Policies:**
- Categories viewable by everyone (read-only for users)

---

### Table: tags
**Description:** Product tags

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Tag ID |
| name | TEXT | UNIQUE, NOT NULL | Tag name |
| slug | TEXT | UNIQUE, NOT NULL | URL-friendly identifier |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Creation time |

**RLS Policies:**
- Tags viewable by everyone (read-only for users)

---

### Table: product_tags
**Description:** Many-to-many relationship between products and tags

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| product_id | UUID | FK to products | Product reference |
| tag_id | UUID | FK to tags | Tag reference |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Association time |

**Primary Key:** (product_id, tag_id)

**Indexes:**
- `idx_product_tags_product_id` on product_id
- `idx_product_tags_tag_id` on tag_id

**RLS Policies:**
- Product tags viewable by everyone
- Users can manage tags for their own products

---

### Table: reviews
**Description:** Product reviews and ratings

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Review ID |
| product_id | UUID | FK to products, NOT NULL | Product reference |
| user_id | UUID | FK to profiles, NOT NULL | Reviewer |
| rating | INTEGER | NOT NULL, 1-5 | Star rating |
| comment | TEXT | NULL | Review text |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Review time |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last edit time |

**Unique Constraint:** (product_id, user_id) - One review per user per product

**Indexes:**
- `idx_reviews_product_id` on product_id
- `idx_reviews_user_id` on user_id

**RLS Policies:**
- Reviews viewable by everyone
- Authenticated users can create reviews
- Users can update their own reviews
- Users can delete their own reviews

---

### Table: votes
**Description:** Product upvotes/downvotes

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Vote ID |
| product_id | UUID | FK to products, NOT NULL | Product reference |
| user_id | UUID | FK to profiles, NOT NULL | Voter |
| vote_type | TEXT | NOT NULL, upvote/downvote | Vote type |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Vote time |

**Unique Constraint:** (product_id, user_id) - One vote per user per product

**Indexes:**
- `idx_votes_product_id` on product_id
- `idx_votes_user_id` on user_id

**RLS Policies:**
- Votes viewable by everyone
- Authenticated users can create votes
- Users can update their own votes
- Users can delete their own votes

---

### Table: bookmarks
**Description:** User-saved products

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Bookmark ID |
| product_id | UUID | FK to products, NOT NULL | Product reference |
| user_id | UUID | FK to profiles, NOT NULL | User who bookmarked |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Bookmark time |

**Unique Constraint:** (product_id, user_id) - One bookmark per user per product

**Indexes:**
- `idx_bookmarks_user_id` on user_id
- `idx_bookmarks_product_id` on product_id

**RLS Policies:**
- Users can view their own bookmarks
- Users can create their own bookmarks
- Users can delete their own bookmarks

---

### Table: comments
**Description:** Product discussion comments

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Comment ID |
| product_id | UUID | FK to products, NOT NULL | Product reference |
| user_id | UUID | FK to profiles, NOT NULL | Commenter |
| content | TEXT | NOT NULL | Comment text |
| parent_id | UUID | FK to comments, NULL | Parent comment (for threading) |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Comment time |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last edit time |

**Indexes:**
- `idx_comments_product_id` on product_id
- `idx_comments_parent_id` on parent_id

**RLS Policies:**
- Comments viewable by everyone
- Authenticated users can create comments
- Users can update their own comments
- Users can delete their own comments

---

### Table: follows
**Description:** User follows (creators or products)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Follow ID |
| follower_id | UUID | FK to profiles, NOT NULL | User who follows |
| following_id | UUID | FK to profiles, NULL | User being followed |
| product_id | UUID | FK to products, NULL | Product being followed |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Follow time |

**Constraints:**
- CHECK: following_id OR product_id must be set (not both NULL)
- CHECK: follower_id != following_id (can't follow self)
- UNIQUE: (follower_id, following_id)
- UNIQUE: (follower_id, product_id)

**RLS Policies:**
- Users can view their own follows
- Users can view who follows them
- Users can create their own follows
- Users can delete their own follows

---

## Security & Privacy

### Authentication Security

1. **Password Requirements:**
   - Minimum 6 characters
   - Hashed with bcrypt via Supabase
   - Never stored in plain text

2. **Session Management:**
   - HTTP-only cookies
   - Secure flag in production
   - Auto-refresh mechanism in middleware
   - Configurable session duration (7 days default)

3. **OAuth Security:**
   - State parameter to prevent CSRF
   - Secure redirect URLs configured
   - Token exchange via Supabase

### Row Level Security (RLS)

All tables have RLS enabled with specific policies:

**Read Policies:**
- Public data (profiles, published products, reviews, comments) readable by all
- Private data (bookmarks, drafts) only readable by owner

**Write Policies:**
- Users can only create content as themselves (auth.uid() check)
- Users can only modify their own content
- Cascading deletes ensure data integrity

### Data Privacy

1. **User Data:**
   - Email addresses not exposed publicly
   - Optional profile fields (bio, social links)
   - Users control what information is public

2. **GDPR Compliance (Future):**
   - Right to access data
   - Right to deletion
   - Data export functionality
   - Privacy policy and terms of service

3. **Content Moderation:**
   - Community reporting system (future)
   - Admin moderation tools (future)
   - Content guidelines enforcement

### API Security (Planned)

1. **Rate Limiting:**
   - Per-IP limits
   - Per-user limits (authenticated)
   - Different limits for different endpoints

2. **API Keys:**
   - Required for API access
   - Usage tracking
   - Quota management

3. **Input Sanitization:**
   - Zod validation on all inputs
   - HTML sanitization for rich text
   - SQL injection prevention (Supabase client)

---

## SEO Strategy

### On-Page SEO ✅ IMPLEMENTED

1. **Metadata API (Next.js 15):**
   - Dynamic metadata per page
   - Title, description, keywords
   - Open Graph tags
   - Twitter Card tags

2. **Semantic HTML:**
   - Proper heading hierarchy (H1 → H6)
   - Semantic elements (article, section, nav)
   - Accessible markup (ARIA labels)

3. **Structured Data (JSON-LD):**
   - Product schema
   - Organization schema
   - BreadcrumbList schema
   - Review schema

### Technical SEO ✅ IMPLEMENTED

1. **Sitemap:**
   - Dynamic sitemap.xml generation
   - Includes all public pages
   - Updates automatically
   - Submitted to Google Search Console

2. **Robots.txt:**
   - Configured for crawlers
   - Allows all legitimate bots
   - Points to sitemap

3. **Performance:**
   - Server-side rendering for SEO
   - Fast page loads (< 2s)
   - Optimized images
   - Minimal JavaScript

4. **Mobile Optimization:**
   - Responsive design
   - Mobile-first approach
   - Touch-friendly UI

### Content SEO 📋 PLANNED

1. **Product Pages:**
   - Unique titles and descriptions
   - Rich media (images, videos)
   - User-generated content (reviews, comments)
   - Internal linking

2. **Category Pages:**
   - Category-specific content
   - Curated product lists
   - Keyword optimization

3. **Blog (Future):**
   - AI product news
   - Guides and tutorials
   - Product showcases
   - Backlink generation

### Off-Page SEO 📋 PLANNED

1. **Backlinks:**
   - Submit to directories
   - Partner with AI communities
   - Guest posts on tech blogs
   - Social media presence

2. **Social Signals:**
   - Share buttons on products
   - Social media integration
   - Community engagement

---

## Success Metrics

### Key Performance Indicators (KPIs)

**User Acquisition:**
- Monthly Active Users (MAU): Target 10,000 by Q2 2026
- New sign-ups per month: Target 500+
- OAuth vs. email sign-up ratio
- User retention rate (30-day): Target 40%

**Content Metrics:**
- Total products submitted: Target 500+ by Q1 2026
- Products per week: Target 20+
- Average products per user: Target 2+
- Draft to published ratio

**Engagement Metrics:**
- Average session duration: Target 5+ minutes
- Pages per session: Target 4+
- Upvotes per product: Target 10+ average
- Comments per product: Target 3+ average
- Bookmark rate: Target 15% of views

**Traffic Metrics:**
- Monthly page views: Target 100,000+ by Q2 2026
- Organic search traffic: Target 40% of total
- Direct traffic: Target 30% of total
- Referral traffic: Target 20% of total
- Social traffic: Target 10% of total

**SEO Metrics:**
- Domain Authority: Target 30+ by Q3 2026
- Indexed pages: Target 1,000+
- Average position for "AI products": Top 10
- Featured snippets: Target 5+

**Business Metrics (Future):**
- Cost per acquisition (CPA)
- Lifetime value (LTV)
- Revenue (if monetized)
- ROI on marketing spend

### Analytics Implementation

**Tools:**
- Google Analytics 4 (optional via env var)
- Supabase Analytics (built-in)
- Custom event tracking

**Events to Track:**
- Page views
- Sign-ups (method: email vs. OAuth)
- Product submissions
- Upvotes
- Bookmarks
- Comments
- Searches
- Profile views

### Success Criteria

**MVP Launch (Phase 1):**
- ✅ 100+ products submitted
- ✅ 500+ registered users
- ✅ 5,000+ monthly page views
- ✅ 50+ daily active users

**Growth Phase (Phase 2):**
- 500+ products
- 2,000+ registered users
- 30,000+ monthly page views
- 200+ daily active users
- 3.0+ average rating across products

**Scale Phase (Phase 3):**
- 2,000+ products
- 10,000+ registered users
- 100,000+ monthly page views
- 1,000+ daily active users
- Active community engagement

---

## Roadmap

### Q4 2025: MVP Launch ✅ IN PROGRESS
**Goal:** Launch core platform with authentication and basic features

**Milestones:**
- ✅ Authentication system (email + OAuth)
- ✅ User profiles
- ✅ Homepage design
- ✅ Navigation and footer
- ✅ Theme support (dark/light)
- 🚧 Product submission form
- 🚧 Product listing page
- 🚧 Product detail page
- 🚧 Basic search
- 🚧 Category filtering

**Launch Criteria:**
- 50+ beta users
- 100+ products submitted
- Stable, bug-free experience
- Mobile-responsive design

---

### Q1 2026: Community Features
**Goal:** Enable community engagement and interaction

**Features:**
- Voting system (upvote/downvote)
- Review and rating system
- Comment system
- Bookmark functionality
- User profiles enhanced
- Product edit/delete
- Email notifications

**Metrics:**
- 500+ registered users
- 300+ products
- 50+ comments/day
- 100+ votes/day

---

### Q2 2026: Discovery & Curation
**Goal:** Improve product discovery and user experience

**Features:**
- Advanced search with filters
- Trending algorithm
- Featured products section
- Tag-based discovery
- Related products
- Collections (curated lists)
- Newsletter (weekly digest)
- Creator analytics dashboard

**Metrics:**
- 2,000+ registered users
- 500+ products
- 30,000+ monthly page views
- 3,000+ search queries/month

---

### Q3 2026: Growth & Engagement
**Goal:** Scale user base and increase engagement

**Features:**
- Follow system (creators + products)
- Activity feed
- Badges and achievements
- Product updates/changelog
- User dashboard improvements
- Mobile app (PWA)
- Enhanced SEO
- Blog launch

**Metrics:**
- 5,000+ registered users
- 1,000+ products
- 60,000+ monthly page views
- 40% user retention (30-day)

---

### Q4 2026: Platform Expansion
**Goal:** Expand platform capabilities and reach

**Features:**
- Public API launch
- Webhooks
- Discord bot
- Product comparison tool
- AI-powered recommendations
- Advanced analytics for creators
- Partnership program
- Premium features (optional)

**Metrics:**
- 10,000+ registered users
- 2,000+ products
- 100,000+ monthly page views
- 100+ API users

---

### 2027 & Beyond: Scale & Innovate
**Goal:** Become the leading AI product discovery platform

**Future Considerations:**
- Video reviews and demos
- Live product launches
- Virtual events
- Job board integration
- Marketplace features
- White-label solutions
- International expansion

---

## Design System

### Color Palette

**Primary Colors:**
- **Purple:** `hsl(262, 83%, 58%)` - Primary brand color
- **Blue:** `hsl(210, 100%, 50%)` - Accent color
- **Gradient:** Purple to Blue - Used for brand elements

**Semantic Colors:**
- **Success:** `hsl(142, 76%, 36%)` - Green
- **Error:** `hsl(0, 84%, 60%)` - Red
- **Warning:** `hsl(38, 92%, 50%)` - Orange
- **Info:** `hsl(221, 83%, 53%)` - Blue

**Neutral Colors:**
- **Background (Light):** `hsl(0, 0%, 100%)` - White
- **Background (Dark):** `hsl(222, 47%, 11%)` - Dark blue-gray
- **Foreground (Light):** `hsl(222, 47%, 11%)` - Dark text
- **Foreground (Dark):** `hsl(210, 40%, 98%)` - Light text
- **Muted:** `hsl(210, 40%, 96.1%)` (light) / `hsl(217, 33%, 17%)` (dark)

### Typography

**Font Family:**
- **Primary:** Inter (from Google Fonts)
- **Fallback:** -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui

**Font Sizes:**
- **H1:** 3rem (48px) / 4.5rem (72px) on large screens
- **H2:** 2.25rem (36px)
- **H3:** 1.875rem (30px)
- **H4:** 1.5rem (24px)
- **Body:** 1rem (16px)
- **Small:** 0.875rem (14px)
- **Extra Small:** 0.75rem (12px)

**Font Weights:**
- **Regular:** 400
- **Medium:** 500
- **Semibold:** 600
- **Bold:** 700

### Spacing Scale
Based on 4px base unit:
- **xs:** 0.25rem (4px)
- **sm:** 0.5rem (8px)
- **md:** 1rem (16px)
- **lg:** 1.5rem (24px)
- **xl:** 2rem (32px)
- **2xl:** 3rem (48px)
- **3xl:** 4rem (64px)

### Border Radius
- **sm:** 0.375rem (6px)
- **md:** 0.5rem (8px)
- **lg:** 0.75rem (12px)
- **xl:** 1rem (16px)
- **full:** 9999px (pill shape)

### Shadows
- **sm:** `0 1px 2px 0 rgb(0 0 0 / 0.05)`
- **md:** `0 4px 6px -1px rgb(0 0 0 / 0.1)`
- **lg:** `0 10px 15px -3px rgb(0 0 0 / 0.1)`

### Components

**Button Variants:**
- **Default:** Purple gradient background, white text
- **Outline:** Border with transparent background
- **Ghost:** No border, transparent background
- **Link:** Text only, underline on hover

**Button Sizes:**
- **sm:** Padding 0.5rem 1rem, text-sm
- **md:** Padding 0.75rem 1.5rem, text-base (default)
- **lg:** Padding 1rem 2rem, text-lg

**Card:**
- Border radius: lg
- Border: 1px solid border color
- Padding: 1.5rem
- Background: card background color
- Hover: Shadow transition

**Input:**
- Border radius: md
- Border: 1px solid border color
- Padding: 0.5rem 0.75rem
- Focus: Ring effect with primary color

### Icons
**Library:** Lucide React
**Size Guide:**
- **sm:** 16px (w-4 h-4)
- **md:** 20px (w-5 h-5)
- **lg:** 24px (w-6 h-6)

### Animations
**Library:** Framer Motion
**Common Animations:**
- Fade in/out
- Slide in/out
- Scale on hover
- Stagger children

---

## API Specifications

### REST API Endpoints (Planned)

**Base URL:** `https://aimademethis.vercel.app/api`

---

#### Products

**GET /api/products**
- **Description:** List all published products
- **Auth:** Optional (affects response)
- **Query Parameters:**
  - `category` (string): Filter by category slug
  - `tags` (string[]): Filter by tag slugs
  - `search` (string): Full-text search
  - `sort` (string): `newest`, `trending`, `upvotes`
  - `page` (number): Page number (default: 1)
  - `limit` (number): Items per page (default: 20, max: 100)
- **Response:**
  ```json
  {
    "products": [
      {
        "id": "uuid",
        "slug": "product-name",
        "name": "Product Name",
        "tagline": "Short description",
        "image_url": "https://...",
        "category": { "name": "Category", "slug": "category" },
        "user": { "username": "creator", "avatar_url": "https://..." },
        "upvotes_count": 42,
        "views_count": 1234,
        "created_at": "2025-10-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
  ```

**GET /api/products/[slug]**
- **Description:** Get product details
- **Auth:** Optional
- **Response:**
  ```json
  {
    "id": "uuid",
    "slug": "product-name",
    "name": "Product Name",
    "tagline": "Short description",
    "description": "Full description...",
    "image_url": "https://...",
    "demo_url": "https://...",
    "website_url": "https://...",
    "github_url": "https://...",
    "category": { "id": "uuid", "name": "Category", "slug": "category" },
    "tags": [
      { "id": "uuid", "name": "Tag", "slug": "tag" }
    ],
    "user": {
      "id": "uuid",
      "username": "creator",
      "full_name": "Creator Name",
      "avatar_url": "https://..."
    },
    "upvotes_count": 42,
    "views_count": 1234,
    "average_rating": 4.5,
    "created_at": "2025-10-01T00:00:00Z",
    "updated_at": "2025-10-05T00:00:00Z"
  }
  ```

**POST /api/products**
- **Description:** Create a new product
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "name": "Product Name",
    "tagline": "Short description",
    "description": "Full description...",
    "website_url": "https://...",
    "demo_url": "https://...",
    "github_url": "https://...",
    "category_id": "uuid",
    "tags": ["tag-1", "tag-2"],
    "image": "base64_or_url",
    "status": "published"
  }
  ```
- **Response:** Created product object (201)

**PATCH /api/products/[id]**
- **Description:** Update a product
- **Auth:** Required (must be owner)
- **Request Body:** Partial product object
- **Response:** Updated product object (200)

**DELETE /api/products/[id]**
- **Description:** Delete a product
- **Auth:** Required (must be owner)
- **Response:** Success message (204)

---

#### Votes

**POST /api/products/[id]/vote**
- **Description:** Vote on a product
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "vote_type": "upvote"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "upvotes_count": 43
  }
  ```

**DELETE /api/products/[id]/vote**
- **Description:** Remove vote
- **Auth:** Required
- **Response:** Success message (204)

---

#### Bookmarks

**POST /api/products/[id]/bookmark**
- **Description:** Bookmark a product
- **Auth:** Required
- **Response:**
  ```json
  {
    "success": true,
    "bookmarked": true
  }
  ```

**DELETE /api/products/[id]/bookmark**
- **Description:** Remove bookmark
- **Auth:** Required
- **Response:** Success message (204)

**GET /api/bookmarks**
- **Description:** Get user's bookmarks
- **Auth:** Required
- **Response:** Array of bookmarked products

---

#### Reviews

**POST /api/products/[id]/review**
- **Description:** Submit a review
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "rating": 5,
    "comment": "Great product!"
  }
  ```
- **Response:** Created review object (201)

**GET /api/products/[id]/reviews**
- **Description:** Get product reviews
- **Auth:** Optional
- **Query:** `page`, `limit`
- **Response:** Paginated reviews array

---

#### Comments

**POST /api/products/[id]/comment**
- **Description:** Add a comment
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "content": "Comment text",
    "parent_id": "uuid" // optional
  }
  ```
- **Response:** Created comment object (201)

**GET /api/products/[id]/comments**
- **Description:** Get product comments
- **Auth:** Optional
- **Response:** Nested comments array

---

#### Categories & Tags

**GET /api/categories**
- **Description:** List all categories
- **Auth:** Optional
- **Response:** Array of category objects

**GET /api/tags**
- **Description:** List all tags
- **Auth:** Optional
- **Query:** `popular` (boolean) - Get top tags
- **Response:** Array of tag objects

---

### Error Responses

All endpoints return errors in this format:
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "status": 400
}
```

**Common Error Codes:**
- `UNAUTHORIZED` (401): Authentication required
- `FORBIDDEN` (403): Permission denied
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (400): Invalid input
- `RATE_LIMIT_EXCEEDED` (429): Too many requests
- `SERVER_ERROR` (500): Internal server error

---

## Deployment & Operations

### Deployment Strategy

**Platform:** Vercel
**Repository:** GitHub
**Deployment Triggers:**
- Push to `main` branch → Production deployment
- Pull request → Preview deployment
- Manual deployment via Vercel dashboard

**Environment Variables:**
```bash
# Production
NEXT_PUBLIC_SUPABASE_URL=https://mtcqpmpyvffkyirotqgp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[production-key]
NEXT_PUBLIC_SITE_URL=https://aimademethis.vercel.app
NEXT_PUBLIC_GA_MEASUREMENT_ID=[optional]

# Development
NEXT_PUBLIC_SUPABASE_URL=https://mtcqpmpyvffkyirotqgp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[dev-key]
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Monitoring & Logging

**Vercel Analytics:**
- Real-time traffic metrics
- Core Web Vitals
- Error tracking

**Supabase Logs:**
- Database query logs
- Auth logs
- Storage logs
- API logs

**Custom Logging:**
- Server action errors
- Client-side errors (via error boundaries)
- Performance metrics

### Backup Strategy

**Database Backups:**
- Automatic daily backups (Supabase)
- Point-in-time recovery available
- Manual backups before major migrations

**Code Backups:**
- Git repository on GitHub
- Vercel deployment history

### Maintenance Windows

**Regular Maintenance:**
- Scheduled: Sundays 2-4 AM UTC (low traffic period)
- Notification: 48 hours advance notice

**Emergency Maintenance:**
- As needed for critical issues
- Status updates via Twitter/email

### Incident Response

**Severity Levels:**
1. **Critical:** Site down, data loss
2. **High:** Major features broken
3. **Medium:** Minor features broken
4. **Low:** Cosmetic issues

**Response Times:**
- Critical: < 15 minutes
- High: < 1 hour
- Medium: < 4 hours
- Low: Next business day

### Scaling Plan

**Current Infrastructure:**
- Vercel: Hobby plan → Pro plan as needed
- Supabase: Free tier → Pro tier at 100+ concurrent users
- Storage: Expand as needed

**Scaling Triggers:**
- 80% resource utilization
- Consistent latency > 500ms
- Database connections > 80% of limit

**Scaling Actions:**
- Upgrade Vercel plan
- Upgrade Supabase plan
- Implement caching layer (Redis)
- Add CDN for static assets
- Database read replicas

### Cost Projections

**Current (MVP):**
- Vercel: Free
- Supabase: Free
- Domain: $10/year
- **Total:** ~$10/year

**Growth Phase (5K users):**
- Vercel Pro: $20/month
- Supabase Pro: $25/month
- Domain: $10/year
- **Total:** ~$550/year

**Scale Phase (50K users):**
- Vercel: $100/month
- Supabase: $100/month
- CDN: $50/month
- Monitoring: $30/month
- **Total:** ~$3,400/year

---

## Appendix

### A. Glossary

- **MVP:** Minimum Viable Product
- **RLS:** Row Level Security
- **SSR:** Server-Side Rendering
- **ISR:** Incremental Static Regeneration
- **OAuth:** Open Authorization
- **SEO:** Search Engine Optimization
- **API:** Application Programming Interface
- **CRUD:** Create, Read, Update, Delete
- **JWT:** JSON Web Token
- **UUID:** Universally Unique Identifier

### B. References

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)

### C. Contact & Support

- **Product Owner:** [Your Name]
- **Technical Lead:** [Tech Lead Name]
- **GitHub Issues:** [Repository URL]/issues
- **Email:** support@aimademethis.com (future)

---

**Document Version:** 1.0
**Last Updated:** October 6, 2025
**Next Review:** January 2026
