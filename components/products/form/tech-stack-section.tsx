"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TagsInput } from "@/components/ui/tags-input";

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

export function TechStackSection({
  techStack,
  uiFramework,
  mcpsUsed,
  cursorRules,
  commandsUsed,
  onTechStackChange,
  onUiFrameworkChange,
  onMcpsChange,
  onCursorRulesChange,
  onCommandsChange,
}: TechStackSectionProps) {
  return (
    <div className="space-y-6">
      {/* Tech Stack */}
      <div>
        <Label htmlFor="tech-stack" className="text-base font-semibold">
          Tech Stack
        </Label>
        <p className="text-sm text-muted-foreground mt-1 mb-2">
          Technologies, frameworks, and services used (e.g., Next.js, React, Supabase, AWS)
        </p>
        <TagsInput
          value={techStack}
          onChange={onTechStackChange}
          placeholder="Type and press Enter..."
          maxTags={20}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Press Enter or comma after each item. Max 20 items.
        </p>
      </div>

      {/* UI Framework */}
      <div>
        <Label htmlFor="ui-framework" className="text-base font-semibold">
          UI Framework/Library
        </Label>
        <p className="text-sm text-muted-foreground mt-1 mb-2">
          Main UI framework or component library (e.g., shadcn/ui, Tailwind CSS, Material-UI)
        </p>
        <Input
          id="ui-framework"
          value={uiFramework}
          onChange={(e) => onUiFrameworkChange(e.target.value)}
          placeholder="e.g., shadcn/ui with Tailwind CSS"
          maxLength={100}
          className="mt-1"
        />
      </div>

      {/* MCPs Used */}
      <div>
        <Label htmlFor="mcps-used" className="text-base font-semibold">
          MCPs (Model Context Protocols) Used
        </Label>
        <p className="text-sm text-muted-foreground mt-1 mb-2">
          Which MCPs did you use? (e.g., supabase, github, filesystem, brave-search)
        </p>
        <TagsInput
          value={mcpsUsed}
          onChange={onMcpsChange}
          placeholder="Type MCP names..."
          maxTags={10}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Press Enter or comma after each MCP. Max 10 items.
        </p>
      </div>

      {/* Cursor Rules */}
      <div>
        <Label htmlFor="cursor-rules" className="text-base font-semibold">
          Cursor Rules
        </Label>
        <p className="text-sm text-muted-foreground mt-1 mb-2">
          Share your .cursorrules file content or custom rules (optional)
        </p>
        <Textarea
          id="cursor-rules"
          value={cursorRules}
          onChange={(e) => onCursorRulesChange(e.target.value)}
          placeholder="Paste your cursor rules here..."
          rows={8}
          maxLength={10000}
          className="mt-1 font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground mt-1">
          {cursorRules.length} / 10,000 characters
        </p>
      </div>

      {/* Commands Used */}
      <div>
        <Label htmlFor="commands-used" className="text-base font-semibold">
          Custom Commands/Scripts
        </Label>
        <p className="text-sm text-muted-foreground mt-1 mb-2">
          Custom commands, scripts, or slash commands you created
        </p>
        <TagsInput
          value={commandsUsed}
          onChange={onCommandsChange}
          placeholder="Type command names..."
          maxTags={10}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Press Enter or comma after each command. Max 10 items.
        </p>
      </div>
    </div>
  );
}
