"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DevelopmentProcessSectionProps {
  approach: string;
  projectManagement: string;
  agenticWorkflow: boolean;
  onApproachChange: (value: string) => void;
  onProjectManagementChange: (value: string) => void;
  onAgenticWorkflowChange: (checked: boolean) => void;
}

const APPROACH_OPTIONS = [
  {
    value: "pure_prompting",
    label: "Pure Prompting",
    description: "Primarily using AI prompts to generate code",
  },
  {
    value: "ai_assisted",
    label: "AI-Assisted",
    description: "AI helping with code suggestions and completion",
  },
  {
    value: "manual",
    label: "Manual",
    description: "Traditional hand-coding with minimal AI",
  },
  {
    value: "hybrid",
    label: "Hybrid",
    description: "Mix of prompting, AI assistance, and manual coding",
  },
];

export function DevelopmentProcessSection({
  approach,
  projectManagement,
  agenticWorkflow,
  onApproachChange,
  onProjectManagementChange,
  onAgenticWorkflowChange,
}: DevelopmentProcessSectionProps) {
  return (
    <div className="space-y-6">
      {/* Development Approach */}
      <div>
        <Label className="text-base font-semibold">Development Approach</Label>
        <p className="text-sm text-muted-foreground mt-1 mb-3">
          How did you primarily build this product?
        </p>
        <div className="space-y-3">
          {APPROACH_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex items-start space-x-3 cursor-pointer"
            >
              <input
                type="radio"
                name="development_approach"
                value={option.value}
                checked={approach === option.value}
                onChange={(e) => onApproachChange(e.target.value)}
                className="mt-1 h-4 w-4 text-primary border-gray-300 focus:ring-primary"
              />
              <div className="flex-1">
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-muted-foreground">
                  {option.description}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Project Management Method */}
      <div>
        <Label htmlFor="pm-method" className="text-base font-semibold">
          Project Management Method
        </Label>
        <p className="text-sm text-muted-foreground mt-1 mb-2">
          What methodology did you use to manage the project?
        </p>
        <Select value={projectManagement} onValueChange={onProjectManagementChange}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select a method..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="agile">Agile</SelectItem>
            <SelectItem value="kanban">Kanban</SelectItem>
            <SelectItem value="waterfall">Waterfall</SelectItem>
            <SelectItem value="agentic">Agentic (AI-driven)</SelectItem>
            <SelectItem value="none">None / Ad-hoc</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Agentic Workflow */}
      <div>
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agenticWorkflow}
            onChange={(e) => onAgenticWorkflowChange(e.target.checked)}
            className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <div className="flex-1">
            <div className="font-semibold">Agentic Workflow Used</div>
            <p className="text-sm text-muted-foreground">
              Did you use AI agents that autonomously completed tasks or made decisions?
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}
