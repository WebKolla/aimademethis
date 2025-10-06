"use client";

import { Label } from "@/components/ui/label";
import { MultiSelect, MultiSelectOption } from "@/components/ui/multi-select";

const IDE_OPTIONS: MultiSelectOption[] = [
  { label: "Cursor", value: "cursor" },
  { label: "VS Code", value: "vscode" },
  { label: "WebStorm", value: "webstorm" },
  { label: "IntelliJ IDEA", value: "intellij" },
  { label: "Vim", value: "vim" },
  { label: "Neovim", value: "neovim" },
  { label: "Sublime Text", value: "sublime" },
  { label: "Atom", value: "atom" },
  { label: "Other", value: "other" },
];

const AI_MODELS_OPTIONS: MultiSelectOption[] = [
  { label: "Claude 3.5 Sonnet", value: "claude-3.5-sonnet" },
  { label: "Claude 3 Opus", value: "claude-3-opus" },
  { label: "Claude 3 Haiku", value: "claude-3-haiku" },
  { label: "GPT-4", value: "gpt-4" },
  { label: "GPT-4 Turbo", value: "gpt-4-turbo" },
  { label: "GPT-3.5", value: "gpt-3.5" },
  { label: "Gemini Pro", value: "gemini-pro" },
  { label: "Llama 3", value: "llama-3" },
  { label: "Mistral", value: "mistral" },
  { label: "Other", value: "other" },
];

const AI_TOOLS_OPTIONS: MultiSelectOption[] = [
  { label: "Cursor", value: "cursor" },
  { label: "GitHub Copilot", value: "github-copilot" },
  { label: "v0", value: "v0" },
  { label: "Lovable (formerly GPT Engineer)", value: "lovable" },
  { label: "Bolt.new", value: "bolt" },
  { label: "Windsurf", value: "windsurf" },
  { label: "Replit AI", value: "replit-ai" },
  { label: "Cody", value: "cody" },
  { label: "Tabnine", value: "tabnine" },
  { label: "Amazon CodeWhisperer", value: "codewhisperer" },
  { label: "Other", value: "other" },
];

const VOICE_TOOLS_OPTIONS: MultiSelectOption[] = [
  { label: "Whisperflow", value: "whisperflow" },
  { label: "Talon", value: "talon" },
  { label: "Dragon NaturallySpeaking", value: "dragon" },
  { label: "Windows Speech Recognition", value: "windows-speech" },
  { label: "macOS Dictation", value: "macos-dictation" },
  { label: "Other", value: "other" },
];

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

export function DevelopmentToolsSection({
  ideUsed,
  aiModels,
  aiTools,
  voiceTools,
  onIdeChange,
  onAiModelsChange,
  onAiToolsChange,
  onVoiceToolsChange,
}: DevelopmentToolsSectionProps) {
  return (
    <div className="space-y-6">
      {/* IDEs Used */}
      <div>
        <Label htmlFor="ide-used" className="text-base font-semibold">
          IDEs Used
        </Label>
        <p className="text-sm text-muted-foreground mt-1 mb-2">
          Select the integrated development environments you used
        </p>
        <MultiSelect
          options={IDE_OPTIONS}
          selected={ideUsed}
          onChange={onIdeChange}
          placeholder="Select IDEs..."
          maxSelected={10}
        />
      </div>

      {/* AI Models Used */}
      <div>
        <Label htmlFor="ai-models" className="text-base font-semibold">
          AI Models Used
        </Label>
        <p className="text-sm text-muted-foreground mt-1 mb-2">
          Which AI language models did you use during development?
        </p>
        <MultiSelect
          options={AI_MODELS_OPTIONS}
          selected={aiModels}
          onChange={onAiModelsChange}
          placeholder="Select AI models..."
          maxSelected={10}
        />
      </div>

      {/* AI Development Tools */}
      <div>
        <Label htmlFor="ai-tools" className="text-base font-semibold">
          AI Development Tools
        </Label>
        <p className="text-sm text-muted-foreground mt-1 mb-2">
          AI-powered coding assistants and tools you utilized
        </p>
        <MultiSelect
          options={AI_TOOLS_OPTIONS}
          selected={aiTools}
          onChange={onAiToolsChange}
          placeholder="Select AI tools..."
          maxSelected={10}
        />
      </div>

      {/* Voice/Dictation Tools */}
      <div>
        <Label htmlFor="voice-tools" className="text-base font-semibold">
          Voice/Dictation Tools
        </Label>
        <p className="text-sm text-muted-foreground mt-1 mb-2">
          Voice-to-text or dictation tools that helped with coding
        </p>
        <MultiSelect
          options={VOICE_TOOLS_OPTIONS}
          selected={voiceTools}
          onChange={onVoiceToolsChange}
          placeholder="Select voice tools..."
          maxSelected={5}
        />
      </div>
    </div>
  );
}
