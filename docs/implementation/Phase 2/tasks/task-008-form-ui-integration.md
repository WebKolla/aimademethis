# Task 008 - Form UI Integration

**Status:** Pending
**Priority:** High
**Estimated Time:** 1 hour

## Overview
Integrate the 4 new form sections into the product submission form with collapsible/expandable UI.

## Files to Modify
- `components/products/product-submission-form.tsx`
- `lib/products/actions.ts`

## Changes Needed

### 1. Add State Management
```typescript
// Add new state variables
const [videoUrl, setVideoUrl] = useState("");
const [demoVideoUrl, setDemoVideoUrl] = useState("");
const [ideUsed, setIdeUsed] = useState<string[]>([]);
const [aiModels, setAiModels] = useState<string[]>([]);
// ... etc for all fields
const [keyPrompts, setKeyPrompts] = useState<KeyPrompt[]>([]);
```

### 2. Add Collapsible Sections
Insert after existing sections, before submit button:

- Section: "Media & Videos" (optional)
- Section: "Development Tools" (optional)
- Section: "Development Process" (optional)
- Section: "Technical Stack" (optional)
- Section: "Metrics & Workflow" (optional)

### 3. Update Submit Handler
Include all new fields in form data sent to server action.

### 4. Update Server Action
In `lib/products/actions.ts`, handle new fields in database insert.

## Acceptance Criteria
- [ ] All sections integrated
- [ ] Collapsible UI works
- [ ] Form state managed correctly
- [ ] Server action handles new fields
- [ ] Validation errors display properly

## Next Steps
Proceed to Task 009 - Create display components
