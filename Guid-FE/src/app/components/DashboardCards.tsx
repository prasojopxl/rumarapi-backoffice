import { ShoppingBag, Users, FileText, TrendingUp } from "lucide-react";

export function DashboardCards() {
  const stats = [
    {
      title: "Total Sales",
      value: "$45,231",
      change: "+20.1%",
      icon: ShoppingBag,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Active Users",
      value: "2,345",
      change: "+12.5%",
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Content Pages",
      value: "156",
      change: "+4.3%",
      icon: FileText,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Growth Rate",
      value: "23.4%",
      change: "+8.2%",
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <h3 className="text-2xl font-semibold text-foreground mb-2">{stat.value}</h3>
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
              </div>
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
