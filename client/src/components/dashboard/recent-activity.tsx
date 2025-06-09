// Card components removed - using dark container styling
import { ActivityLog } from "@shared/schema";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";

interface RecentActivityProps {
  logs: ActivityLog[];
  maxItems?: number;
}

export function RecentActivity({ logs, maxItems = 5 }: RecentActivityProps) {
  // Format date for display
  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  // Get icon based on entity type
  const getEntityTypeIcon = (entityType: string) => {
    switch (entityType) {
      case "asset":
        return "📦";
      case "risk":
        return "⚠️";
      case "control":
        return "🛡️";
      case "response":
        return "✏️";
      default:
        return "📄";
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-600">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
          <Link href="/logs" className="text-sm font-medium text-blue-400 hover:underline">
            View all
          </Link>
        </div>

        <div className="overflow-hidden overflow-x-auto rounded-md border border-gray-600">
          <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
                  Activity
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
                  Entity
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-600">
              {logs.slice(0, maxItems).map((log) => (
                <tr key={log.id} className="hover:bg-gray-700/30 cursor-pointer">
                  <td className="px-6 py-4 text-sm text-white whitespace-nowrap">
                    {formatDate(log.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-sm text-white whitespace-nowrap">
                    {log.activity}
                  </td>
                  <td className="px-6 py-4 text-sm text-white whitespace-nowrap">
                    {log.user}
                  </td>
                  <td className="px-6 py-4 text-sm text-white whitespace-nowrap">
                    <span className="mr-1">{getEntityTypeIcon(log.entityType)}</span>
                    {log.entity}
                  </td>
                </tr>
              ))}
              
              {logs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-sm text-center text-gray-400">
                    No recent activity
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
