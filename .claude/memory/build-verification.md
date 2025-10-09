# Build Verification Protocol

## Critical Workflow Rule

**ALWAYS run `npm run build` after implementing or fixing any feature.**

## Why This Matters

- Development server (`npm run dev`) uses less strict type checking than production builds
- TypeScript errors that slip through dev mode will cause production build failures
- Catching type errors early prevents deployment blockers

## When to Run Builds

✅ **Required:**
- After implementing any new feature
- After fixing bugs or type errors
- Before committing code
- After making schema changes that affect types

## Quick Build Command

```bash
npm run build
```

## Common Type Issues to Watch For

1. **Nullable Fields**: Database fields may return `null`, but TypeScript expects `string` or `undefined`
   - Solution: Add null checks or update interface to accept `| null`

2. **Database Column Names**: Ensure query field names match actual database columns
   - Example: `reviews.comment` not `reviews.content`

3. **Type Casting**: Avoid `as any` - use explicit type annotations instead

4. **Unused Variables**: ESLint warnings about unused imports or variables
   - Clean up or prefix with underscore (`_variable`)

## Build Success Indicators

✅ Look for:
- `✓ Compiled successfully`
- No "Failed to compile" messages
- Only ESLint warnings (not errors)

## Troubleshooting Build Errors

1. Read the error message carefully - it shows exact file and line number
2. Check if database query fields match schema
3. Verify nullable fields have proper null checks
4. Ensure all type annotations are complete and accurate
5. Run `npm run build 2>&1 | tail -30` to see last 30 lines of output

## Integration with Git Workflow

```bash
# Proper workflow
npm run build              # Verify build passes
git add -A                 # Stage changes
git commit -m "..."        # Commit with conventional message
```

---

**Last Updated:** October 9, 2025
**Status:** Active Protocol
