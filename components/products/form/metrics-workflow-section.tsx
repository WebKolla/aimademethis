"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { KeyPromptsInput, KeyPrompt } from "./key-prompts-input";

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

export function MetricsWorkflowSection({
  totalTokens,
  totalCost,
  devTime,
  workflowDescription,
  keyPrompts,
  onTotalTokensChange,
  onTotalCostChange,
  onDevTimeChange,
  onWorkflowDescriptionChange,
  onKeyPromptsChange,
}: MetricsWorkflowSectionProps) {
  const handleNumberChange = (
    value: string,
    onChange: (val: number | null) => void
  ) => {
    if (value === "") {
      onChange(null);
    } else {
      const num = parseFloat(value);
      if (!isNaN(num) && num >= 0) {
        onChange(num);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Cost & Metrics Header */}
      <div>
        <h4 className="text-lg font-semibold mb-2">Development Metrics</h4>
        <p className="text-sm text-muted-foreground">
          Share cost and time metrics to help others understand the investment required
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Total Tokens */}
        <div>
          <Label htmlFor="total-tokens" className="text-sm font-semibold">
            Total Tokens Used
          </Label>
          <Input
            id="total-tokens"
            type="number"
            min="0"
            step="1"
            value={totalTokens ?? ""}
            onChange={(e) => handleNumberChange(e.target.value, onTotalTokensChange)}
            placeholder="e.g., 500000"
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Approximate total tokens consumed
          </p>
        </div>

        {/* Total Cost USD */}
        <div>
          <Label htmlFor="total-cost" className="text-sm font-semibold">
            Total Cost (USD)
          </Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <Input
              id="total-cost"
              type="number"
              min="0"
              step="0.01"
              value={totalCost ?? ""}
              onChange={(e) => handleNumberChange(e.target.value, onTotalCostChange)}
              placeholder="0.00"
              className="pl-7"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Total USD spent on AI/services
          </p>
        </div>

        {/* Development Time */}
        <div>
          <Label htmlFor="dev-time" className="text-sm font-semibold">
            Development Time (hours)
          </Label>
          <Input
            id="dev-time"
            type="number"
            min="0"
            step="0.5"
            value={devTime ?? ""}
            onChange={(e) => handleNumberChange(e.target.value, onDevTimeChange)}
            placeholder="e.g., 40"
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Total hours spent building
          </p>
        </div>
      </div>

      {/* Workflow Description */}
      <div>
        <Label htmlFor="workflow-description" className="text-base font-semibold">
          Workflow Description
        </Label>
        <p className="text-sm text-muted-foreground mt-1 mb-2">
          Describe your development process, workflow, and any unique approaches
        </p>
        <Textarea
          id="workflow-description"
          value={workflowDescription}
          onChange={(e) => onWorkflowDescriptionChange(e.target.value)}
          placeholder="Explain your development workflow, iterations, challenges overcome, etc..."
          rows={6}
          maxLength={5000}
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">
          {workflowDescription.length} / 5,000 characters
        </p>
      </div>

      {/* Key Prompts */}
      <div>
        <Label className="text-base font-semibold">Key Prompts</Label>
        <p className="text-sm text-muted-foreground mt-1 mb-3">
          Share the most effective prompts you used (helps others learn from your experience)
        </p>
        <KeyPromptsInput
          value={keyPrompts}
          onChange={onKeyPromptsChange}
          maxPrompts={10}
        />
      </div>
    </div>
  );
}
