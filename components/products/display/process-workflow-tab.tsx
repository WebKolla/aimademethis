import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

interface ProcessWorkflowTabProps {
  developmentApproach?: string | null;
  projectManagementMethod?: string | null;
  agenticWorkflowUsed?: boolean | null;
  workflowDescription?: string | null;
}

const APPROACH_LABELS: Record<string, string> = {
  pure_prompting: "Pure Prompting",
  ai_assisted: "AI-Assisted",
  manual: "Manual",
  hybrid: "Hybrid",
};

const PM_METHOD_LABELS: Record<string, string> = {
  agile: "Agile",
  waterfall: "Waterfall",
  kanban: "Kanban",
  agentic: "Agentic (AI-driven)",
  none: "None / Ad-hoc",
  other: "Other",
};

export function ProcessWorkflowTab({
  developmentApproach,
  projectManagementMethod,
  agenticWorkflowUsed,
  workflowDescription,
}: ProcessWorkflowTabProps) {
  const hasAnyData = developmentApproach || projectManagementMethod || agenticWorkflowUsed || workflowDescription;

  if (!hasAnyData) {
    return (
      <p className="text-sm text-muted-foreground">No process or workflow information provided.</p>
    );
  }

  return (
    <div className="space-y-6">
      {/* Development Approach */}
      {developmentApproach && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Development Approach
          </h4>
          <Badge variant="secondary" className="text-sm">
            {APPROACH_LABELS[developmentApproach] || developmentApproach}
          </Badge>
        </div>
      )}

      {/* Project Management Method */}
      {projectManagementMethod && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Project Management Method
          </h4>
          <Badge variant="secondary" className="text-sm">
            {PM_METHOD_LABELS[projectManagementMethod] || projectManagementMethod}
          </Badge>
        </div>
      )}

      {/* Agentic Workflow */}
      {agenticWorkflowUsed && (
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
          <span className="text-sm font-medium">Agentic Workflow Used</span>
        </div>
      )}

      {/* Workflow Description */}
      {workflowDescription && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Workflow Description
          </h4>
          <div className="prose dark:prose-invert prose-sm max-w-none">
            <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
              {workflowDescription}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
