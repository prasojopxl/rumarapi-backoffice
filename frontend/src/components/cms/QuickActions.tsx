import { Plus, Upload, Edit, Settings } from "lucide-react";

export function QuickActions() {
  const actions = [
    { label: "New Product", icon: Plus, color: "bg-purple-500 hover:bg-purple-600" },
    { label: "Upload Media", icon: Upload, color: "bg-blue-500 hover:bg-blue-600" },
    { label: "Create Page", icon: Edit, color: "bg-green-500 hover:bg-green-600" },
    { label: "Settings", icon: Settings, color: "bg-orange-500 hover:bg-orange-600" },
  ];

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              className={`${action.color} text-white rounded-lg p-4 flex flex-col items-center gap-2 transition-all hover:scale-105`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
