import { TrendingUp, Users, ShoppingBag, Eye } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export function AnalyticsPage() {
  const revenueData = [
    { month: "Jan", revenue: 4200 },
    { month: "Feb", revenue: 3800 },
    { month: "Mar", revenue: 5100 },
    { month: "Apr", revenue: 4600 },
    { month: "May", revenue: 6200 },
    { month: "Jun", revenue: 5800 },
  ];

  const visitorData = [
    { day: "Mon", visitors: 1200 },
    { day: "Tue", visitors: 1900 },
    { day: "Wed", visitors: 1600 },
    { day: "Thu", visitors: 2100 },
    { day: "Fri", visitors: 1800 },
    { day: "Sat", visitors: 2400 },
    { day: "Sun", visitors: 2200 },
  ];

  const categoryData = [
    { name: "Electronics", value: 45 },
    { name: "Fashion", value: 30 },
    { name: "Home", value: 15 },
    { name: "Others", value: 10 },
  ];

  const COLORS = ["#8B5CF6", "#06B6D4", "#10B981", "#F59E0B"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">Track your business performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Revenue", value: "$45,231", change: "+20.1%", icon: TrendingUp, color: "from-purple-500 to-purple-600" },
          { label: "Total Visitors", value: "12,345", change: "+15.3%", icon: Eye, color: "from-blue-500 to-blue-600" },
          { label: "Total Orders", value: "1,234", change: "+12.5%", icon: ShoppingBag, color: "from-green-500 to-green-600" },
          { label: "Active Users", value: "2,345", change: "+8.2%", icon: Users, color: "from-orange-500 to-orange-600" },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip />
              <Bar dataKey="revenue" fill="#6366F1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Visitor Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={visitorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="day" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip />
              <Line type="monotone" dataKey="visitors" stroke="#8B5CF6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Top Products</h3>
          <div className="space-y-4">
            {[
              { name: "Wireless Headphones Pro", sales: 234, revenue: "$69,966" },
              { name: "Smart Watch Series 5", sales: 189, revenue: "$75,411" },
              { name: "Running Shoes", sales: 156, revenue: "$13,884" },
              { name: "Leather Backpack", sales: 123, revenue: "$18,327" },
            ].map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                </div>
                <span className="text-sm font-semibold text-foreground">{product.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
