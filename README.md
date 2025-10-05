# AIMadeThis - AI Product Discovery Platform

A community-driven platform for discovering, sharing, and discussing AI products built by innovators worldwide.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Styling**: TailwindCSS + shadcn/ui
- **State Management**: React Query (@tanstack/react-query)
- **Forms**: React Hook Form + Zod
- **Type Safety**: TypeScript
- **Deployment**: Vercel (recommended)

## 🏗️ Project Structure

```
aimademethis/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── products/          # Product pages
│   ├── categories/        # Category pages
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout with SEO
│   ├── page.tsx           # Homepage
│   ├── sitemap.ts         # Dynamic sitemap
│   └── robots.ts          # Robots.txt
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Layout components
│   ├── products/          # Product-specific components
│   └── auth/              # Auth components
├── lib/                   # Utilities and configs
│   ├── supabase/          # Supabase client setup
│   ├── db/                # Database schema
│   └── utils.ts           # Helper functions
├── types/                 # TypeScript types
└── public/                # Static assets
```

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account ([create one here](https://supabase.com))

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
cd /Users/chin/Documents/projects/aimademethis
npm install
```

### 2. Supabase Setup

1. **Create a Supabase project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the database to be ready

2. **Run the database schema**:
   ```bash
   # Copy the schema from lib/db/schema.sql
   # Go to Supabase Dashboard > SQL Editor
   # Paste and run the entire schema
   ```

3. **Generate TypeScript types** (optional):
   ```bash
   npx supabase login
   npx supabase link --project-ref your-project-ref
   npx supabase gen types typescript --linked > types/database.types.ts
   ```

### 3. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional: Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## 🗄️ Database Schema

The database includes the following tables:

- **profiles** - User profiles extending Supabase auth
- **products** - AI product listings
- **categories** - Product categories
- **tags** - Product tags
- **product_tags** - Many-to-many junction table
- **reviews** - Product reviews and ratings
- **votes** - Upvotes/downvotes
- **bookmarks** - User saved products
- **comments** - Product discussions
- **follows** - User follows (products/creators)

All tables have Row Level Security (RLS) enabled.

## 🔐 Authentication

Authentication is handled by Supabase Auth with:
- Email/Password
- OAuth providers (Google, GitHub, etc.) - configure in Supabase dashboard
- Protected routes via middleware
- Session management with cookies

## 📱 Features

### MVP Features
- ✅ Product listing and discovery
- ✅ User authentication (Supabase Auth)
- ✅ Product submission
- ✅ Search and filters
- ✅ User profiles
- ⏳ Reviews and ratings (database ready)
- ⏳ Upvotes/downvotes (database ready)
- ⏳ Bookmarks (database ready)

### SEO Optimization
- ✅ Next.js Metadata API for dynamic SEO
- ✅ Open Graph and Twitter Card tags
- ✅ JSON-LD structured data
- ✅ Dynamic sitemap generation
- ✅ Robots.txt configuration
- ✅ Optimized images with Next.js Image
- ✅ Server-side rendering for SEO

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

```bash
# Or use Vercel CLI
npm install -g vercel
vercel
```

### Environment Variables for Production

Make sure to set these in your Vercel dashboard:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://aimademethis.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX (optional)
```

## 📚 Key Files to Configure

1. **Supabase Configuration**: `lib/supabase/*.ts`
2. **Database Schema**: `lib/db/schema.sql`
3. **Type Definitions**: `types/database.types.ts`
4. **SEO Metadata**: `app/layout.tsx`
5. **Sitemap**: `app/sitemap.ts`

## 🧪 Development Tips

### Adding New UI Components

Use shadcn/ui CLI to add components:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add form
```

### Database Migrations

When updating the schema, create a new migration:

```bash
# In Supabase SQL Editor, run your migration
# Then regenerate types
npx supabase gen types typescript --linked > types/database.types.ts
```

### Testing Locally

```bash
# Run dev server
npm run dev

# Type check
npm run check

# Build for production
npm run build
```

## 📖 API Routes

- `POST /api/products` - Create new product
- `GET /api/products` - List products
- `GET /api/products/[id]` - Get product details
- `POST /api/upload` - Upload images to Supabase Storage

## 🎨 Customization

### Theme Colors

Edit `app/globals.css` to customize the color scheme:

```css
:root {
  --primary: 262 83% 58%; /* Purple gradient */
  --secondary: 210 40% 96.1%;
  /* ... other colors */
}
```

### Fonts

Change fonts in `app/layout.tsx`:

```typescript
const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({ weight: ["400", "700"] });
```

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

## 🐛 Known Issues

- Supabase types need to be generated manually after schema changes
- Storage buckets need to be created manually in Supabase dashboard

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check the documentation
- Join our community Discord (coming soon)

---

Built with ❤️ using Next.js and Supabase
