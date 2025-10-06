import { Copy } from "lucide-react";
import { useState } from "react";

interface Prompt {
  title: string;
  prompt: string;
  description: string;
}

interface PromptsRulesTabProps {
  keyPrompts?: Prompt[] | null;
  cursorRules?: string | null;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
      title="Copy to clipboard"
    >
      {copied ? (
        <span className="text-xs text-green-600 dark:text-green-400">Copied!</span>
      ) : (
        <Copy className="h-4 w-4 text-gray-500" />
      )}
    </button>
  );
}

export function PromptsRulesTab({ keyPrompts, cursorRules }: PromptsRulesTabProps) {
  const hasPrompts = keyPrompts && keyPrompts.length > 0;
  const hasRules = cursorRules && cursorRules.trim().length > 0;

  if (!hasPrompts && !hasRules) {
    return (
      <p className="text-sm text-muted-foreground">No prompts or rules shared.</p>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Prompts */}
      {hasPrompts && (
        <div>
          <h3 className="text-lg font-bold mb-4">Key Prompts</h3>
          <div className="space-y-4">
            {keyPrompts?.map((prompt, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    {prompt.title}
                  </h4>
                  <CopyButton text={prompt.prompt} />
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {prompt.description}
                </p>
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-3">
                  <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
                    {prompt.prompt}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cursor Rules */}
      {hasRules && (
        <div className={hasPrompts ? "border-t border-gray-200 dark:border-gray-700 pt-6" : ""}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Cursor Rules</h3>
            <CopyButton text={cursorRules!} />
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono overflow-x-auto">
              {cursorRules}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
