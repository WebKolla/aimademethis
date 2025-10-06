# Product Enhancement Plan - Development Details

## Overview
Enhance the product submission and detail pages to capture comprehensive development information, including tools, processes, costs, and technical implementation details.

## New Fields to Add

### 1. Media & Demo
- **video_url** (text, nullable) - YouTube/Vimeo video URL explaining the product
- **demo_video_url** (text, nullable) - Product demo video URL

### 2. Development Tools
- **ide_used** (text[], nullable) - IDEs used (Cursor, VS Code, WebStorm, etc.)
- **ai_models_used** (text[], nullable) - AI models (Claude, GPT-4, Gemini, etc.)
- **ai_tools_used** (text[], nullable) - AI tools (Cursor, GitHub Copilot, v0, Lovable, Bolt, etc.)
- **voice_tools_used** (text[], nullable) - Voice/dictation tools (Whisperflow, etc.)

### 3. Development Process
- **development_approach** (text, nullable) - "pure_prompting" | "ai_assisted" | "manual" | "hybrid"
- **project_management_method** (text, nullable) - "agile" | "waterfall" | "kanban" | "agentic" | "none"
- **agentic_workflow_used** (boolean, default: false) - Whether agentic workflows were used

### 4. Technical Implementation
- **tech_stack** (text[], nullable) - Technologies (Next.js, React, Vue, AWS, Vercel, etc.)
- **ui_framework** (text, nullable) - UI frameworks (shadcn, Tailwind, Material-UI, etc.)
- **mcps_used** (text[], nullable) - Model Context Protocols used
- **cursor_rules** (text, nullable) - Cursor rules file content (markdown)
- **commands_used** (text[], nullable) - Custom commands/scripts used

### 5. Cost & Metrics
- **total_token_cost** (numeric, nullable) - Total tokens used
- **total_cost_usd** (numeric, nullable) - Total USD cost
- **development_time_hours** (numeric, nullable) - Hours spent

### 6. Prompts & Workflow
- **key_prompts** (jsonb, nullable) - Array of {title, prompt, description}
- **workflow_description** (text, nullable) - Detailed workflow explanation

## Database Schema Changes

```sql
-- Add new columns to products table
ALTER TABLE products
  -- Media
  ADD COLUMN video_url TEXT,
  ADD COLUMN demo_video_url TEXT,

  -- Development Tools (arrays)
  ADD COLUMN ide_used TEXT[],
  ADD COLUMN ai_models_used TEXT[],
  ADD COLUMN ai_tools_used TEXT[],
  ADD COLUMN voice_tools_used TEXT[],

  -- Development Process
  ADD COLUMN development_approach TEXT CHECK (
    development_approach IN ('pure_prompting', 'ai_assisted', 'manual', 'hybrid')
  ),
  ADD COLUMN project_management_method TEXT CHECK (
    project_management_method IN ('agile', 'waterfall', 'kanban', 'agentic', 'none', 'other')
  ),
  ADD COLUMN agentic_workflow_used BOOLEAN DEFAULT FALSE,

  -- Technical Implementation (arrays)
  ADD COLUMN tech_stack TEXT[],
  ADD COLUMN ui_framework TEXT,
  ADD COLUMN mcps_used TEXT[],
  ADD COLUMN cursor_rules TEXT,
  ADD COLUMN commands_used TEXT[],

  -- Cost & Metrics
  ADD COLUMN total_token_cost NUMERIC,
  ADD COLUMN total_cost_usd NUMERIC(10, 2),
  ADD COLUMN development_time_hours NUMERIC(10, 1),

  -- Prompts & Workflow
  ADD COLUMN key_prompts JSONB,
  ADD COLUMN workflow_description TEXT;
```

## UI/UX Design

### Product Submission Form Sections

**Section 1: Basic Information** (Existing)
- Name, tagline, description, category, tags, pricing

**Section 2: Links & Media** (Enhanced)
- Website URL, Demo URL, GitHub URL
- **NEW:** Product Video URL (YouTube embed)
- **NEW:** Demo Video URL
- Product Image

**Section 3: Development Details** (NEW)
- **Development Tools**
  - IDE Selection (multi-select: Cursor, VS Code, WebStorm, IntelliJ, etc.)
  - AI Models (multi-select: Claude, GPT-4, Gemini, Llama, etc.)
  - AI Tools (multi-select: Cursor, Copilot, v0, Lovable, Bolt, Windsurf, etc.)
  - Voice Tools (multi-select: Whisperflow, Talon, Dragon, etc.)

- **Development Process**
  - Development Approach (radio: Pure Prompting, AI-Assisted, Manual, Hybrid)
  - Project Management (select: Agile, Kanban, Waterfall, Agentic, None, Other)
  - Agentic Workflow Used? (checkbox)

- **Technical Stack**
  - Tech Stack (tags input: Next.js, React, Vue, AWS, Supabase, etc.)
  - UI Framework (input: shadcn, Tailwind CSS, Material-UI, etc.)
  - MCPs Used (tags input: list of MCPs)
  - Cursor Rules (textarea: optional cursor rules content)
  - Commands (tags input: custom commands/scripts)

- **Cost & Metrics** (Optional)
  - Total Tokens Used (number)
  - Total Cost in USD (number with $ prefix)
  - Development Time (hours)

**Section 4: Workflow & Prompts** (NEW - Optional)
- Workflow Description (rich textarea: explain your development process)
- Key Prompts (repeatable fields):
  - Prompt Title
  - Prompt Content (textarea)
  - Prompt Description
  - Add/Remove prompt buttons (max 10)

### Product Detail Page Sections

**Section 1: Hero** (Existing)
- Product image, name, tagline, stats, action buttons

**Section 2: Videos** (NEW - if provided)
- Product explanation video (YouTube embed)
- Demo video (YouTube embed)
- Side-by-side on desktop, stacked on mobile

**Section 3: Description** (Existing)
- Markdown content

**Section 4: Development Details** (NEW - Tabbed Interface)
- **Tab 1: Tools & Stack**
  - Development Tools (IDE, AI Models, AI Tools, Voice Tools)
  - Tech Stack (badges)
  - UI Framework
  - MCPs Used

- **Tab 2: Process & Workflow**
  - Development Approach
  - Project Management Method
  - Agentic Workflow indicator
  - Workflow Description

- **Tab 3: Prompts & Rules**
  - Key Prompts (expandable cards)
  - Cursor Rules (code block)
  - Commands Used (badges)

- **Tab 4: Metrics** (if provided)
  - Development Time
  - Token Usage
  - Cost Breakdown
  - Visual charts/stats

**Section 5: Tags** (Existing)

**Section 6: Creator Card** (Existing - Sidebar)

**Section 7: Related Products** (Existing)

## Implementation Steps

### Phase 1: Database (Tasks 1-2)
1. Create migration with all new columns
2. Generate updated TypeScript types

### Phase 2: Form UI (Tasks 3-5)
3. Create reusable form components:
   - MultiSelect for arrays
   - TagsInput for dynamic arrays
   - KeyPromptsInput for prompt management
4. Update ProductSubmissionForm with new sections
5. Add validation schemas with Zod

### Phase 3: Display UI (Task 6)
6. Create product detail components:
   - VideoSection component
   - DevelopmentDetailsTab component
   - ToolsBadges component
   - KeyPromptsDisplay component
   - MetricsDisplay component
7. Update product detail page layout

### Phase 4: Testing & Validation (Tasks 7-9)
8. Test form submission with all new fields
9. Verify display of all field types
10. Build and ensure no errors

## Component Architecture

```
components/
├── products/
│   ├── form/
│   │   ├── multi-select.tsx (NEW)
│   │   ├── tags-input.tsx (NEW)
│   │   ├── key-prompts-input.tsx (NEW)
│   │   ├── development-tools-section.tsx (NEW)
│   │   ├── development-process-section.tsx (NEW)
│   │   ├── tech-stack-section.tsx (NEW)
│   │   └── workflow-section.tsx (NEW)
│   ├── detail/
│   │   ├── video-section.tsx (NEW)
│   │   ├── development-details-tabs.tsx (NEW)
│   │   ├── tools-stack-tab.tsx (NEW)
│   │   ├── process-workflow-tab.tsx (NEW)
│   │   ├── prompts-rules-tab.tsx (NEW)
│   │   └── metrics-tab.tsx (NEW)
```

## Data Examples

### Key Prompts JSON Structure
```json
[
  {
    "title": "Initial Project Setup",
    "prompt": "Create a Next.js 15 app with...",
    "description": "Used to bootstrap the project structure"
  },
  {
    "title": "Component Generation",
    "prompt": "Generate a reusable card component...",
    "description": "Created all UI components"
  }
]
```

### Tech Stack Array
```json
["Next.js 15", "React 19", "TypeScript", "Supabase", "Tailwind CSS", "shadcn/ui"]
```

### MCPs Used Array
```json
["supabase", "github", "filesystem", "brave-search"]
```

## Considerations

1. **Optional Fields**: All new fields are optional to not force creators to fill everything
2. **Progressive Disclosure**: Use collapsible sections to avoid overwhelming users
3. **Searchability**: Consider indexing tech stack and tools for future search features
4. **Privacy**: Token costs and prompts might be sensitive - ensure users understand they're public
5. **Validation**: Validate URLs, numeric ranges, and array lengths
6. **Character Limits**: Set reasonable limits on text fields (cursor_rules, workflow_description)
7. **Performance**: Use pagination/lazy loading for key prompts if many are added

## Future Enhancements

1. Create dedicated search/filter by tech stack
2. Add analytics on popular tools/frameworks
3. Generate AI-powered insights from prompts
4. Create "Similar Stack" recommendations
5. Export prompts/rules as downloadable files
6. Community voting on best prompts

## Timeline Estimate

- Phase 1 (Database): 30 minutes
- Phase 2 (Form UI): 2-3 hours
- Phase 3 (Display UI): 2-3 hours
- Phase 4 (Testing): 1 hour

**Total: 5-7 hours**
