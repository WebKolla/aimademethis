# Task 007 - Schema Validation Update

**Status:** Pending
**Priority:** High
**Estimated Time:** 30 minutes

## Overview
Update the Zod schema in `lib/products/schemas.ts` to include validation for all new product fields.

## File to Modify
`lib/products/schemas.ts`

## New Schema Fields

```typescript
export const productSubmissionSchema = z.object({
  // ... existing fields (name, tagline, description, etc.) ...

  // Media URLs
  video_url: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal(""))
    .refine((val) => {
      if (!val) return true;
      // Optional: Validate YouTube/Vimeo URLs
      return val.includes("youtube.com") || val.includes("youtu.be") || val.includes("vimeo.com");
    }, "Must be a YouTube or Vimeo URL"),

  demo_video_url: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal(""))
    .refine((val) => {
      if (!val) return true;
      return val.includes("youtube.com") || val.includes("youtu.be") || val.includes("vimeo.com");
    }, "Must be a YouTube or Vimeo URL"),

  // Development Tools (all optional)
  ide_used: z.array(z.string()).max(10, "Maximum 10 IDEs").optional(),
  ai_models_used: z.array(z.string()).max(10, "Maximum 10 AI models").optional(),
  ai_tools_used: z.array(z.string()).max(10, "Maximum 10 AI tools").optional(),
  voice_tools_used: z.array(z.string()).max(5, "Maximum 5 voice tools").optional(),

  // Development Process (all optional)
  development_approach: z
    .enum(["pure_prompting", "ai_assisted", "manual", "hybrid"])
    .optional(),

  project_management_method: z
    .enum(["agile", "waterfall", "kanban", "agentic", "none", "other"])
    .optional(),

  agentic_workflow_used: z.boolean().optional(),

  // Technical Stack (all optional)
  tech_stack: z
    .array(z.string())
    .max(20, "Maximum 20 technologies")
    .optional(),

  ui_framework: z
    .string()
    .max(100, "Maximum 100 characters")
    .optional()
    .or(z.literal("")),

  mcps_used: z
    .array(z.string())
    .max(10, "Maximum 10 MCPs")
    .optional(),

  cursor_rules: z
    .string()
    .max(10000, "Maximum 10,000 characters")
    .optional()
    .or(z.literal("")),

  commands_used: z
    .array(z.string())
    .max(10, "Maximum 10 commands")
    .optional(),

  // Cost & Metrics (all optional)
  total_token_cost: z
    .number()
    .positive("Must be positive")
    .optional()
    .nullable(),

  total_cost_usd: z
    .number()
    .positive("Must be positive")
    .max(1000000, "Must be less than $1,000,000")
    .optional()
    .nullable(),

  development_time_hours: z
    .number()
    .positive("Must be positive")
    .max(100000, "Must be less than 100,000 hours")
    .optional()
    .nullable(),

  // Workflow & Prompts (all optional)
  workflow_description: z
    .string()
    .max(5000, "Maximum 5,000 characters")
    .optional()
    .or(z.literal("")),

  key_prompts: z
    .array(
      z.object({
        title: z
          .string()
          .min(1, "Title is required")
          .max(100, "Maximum 100 characters"),
        prompt: z
          .string()
          .min(1, "Prompt content is required")
          .max(2000, "Maximum 2,000 characters"),
        description: z
          .string()
          .min(1, "Description is required")
          .max(200, "Maximum 200 characters"),
      })
    )
    .max(10, "Maximum 10 key prompts")
    .optional(),
});

export type ProductSubmissionData = z.infer<typeof productSubmissionSchema>;
```

## Key Validation Rules

### URLs
- Must be valid URLs
- Video URLs should be YouTube or Vimeo (optional refinement)
- Empty strings allowed (converts to null in DB)

### Arrays
- All have maximum lengths
- Can be empty or undefined
- String values trimmed

### Numbers
- Must be positive
- Nullable (can be null in DB)
- Reasonable maximum values

### Strings
- Maximum character limits
- Empty strings allowed
- Trimmed automatically

### Key Prompts
- Each prompt requires title, content, description
- Nested validation with specific char limits
- Max 10 prompts total

## Testing

Test cases to verify:
```typescript
// Valid cases
✓ All fields empty/undefined
✓ Partial data (only some fields filled)
✓ Full data (all fields filled)
✓ Arrays at max length
✓ Strings at max length

// Invalid cases
✗ Invalid URLs
✗ Arrays exceeding max
✗ Strings exceeding max chars
✗ Negative numbers
✗ Invalid enum values
✗ Key prompts missing required fields
```

## Acceptance Criteria

- [ ] Schema updated with all new fields
- [ ] All fields are optional
- [ ] Validation rules match database constraints
- [ ] Error messages are user-friendly
- [ ] TypeScript types correctly inferred
- [ ] No breaking changes to existing validation

## Next Steps

After completion, proceed to Task 008 - Update product submission form UI
