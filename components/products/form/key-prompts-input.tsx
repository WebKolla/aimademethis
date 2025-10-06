"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface KeyPrompt {
  title: string;
  prompt: string;
  description: string;
}

interface KeyPromptsInputProps {
  value: KeyPrompt[];
  onChange: (prompts: KeyPrompt[]) => void;
  maxPrompts?: number;
  className?: string;
}

export function KeyPromptsInput({
  value = [],
  onChange,
  maxPrompts = 10,
  className,
}: KeyPromptsInputProps) {
  const addPrompt = () => {
    if (value.length >= maxPrompts) return;

    onChange([
      ...value,
      {
        title: "",
        prompt: "",
        description: "",
      },
    ]);
  };

  const removePrompt = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const updatePrompt = (index: number, field: keyof KeyPrompt, fieldValue: string) => {
    const newPrompts = [...value];
    newPrompts[index] = {
      ...newPrompts[index],
      [field]: fieldValue,
    };
    onChange(newPrompts);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {value.map((prompt, index) => (
        <div
          key={index}
          className="relative rounded-lg border border-gray-200 dark:border-gray-800 p-4 space-y-4"
        >
          {/* Remove button */}
          <button
            type="button"
            onClick={() => removePrompt(index)}
            className="absolute top-2 right-2 p-1.5 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            aria-label="Remove prompt"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          {/* Prompt Title */}
          <div>
            <Label htmlFor={`prompt-title-${index}`} className="text-sm font-medium">
              Prompt Title *
            </Label>
            <Input
              id={`prompt-title-${index}`}
              value={prompt.title}
              onChange={(e) => updatePrompt(index, "title", e.target.value)}
              placeholder="e.g., Initial Project Setup"
              className="mt-1"
            />
          </div>

          {/* Prompt Content */}
          <div>
            <Label htmlFor={`prompt-content-${index}`} className="text-sm font-medium">
              Prompt Content *
            </Label>
            <Textarea
              id={`prompt-content-${index}`}
              value={prompt.prompt}
              onChange={(e) => updatePrompt(index, "prompt", e.target.value)}
              placeholder="Enter the full prompt you used..."
              rows={4}
              className="mt-1 font-mono text-sm"
            />
          </div>

          {/* Prompt Description */}
          <div>
            <Label htmlFor={`prompt-description-${index}`} className="text-sm font-medium">
              Description *
            </Label>
            <Input
              id={`prompt-description-${index}`}
              value={prompt.description}
              onChange={(e) => updatePrompt(index, "description", e.target.value)}
              placeholder="e.g., Used to bootstrap the project structure"
              className="mt-1"
            />
          </div>

          {/* Prompt number indicator */}
          <div className="text-xs text-muted-foreground">Prompt #{index + 1}</div>
        </div>
      ))}

      {/* Add Prompt Button */}
      {value.length < maxPrompts && (
        <Button
          type="button"
          variant="outline"
          onClick={addPrompt}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Prompt ({value.length}/{maxPrompts})
        </Button>
      )}

      {value.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No prompts added yet. Click the button above to add your key prompts.
        </p>
      )}
    </div>
  );
}
