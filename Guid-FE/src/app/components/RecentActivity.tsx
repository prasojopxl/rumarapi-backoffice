import { Package, FileText, Users, ShoppingBag } from "lucide-react";

export function RecentActivity() {
  const activities = [
    {
      type: "product",
      title: "New product added",
      description: "Wireless Headphones Pro",
      time: "2 minutes ago",
      icon: Package,
      color: "bg-purple-100 text-purple-600",
    },
    {
      type: "content",
      title: "Page updated",
      description: "About Us page modified",
      time: "15 minutes ago",
      icon: FileText,
      color: "bg-blue-100 text-blue-600",
    },
    {
      type: "user",
      title: "New user registered",
      description: "john.doe@example.com",
      time: "1 hour ago",
      icon: Users,
      color: "bg-green-100 text-green-600",
    },
    {
      type: "order",
      title: "New order received",
      description: "Order #12345 - $299.00",
      time: "2 hours ago",
      icon: ShoppingBag,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div key={index} className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg ${activity.color} flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
