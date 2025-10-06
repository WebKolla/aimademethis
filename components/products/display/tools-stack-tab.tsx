import { Badge } from "@/components/ui/badge";

interface ToolsStackTabProps {
  ideUsed?: string[] | null;
  aiModelsUsed?: string[] | null;
  aiToolsUsed?: string[] | null;
  voiceToolsUsed?: string[] | null;
  techStack?: string[] | null;
  uiFramework?: string | null;
  mcpsUsed?: string[] | null;
  commandsUsed?: string[] | null;
}

function TagList({ items, label }: { items?: string[] | null; label: string }) {
  if (!items || items.length === 0) return null;

  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </h4>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export function ToolsStackTab({
  ideUsed,
  aiModelsUsed,
  aiToolsUsed,
  voiceToolsUsed,
  techStack,
  uiFramework,
  mcpsUsed,
  commandsUsed,
}: ToolsStackTabProps) {
  return (
    <div className="space-y-6">
      {/* Development Tools */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">Development Tools</h3>

        <TagList items={ideUsed} label="IDEs Used" />
        <TagList items={aiModelsUsed} label="AI Models" />
        <TagList items={aiToolsUsed} label="AI Development Tools" />
        <TagList items={voiceToolsUsed} label="Voice/Dictation Tools" />
      </div>

      {/* Technical Stack */}
      {(techStack || uiFramework || mcpsUsed || commandsUsed) && (
        <>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-bold mb-4">Technical Stack</h3>

            <div className="space-y-4">
              <TagList items={techStack} label="Technologies & Frameworks" />

              {uiFramework && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    UI Framework
                  </h4>
                  <Badge variant="secondary">{uiFramework}</Badge>
                </div>
              )}

              <TagList items={mcpsUsed} label="MCPs (Model Context Protocols)" />
              <TagList items={commandsUsed} label="Custom Commands/Scripts" />
            </div>
          </div>
        </>
      )}

      {/* Empty state */}
      {!ideUsed && !aiModelsUsed && !aiToolsUsed && !voiceToolsUsed &&
       !techStack && !uiFramework && !mcpsUsed && !commandsUsed && (
        <p className="text-sm text-muted-foreground">No tools or stack information provided.</p>
      )}
    </div>
  );
}
