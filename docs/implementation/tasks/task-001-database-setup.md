# Task 001: Database Setup

**Priority:** 🔴 Critical
**Estimated Time:** 2-3 hours
**Dependencies:** None
**Status:** ✅ Complete

---

## Overview

Set up the complete database schema in Supabase, including all tables, indexes, and Row Level Security (RLS) policies. This is a foundational task that blocks most other features.

---

## Objectives

- [ ] Execute schema.sql in Supabase SQL Editor
- [ ] Verify all tables are created correctly
- [ ] Confirm RLS policies are active
- [ ] Seed initial categories
- [ ] Generate TypeScript types from schema
- [ ] Test database permissions
- [ ] Update environment variables if needed

---

## Prerequisites

- Supabase project created and accessible
- Admin access to Supabase SQL Editor
- Supabase CLI installed (for type generation)
- Project linked to Supabase (`npx supabase link`)

---

## Implementation Steps

### Step 1: Review Schema File

**File:** `lib/db/schema.sql`

1. Open the schema file
2. Review all table definitions
3. Understand the relationships and constraints
4. Note any tables that need initial seed data

**Tables to be created:**
- profiles
- products
- categories
- tags
- product_tags
- reviews
- votes
- bookmarks
- comments
- follows

### Step 2: Execute Schema in Supabase

1. Log into [Supabase Dashboard](https://supabase.com)
2. Select your project: `mtcqpmpyvffkyirotqgp`
3. Navigate to **SQL Editor**
4. Click **New Query**
5. Copy the entire contents of `lib/db/schema.sql`
6. Paste into the SQL Editor
7. Click **Run** or press `Cmd/Ctrl + Enter`
8. Wait for execution to complete
9. Check for any errors in the output

**Expected Output:**
```
Success. No rows returned
```

**Common Errors & Solutions:**
- "extension already exists" → Safe to ignore
- "relation already exists" → Table already created, drop and recreate or skip
- "permission denied" → Ensure you're project admin

### Step 3: Verify Tables Were Created

In Supabase Dashboard:
1. Go to **Table Editor**
2. Verify all 10 tables are listed:
   - ✅ profiles
   - ✅ products
   - ✅ categories
   - ✅ tags
   - ✅ product_tags
   - ✅ reviews
   - ✅ votes
   - ✅ bookmarks
   - ✅ comments
   - ✅ follows

3. Click on each table and verify columns match schema
4. Check that indexes were created (Database > Indexes)

### Step 4: Verify RLS Policies

1. Go to **Authentication > Policies**
2. Verify that RLS is **enabled** for all tables
3. Check that policies exist for each table:
   - profiles: 3 policies (select, insert, update)
   - products: 4 policies (select, insert, update, delete)
   - categories: 1 policy (select only)
   - tags: 1 policy (select only)
   - product_tags: 2 policies (select, all)
   - reviews: 4 policies (select, insert, update, delete)
   - votes: 4 policies (select, insert, update, delete)
   - bookmarks: 3 policies (select, insert, delete)
   - comments: 4 policies (select, insert, update, delete)
   - follows: 4 policies (select, insert, update, delete)

4. Test a policy by:
   - Going to **SQL Editor**
   - Running: `SELECT * FROM profiles;`
   - Should work (public read policy)

### Step 5: Seed Initial Categories

Create a new SQL query in Supabase SQL Editor:

```sql
-- Insert default categories
INSERT INTO categories (name, slug, description, icon) VALUES
  ('Productivity', 'productivity', 'Tools to boost productivity and efficiency', 'briefcase'),
  ('Development Tools', 'development-tools', 'Tools for developers and programmers', 'code'),
  ('Content Creation', 'content-creation', 'Tools for creating content, art, and media', 'palette'),
  ('Marketing', 'marketing', 'Marketing automation and analytics tools', 'megaphone'),
  ('Data Analysis', 'data-analysis', 'Data visualization and analysis tools', 'bar-chart'),
  ('Education', 'education', 'Learning and educational tools', 'graduation-cap'),
  ('Entertainment', 'entertainment', 'Games, music, and entertainment apps', 'play'),
  ('Healthcare', 'healthcare', 'Health and wellness applications', 'heart'),
  ('Finance', 'finance', 'Financial tools and applications', 'dollar-sign'),
  ('Other', 'other', 'Other AI tools and applications', 'package')
ON CONFLICT (slug) DO NOTHING;
```

Run this query and verify:
```sql
SELECT * FROM categories ORDER BY name;
```

You should see 10 categories.

### Step 6: Generate TypeScript Types

In your terminal, run:

```bash
# Ensure you're in the project directory
cd /Users/chin/Documents/projects/aimademethis

# Login to Supabase (if not already)
npx supabase login

# Link to your project (if not already linked)
npx supabase link --project-ref mtcqpmpyvffkyirotqgp

# Generate types
npx supabase gen types typescript --linked > types/database.types.ts
```

**Verify the generated file:**
1. Open `types/database.types.ts`
2. Check that all tables are included in the `Database` type
3. Verify column types match your schema

**Expected structure:**
```typescript
export interface Database {
  public: {
    Tables: {
      profiles: { ... }
      products: { ... }
      categories: { ... }
      // ... etc
    }
  }
}
```

### Step 7: Test Database Permissions

Create a test query file: `test-database.sql`

```sql
-- Test 1: Can read categories (should work - public)
SELECT * FROM categories LIMIT 5;

-- Test 2: Can read profiles (should work - public)
SELECT id, username FROM profiles LIMIT 5;

-- Test 3: Can insert profile (should fail - no auth.uid())
-- This should fail unless you're authenticated
INSERT INTO profiles (id, username, full_name)
VALUES ('00000000-0000-0000-0000-000000000000', 'testuser', 'Test User');

-- Test 4: Can read products (should work - public for published)
SELECT * FROM products WHERE status = 'published' LIMIT 5;
```

Run these queries in SQL Editor and verify expected behavior.

### Step 8: Update Environment Variables (if needed)

Verify your `.env.local` has correct values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://mtcqpmpyvffkyirotqgp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Also verify in Vercel environment variables (for production):
```bash
NEXT_PUBLIC_SUPABASE_URL=https://mtcqpmpyvffkyirotqgp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
NEXT_PUBLIC_SITE_URL=https://aimademethis.vercel.app
```

---

## Testing Checklist

- [ ] All 10 tables exist in Supabase
- [ ] All indexes are created
- [ ] RLS is enabled on all tables
- [ ] RLS policies are correctly configured
- [ ] Categories table has 10 seed entries
- [ ] TypeScript types file generated successfully
- [ ] Types file imported correctly in codebase
- [ ] Database queries work in SQL Editor
- [ ] No console errors related to database types

---

## Verification Commands

```bash
# Check if types file exists
ls -la types/database.types.ts

# Check if types are properly imported
grep -r "database.types" lib/

# Rebuild the project
npm run build
```

---

## Common Issues & Solutions

### Issue 1: "extension already exists"
**Solution:** This is normal, the UUID extension is already installed. Ignore this error.

### Issue 2: RLS policies not working
**Solution:**
- Check that RLS is enabled: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
- Verify policy syntax is correct
- Check that auth.uid() is being passed correctly

### Issue 3: Type generation fails
**Solution:**
- Ensure Supabase CLI is updated: `npm install -g supabase@latest`
- Verify project is linked: `npx supabase link --project-ref mtcqpmpyvffkyirotqgp`
- Check network connection
- Try manual token authentication

### Issue 4: Foreign key constraint errors
**Solution:**
- Ensure parent tables are created before child tables
- The schema.sql file is ordered correctly, so run the entire file at once

### Issue 5: Permission denied errors
**Solution:**
- Ensure you're logged in as the project owner
- Check that service role key is not being used (use anon key)

---

## Files Created/Modified

### Created:
- `types/database.types.ts` (auto-generated)

### Modified:
- None (schema.sql already exists)

---

## Next Steps

After completing this task:
1. **Commit changes:** `git add types/database.types.ts && git commit -m "feat: generate database types from schema"`
2. **Proceed to Task 002:** User Profile Pages
3. **Proceed to Task 003:** Product Submission Form

---

## Rollback Instructions

If you need to rollback the database:

```sql
-- WARNING: This will delete all data!
-- Run these commands in order:

DROP TABLE IF EXISTS follows CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS bookmarks CASCADE;
DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS product_tags CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop extension (optional)
-- DROP EXTENSION IF EXISTS "uuid-ossp";
```

---

## Success Criteria

✅ Task is complete when:
1. All tables are created in Supabase
2. RLS policies are active and tested
3. Categories are seeded
4. TypeScript types are generated
5. No build errors
6. Database queries work as expected

---

**Estimated Time:** 2-3 hours
**Actual Time:** ~30 minutes (via Supabase MCP automation)
**Completed By:** Claude Code
**Completion Date:** October 6, 2025
