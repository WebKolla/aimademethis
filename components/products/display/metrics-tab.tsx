import { Clock, DollarSign, Hash } from "lucide-react";

interface MetricsTabProps {
  totalTokenCost?: number | null;
  totalCostUsd?: number | null;
  developmentTimeHours?: number | null;
}

function MetricCard({
  icon: Icon,
  label,
  value,
  unit,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {value}
        </span>
        {unit && (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

export function MetricsTab({
  totalTokenCost,
  totalCostUsd,
  developmentTimeHours,
}: MetricsTabProps) {
  const hasAnyMetrics = totalTokenCost || totalCostUsd || developmentTimeHours;

  if (!hasAnyMetrics) {
    return (
      <p className="text-sm text-muted-foreground">No metrics data provided.</p>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold mb-4">Development Metrics</h3>

      <div className="grid gap-4 md:grid-cols-3">
        {totalTokenCost && (
          <MetricCard
            icon={Hash}
            label="Total Tokens"
            value={totalTokenCost.toLocaleString()}
            unit="tokens"
          />
        )}

        {totalCostUsd && (
          <MetricCard
            icon={DollarSign}
            label="Total Cost"
            value={`$${totalCostUsd.toFixed(2)}`}
            unit="USD"
          />
        )}

        {developmentTimeHours && (
          <MetricCard
            icon={Clock}
            label="Development Time"
            value={developmentTimeHours.toLocaleString()}
            unit="hours"
          />
        )}
      </div>

      <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 border border-teal-200 dark:border-teal-800 rounded-lg">
        <p className="text-sm text-purple-900 dark:text-purple-200">
          💡 <strong>Cost Efficiency:</strong> {totalCostUsd && developmentTimeHours ? (
            <>
              This project cost approximately <strong>${(totalCostUsd / developmentTimeHours).toFixed(2)}/hour</strong> in AI/service costs.
            </>
          ) : (
            "Metrics help others understand the investment required to build similar products."
          )}
        </p>
      </div>
    </div>
  );
}
