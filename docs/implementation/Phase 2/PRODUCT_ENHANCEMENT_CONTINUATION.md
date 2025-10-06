# Product Enhancement - Continuation Plan

## Completed (Phase 1) ✅

### Database & Types
- ✅ Created migration `add_product_development_details` with 20+ new columns
- ✅ Updated TypeScript types in `types/database.types.ts`
- ✅ Installed `@radix-ui/react-popover` dependency

### Reusable Components
- ✅ Created `components/ui/multi-select.tsx` - Multi-select dropdown with badges
- ✅ Created `components/ui/tags-input.tsx` - Dynamic tag input with Enter/comma support
- ✅ Created `components/ui/badge.tsx` - Badge component (via shadcn)
- ✅ Created `components/products/form/key-prompts-input.tsx` - Repeatable prompt fields

## Remaining Work (Phase 2)

### Task 6: Create Form Section Components (1.5 hours)

Create 4 section components that use the reusable components above:

#### 6a. `components/products/form/development-tools-section.tsx`
```typescript
// Should include:
- MultiSelect for IDE Used (Cursor, VS Code, WebStorm, IntelliJ, etc.)
- MultiSelect for AI Models (Claude 3.5, GPT-4, Gemini, Llama, etc.)
- MultiSelect for AI Tools (Cursor, GitHub Copilot, v0, Lovable, Bolt, Windsurf, etc.)
- MultiSelect for Voice Tools (Whisperflow, Talon, Dragon, etc.)

// Props interface:
interface DevelopmentToolsSectionProps {
  ideUsed: string[];
  aiModels: string[];
  aiTools: string[];
  voiceTools: string[];
  onIdeChange: (values: string[]) => void;
  onAiModelsChange: (values: string[]) => void;
  onAiToolsChange: (values: string[]) => void;
  onVoiceToolsChange: (values: string[]) => void;
}
```

**Predefined Options:**
- IDEs: Cursor, VS Code, WebStorm, IntelliJ IDEA, Vim, Neovim, Sublime Text, Atom
- AI Models: Claude 3.5 Sonnet, Claude 3 Opus, GPT-4, GPT-4 Turbo, Gemini Pro, Llama 3, Mistral
- AI Tools: Cursor, GitHub Copilot, v0, Lovable, Bolt, Windsurf, Replit AI, Cody, Tabnine
- Voice Tools: Whisperflow, Talon, Dragon NaturallySpeaking, Windows Speech Recognition

#### 6b. `components/products/form/development-process-section.tsx`
```typescript
// Should include:
- Radio buttons for Development Approach (pure_prompting, ai_assisted, manual, hybrid)
- Select dropdown for Project Management (agile, kanban, waterfall, agentic, none, other)
- Checkbox for Agentic Workflow Used

interface DevelopmentProcessSectionProps {
  approach: string;
  projectManagement: string;
  agenticWorkflow: boolean;
  onApproachChange: (value: string) => void;
  onProjectManagementChange: (value: string) => void;
  onAgenticWorkflowChange: (checked: boolean) => void;
}
```

#### 6c. `components/products/form/tech-stack-section.tsx`
```typescript
// Should include:
- TagsInput for Tech Stack (max 20)
- Input for UI Framework
- TagsInput for MCPs Used (max 10)
- Textarea for Cursor Rules (optional, max 10000 chars)
- TagsInput for Commands Used (max 10)

interface TechStackSectionProps {
  techStack: string[];
  uiFramework: string;
  mcpsUsed: string[];
  cursorRules: string;
  commandsUsed: string[];
  onTechStackChange: (values: string[]) => void;
  onUiFrameworkChange: (value: string) => void;
  onMcpsChange: (values: string[]) => void;
  onCursorRulesChange: (value: string) => void;
  onCommandsChange: (values: string[]) => void;
}
```

#### 6d. `components/products/form/metrics-workflow-section.tsx`
```typescript
// Should include:
- Number input for Total Tokens
- Number input for Total Cost USD (with $ prefix)
- Number input for Development Time Hours
- Textarea for Workflow Description (max 5000 chars)
- KeyPromptsInput component for key prompts

interface MetricsWorkflowSectionProps {
  totalTokens: number | null;
  totalCost: number | null;
  devTime: number | null;
  workflowDescription: string;
  keyPrompts: KeyPrompt[];
  onTotalTokensChange: (value: number | null) => void;
  onTotalCostChange: (value: number | null) => void;
  onDevTimeChange: (value: number | null) => void;
  onWorkflowDescriptionChange: (value: string) => void;
  onKeyPromptsChange: (prompts: KeyPrompt[]) => void;
}
```

### Task 7: Update Schema & Validation (30 min)

Update `lib/products/schemas.ts`:

```typescript
export const productSubmissionSchema = z.object({
  // ... existing fields ...

  // Media
  video_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  demo_video_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),

  // Development Tools
  ide_used: z.array(z.string()).optional(),
  ai_models_used: z.array(z.string()).optional(),
  ai_tools_used: z.array(z.string()).optional(),
  voice_tools_used: z.array(z.string()).optional(),

  // Development Process
  development_approach: z.enum(["pure_prompting", "ai_assisted", "manual", "hybrid"]).optional(),
  project_management_method: z.enum(["agile", "waterfall", "kanban", "agentic", "none", "other"]).optional(),
  agentic_workflow_used: z.boolean().optional(),

  // Technical Stack
  tech_stack: z.array(z.string()).max(20, "Maximum 20 technologies").optional(),
  ui_framework: z.string().max(100).optional().or(z.literal("")),
  mcps_used: z.array(z.string()).max(10, "Maximum 10 MCPs").optional(),
  cursor_rules: z.string().max(10000, "Maximum 10000 characters").optional().or(z.literal("")),
  commands_used: z.array(z.string()).max(10, "Maximum 10 commands").optional(),

  // Metrics
  total_token_cost: z.number().positive().optional().nullable(),
  total_cost_usd: z.number().positive().optional().nullable(),
  development_time_hours: z.number().positive().optional().nullable(),

  // Workflow & Prompts
  workflow_description: z.string().max(5000, "Maximum 5000 characters").optional().or(z.literal("")),
  key_prompts: z.array(z.object({
    title: z.string().min(1, "Title required").max(100),
    prompt: z.string().min(1, "Prompt required").max(2000),
    description: z.string().min(1, "Description required").max(200),
  })).max(10, "Maximum 10 key prompts").optional(),
});
```

### Task 8: Update Form UI (1 hour)

Update `components/products/product-submission-form.tsx`:

1. **Add new state variables**:
```typescript
const [keyPrompts, setKeyPrompts] = useState<KeyPrompt[]>([]);
const [techStack, setTechStack] = useState<string[]>([]);
const [mcpsUsed, setMcpsUsed] = useState<string[]>([]);
// etc...
```

2. **Add 4 new collapsible sections** after the existing sections:
- Section: "Media & Videos" (optional)
- Section: "Development Tools" (optional)
- Section: "Development Process" (optional)
- Section: "Technical Stack" (optional)
- Section: "Metrics & Workflow" (optional)

3. **Update submit handler** to include all new fields

4. **Update server action** in `lib/products/actions.ts`:
- Add all new fields to the insert object
- Handle key_prompts JSONB conversion

### Task 9: Create Display Components (2 hours)

Create 6 new display components:

#### 9a. `components/products/detail/video-section.tsx`
```typescript
// YouTube/Vimeo embed with responsive iframe
// Side-by-side on desktop, stacked on mobile
interface VideoSectionProps {
  videoUrl?: string;
  demoVideoUrl?: string;
  productName: string;
}
```

#### 9b. `components/products/detail/development-details-tabs.tsx`
```typescript
// Tabbed interface using Radix Tabs
// 4 tabs: Tools & Stack, Process & Workflow, Prompts & Rules, Metrics
interface DevelopmentDetailsTabsProps {
  product: ProductWithDetails;
}
```

#### 9c. `components/products/detail/tools-stack-tab.tsx`
```typescript
// Display tools and stack as badge grids
// Group by category (IDE, AI Models, AI Tools, Voice Tools)
```

#### 9d. `components/products/detail/process-workflow-tab.tsx`
```typescript
// Display approach, PM method, agentic indicator
// Show workflow description with markdown support
```

#### 9e. `components/products/detail/prompts-rules-tab.tsx`
```typescript
// Expandable accordion for each prompt
// Code block for cursor rules
// Badge list for commands
```

#### 9f. `components/products/detail/metrics-tab.tsx`
```typescript
// Visual cards for tokens, cost, dev time
// Consider using simple bar charts or progress indicators
```

### Task 10: Update Product Detail Page (30 min)

Update `app/products/[slug]/page.tsx`:

1. **Add new fields to query**:
```typescript
const { data: product } = await supabase
  .from("products")
  .select(`
    *,
    categories (id, name, slug),
    profiles (*)
  `)
  .eq("slug", slug)
  .single();
```

2. **Add VideoSection** after hero, before description

3. **Add DevelopmentDetailsTabs** after description, before tags:
```typescript
{/* Development Details - only show if any dev data exists */}
{hasDevDetails(product) && (
  <div className="mt-12">
    <DevelopmentDetailsTabs product={product} />
  </div>
)}
```

4. **Create helper function**:
```typescript
function hasDevDetails(product: any): boolean {
  return !!(
    product.ide_used?.length ||
    product.ai_models_used?.length ||
    product.tech_stack?.length ||
    product.key_prompts ||
    product.workflow_description
  );
}
```

### Task 11: Testing (1 hour)

1. Test form submission with various field combinations
2. Test partial submissions (only some optional fields filled)
3. Test validation (max lengths, required fields in prompts)
4. Test display with full data vs minimal data
5. Test responsive design on mobile
6. Test YouTube/Vimeo embeds
7. Test special characters in tags/prompts

### Task 12: Build & Verify (15 min)

1. Run `npm run build`
2. Fix any TypeScript errors
3. Test in production build
4. Verify all images still load
5. Commit all changes

## Additional Components Needed

You may need to install:
```bash
npm install @radix-ui/react-tabs
npm install @radix-ui/react-accordion
```

## Collapsible Section Pattern

For the new form sections, use this pattern:

```typescript
import { ChevronDown } from "lucide-react";

const [isOpen, setIsOpen] = useState(false);

<div className="border rounded-lg">
  <button
    type="button"
    onClick={() => setIsOpen(!isOpen)}
    className="w-full flex items-center justify-between p-4 text-left"
  >
    <div>
      <h3 className="text-lg font-semibold">Development Tools</h3>
      <p className="text-sm text-muted-foreground">
        IDEs, AI models, and tools you used (optional)
      </p>
    </div>
    <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
  </button>

  {isOpen && (
    <div className="p-4 border-t space-y-4">
      {/* Section content */}
    </div>
  )}
</div>
```

## Estimated Timeline

- Task 6 (Form Sections): 1.5 hours
- Task 7 (Schema): 30 minutes
- Task 8 (Form UI): 1 hour
- Task 9 (Display Components): 2 hours
- Task 10 (Detail Page): 30 minutes
- Task 11 (Testing): 1 hour
- Task 12 (Build): 15 minutes

**Total: ~6.5 hours**

## Files to Modify

### New Files to Create:
- `components/products/form/development-tools-section.tsx`
- `components/products/form/development-process-section.tsx`
- `components/products/form/tech-stack-section.tsx`
- `components/products/form/metrics-workflow-section.tsx`
- `components/products/detail/video-section.tsx`
- `components/products/detail/development-details-tabs.tsx`
- `components/products/detail/tools-stack-tab.tsx`
- `components/products/detail/process-workflow-tab.tsx`
- `components/products/detail/prompts-rules-tab.tsx`
- `components/products/detail/metrics-tab.tsx`

### Files to Modify:
- `lib/products/schemas.ts` (add validation)
- `components/products/product-submission-form.tsx` (add sections)
- `lib/products/actions.ts` (handle new fields)
- `app/products/[slug]/page.tsx` (display new data)

## Notes

- All new fields are optional - don't force users to fill everything
- Use progressive disclosure (collapsible sections) to avoid overwhelming
- Validate URLs for video fields
- Validate positive numbers for metrics
- Consider character limits to prevent abuse
- Test with empty/null values extensively
- Ensure responsive design works on mobile
- Add helpful placeholder text
- Consider adding tooltips for complex fields

## Next Session Prompt

"Continue implementing product enhancement Phase 2. Start with Task 6 - creating the form section components (development-tools-section, development-process-section, tech-stack-section, metrics-workflow-section). Refer to PRODUCT_ENHANCEMENT_CONTINUATION.md for detailed specifications."
