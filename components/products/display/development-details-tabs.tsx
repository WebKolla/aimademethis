"use client";

import { useState } from "react";
import { ToolsStackTab } from "./tools-stack-tab";
import { ProcessWorkflowTab } from "./process-workflow-tab";
import { PromptsRulesTab } from "./prompts-rules-tab";
import { MetricsTab } from "./metrics-tab";

interface DevelopmentDetailsTabsProps {
  // Tools
  ideUsed?: string[] | null;
  aiModelsUsed?: string[] | null;
  aiToolsUsed?: string[] | null;
  voiceToolsUsed?: string[] | null;
  // Stack
  techStack?: string[] | null;
  uiFramework?: string | null;
  mcpsUsed?: string[] | null;
  cursorRules?: string | null;
  commandsUsed?: string[] | null;
  // Process
  developmentApproach?: string | null;
  projectManagementMethod?: string | null;
  agenticWorkflowUsed?: boolean | null;
  workflowDescription?: string | null;
  // Prompts
  keyPrompts?: { title: string; prompt: string; description: string }[] | null;
  // Metrics
  totalTokenCost?: number | null;
  totalCostUsd?: number | null;
  developmentTimeHours?: number | null;
}

type TabType = "tools" | "process" | "prompts" | "metrics";

export function DevelopmentDetailsTabs(props: DevelopmentDetailsTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("tools");

  // Check if any data exists
  const hasToolsData = props.ideUsed || props.aiModelsUsed || props.aiToolsUsed || props.voiceToolsUsed;
  const hasStackData = props.techStack || props.uiFramework || props.mcpsUsed || props.commandsUsed;
  const hasProcessData = props.developmentApproach || props.projectManagementMethod || props.agenticWorkflowUsed || props.workflowDescription;
  const hasPromptsData = props.keyPrompts || props.cursorRules;
  const hasMetricsData = props.totalTokenCost || props.totalCostUsd || props.developmentTimeHours;

  const hasAnyData = hasToolsData || hasStackData || hasProcessData || hasPromptsData || hasMetricsData;

  if (!hasAnyData) {
    return null;
  }

  const tabs: { id: TabType; label: string; show: boolean }[] = [
    { id: "tools", label: "Tools & Stack", show: !!(hasToolsData || hasStackData) },
    { id: "process", label: "Process & Workflow", show: !!hasProcessData },
    { id: "prompts", label: "Prompts & Rules", show: !!hasPromptsData },
    { id: "metrics", label: "Metrics", show: !!hasMetricsData },
  ];

  const visibleTabs = tabs.filter(tab => tab.show);

  // Set first visible tab as default
  if (visibleTabs.length > 0 && !visibleTabs.find(t => t.id === activeTab)) {
    setActiveTab(visibleTabs[0].id);
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 overflow-x-auto">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 bg-white dark:bg-gray-900"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6 bg-white dark:bg-gray-900">
        {activeTab === "tools" && (
          <ToolsStackTab
            ideUsed={props.ideUsed}
            aiModelsUsed={props.aiModelsUsed}
            aiToolsUsed={props.aiToolsUsed}
            voiceToolsUsed={props.voiceToolsUsed}
            techStack={props.techStack}
            uiFramework={props.uiFramework}
            mcpsUsed={props.mcpsUsed}
            commandsUsed={props.commandsUsed}
          />
        )}

        {activeTab === "process" && (
          <ProcessWorkflowTab
            developmentApproach={props.developmentApproach}
            projectManagementMethod={props.projectManagementMethod}
            agenticWorkflowUsed={props.agenticWorkflowUsed}
            workflowDescription={props.workflowDescription}
          />
        )}

        {activeTab === "prompts" && (
          <PromptsRulesTab
            keyPrompts={props.keyPrompts}
            cursorRules={props.cursorRules}
          />
        )}

        {activeTab === "metrics" && (
          <MetricsTab
            totalTokenCost={props.totalTokenCost}
            totalCostUsd={props.totalCostUsd}
            developmentTimeHours={props.developmentTimeHours}
          />
        )}
      </div>
    </div>
  );
}
