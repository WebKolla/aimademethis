# Task 006 - Form Section Components

**Status:** In Progress
**Priority:** High
**Estimated Time:** 1.5 hours

## Overview
Create 4 form section components that use the reusable components (MultiSelect, TagsInput, KeyPromptsInput) to organize the new product submission fields.

## Components to Create

### 1. Development Tools Section
**File:** `components/products/form/development-tools-section.tsx`

**Fields:**
- IDE Used (MultiSelect)
- AI Models Used (MultiSelect)
- AI Tools Used (MultiSelect)
- Voice Tools Used (MultiSelect)

**Predefined Options:**
```typescript
const IDE_OPTIONS = [
  { label: "Cursor", value: "cursor" },
  { label: "VS Code", value: "vscode" },
  { label: "WebStorm", value: "webstorm" },
  { label: "IntelliJ IDEA", value: "intellij" },
  { label: "Vim", value: "vim" },
  { label: "Neovim", value: "neovim" },
  { label: "Sublime Text", value: "sublime" },
  { label: "Other", value: "other" },
];

const AI_MODELS_OPTIONS = [
  { label: "Claude 3.5 Sonnet", value: "claude-3.5-sonnet" },
  { label: "Claude 3 Opus", value: "claude-3-opus" },
  { label: "GPT-4", value: "gpt-4" },
  { label: "GPT-4 Turbo", value: "gpt-4-turbo" },
  { label: "Gemini Pro", value: "gemini-pro" },
  { label: "Llama 3", value: "llama-3" },
  { label: "Mistral", value: "mistral" },
  { label: "Other", value: "other" },
];

const AI_TOOLS_OPTIONS = [
  { label: "Cursor", value: "cursor" },
  { label: "GitHub Copilot", value: "github-copilot" },
  { label: "v0", value: "v0" },
  { label: "Lovable", value: "lovable" },
  { label: "Bolt", value: "bolt" },
  { label: "Windsurf", value: "windsurf" },
  { label: "Replit AI", value: "replit-ai" },
  { label: "Cody", value: "cody" },
  { label: "Tabnine", value: "tabnine" },
  { label: "Other", value: "other" },
];

const VOICE_TOOLS_OPTIONS = [
  { label: "Whisperflow", value: "whisperflow" },
  { label: "Talon", value: "talon" },
  { label: "Dragon NaturallySpeaking", value: "dragon" },
  { label: "Windows Speech Recognition", value: "windows-speech" },
  { label: "Other", value: "other" },
];
```

### 2. Development Process Section
**File:** `components/products/form/development-process-section.tsx`

**Fields:**
- Development Approach (Radio buttons)
- Project Management Method (Select dropdown)
- Agentic Workflow Used (Checkbox)

**Options:**
```typescript
const APPROACH_OPTIONS = [
  { label: "Pure Prompting", value: "pure_prompting", description: "Primarily using AI prompts" },
  { label: "AI-Assisted", value: "ai_assisted", description: "AI helping with code" },
  { label: "Manual", value: "manual", description: "Traditional coding" },
  { label: "Hybrid", value: "hybrid", description: "Mix of approaches" },
];

const PM_METHOD_OPTIONS = [
  { label: "Agile", value: "agile" },
  { label: "Kanban", value: "kanban" },
  { label: "Waterfall", value: "waterfall" },
  { label: "Agentic", value: "agentic" },
  { label: "None", value: "none" },
  { label: "Other", value: "other" },
];
```

### 3. Tech Stack Section
**File:** `components/products/form/tech-stack-section.tsx`

**Fields:**
- Tech Stack (TagsInput, max 20)
- UI Framework (Input)
- MCPs Used (TagsInput, max 10)
- Cursor Rules (Textarea, max 10000 chars)
- Commands Used (TagsInput, max 10)

### 4. Metrics & Workflow Section
**File:** `components/products/form/metrics-workflow-section.tsx`

**Fields:**
- Total Tokens Used (Number input)
- Total Cost USD (Number input with $ prefix)
- Development Time Hours (Number input)
- Workflow Description (Textarea, max 5000 chars)
- Key Prompts (KeyPromptsInput component)

## Component Structure Pattern

Each section should follow this pattern:

```typescript
"use client";

import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";

interface SectionProps {
  // State values
  ideUsed: string[];
  aiModels: string[];
  // ... other fields

  // Change handlers
  onIdeChange: (values: string[]) => void;
  onAiModelsChange: (values: string[]) => void;
  // ... other handlers
}

export function SectionComponent({ ... }: SectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="ide-used">IDEs Used</Label>
        <p className="text-sm text-muted-foreground mb-2">
          Select the IDEs you used during development
        </p>
        <MultiSelect
          options={IDE_OPTIONS}
          selected={ideUsed}
          onChange={onIdeChange}
          placeholder="Select IDEs..."
          maxSelected={5}
        />
      </div>

      {/* More fields... */}
    </div>
  );
}
```

## Acceptance Criteria

- [ ] All 4 section components created
- [ ] Each component has proper TypeScript interfaces
- [ ] Predefined options are comprehensive
- [ ] Helpful descriptions/placeholders added
- [ ] Max limits enforced where applicable
- [ ] Components are responsive
- [ ] Dark mode styling works
- [ ] Accessibility labels present

## Testing

- Test each component in isolation
- Verify max limits work
- Test empty/null states
- Verify onChange handlers fire correctly

## Next Steps

After completion, proceed to Task 007 - Update schema validation
