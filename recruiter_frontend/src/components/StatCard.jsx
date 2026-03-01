import { Card } from "./ui/card";

export function StatCard({ title, value, icon: Icon, trend, trendUp }) {
  return (
    <Card className="p-6 bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-500 text-sm mb-2">{title}</p>
          <h3 className="text-gray-900 mb-1">{value}</h3>

          {trend && (
            <p
              className={`text-sm ${
                trendUp ? "text-green-600" : "text-red-600"
              }`}
            >
              {trendUp ? "↑" : "↓"} {trend}
            </p>
          )}
        </div>

        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#0052CC] to-[#00B8D9] flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>
  );
}