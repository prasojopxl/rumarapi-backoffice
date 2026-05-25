import { Search, Filter, Eye, Download } from "lucide-react";
import { useState } from "react";

export function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const orders = [
    {
      id: "#12345",
      customer: "John Doe",
      email: "john@example.com",
      date: "2026-05-20",
      total: "$299.00",
      status: "Completed",
      items: 3,
    },
    {
      id: "#12344",
      customer: "Jane Smith",
      email: "jane@example.com",
      date: "2026-05-20",
      total: "$459.00",
      status: "Processing",
      items: 2,
    },
    {
      id: "#12343",
      customer: "Bob Johnson",
      email: "bob@example.com",
      date: "2026-05-19",
      total: "$89.00",
      status: "Pending",
      items: 1,
    },
    {
      id: "#12342",
      customer: "Alice Brown",
      email: "alice@example.com",
      date: "2026-05-19",
      total: "$678.00",
      status: "Completed",
      items: 5,
    },
    {
      id: "#12341",
      customer: "Charlie Wilson",
      email: "charlie@example.com",
      date: "2026-05-18",
      total: "$149.00",
      status: "Cancelled",
      items: 1,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Processing":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage and track customer orders</p>
        </div>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Orders", value: "1,234", color: "from-purple-500 to-purple-600" },
          { label: "Pending", value: "23", color: "from-yellow-500 to-yellow-600" },
          { label: "Processing", value: "45", color: "from-blue-500 to-blue-600" },
          { label: "Completed", value: "1,166", color: "from-green-500 to-green-600" },
        ].map((stat, index) => (
          <div key={index} className="bg-card rounded-xl p-6 border border-border">
            <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
            <h3 className="text-2xl font-semibold text-foreground">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border">
        <div className="p-4 border-b border-border flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input-background rounded-lg border border-transparent focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-foreground">{order.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-foreground">{order.customer}</p>
                      <p className="text-xs text-muted-foreground">{order.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {order.items}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                    {order.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing 1 to 5 of 5 orders</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-border rounded-lg hover:bg-accent transition-colors text-sm">
              Previous
            </button>
            <button className="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-sm">1</button>
            <button className="px-3 py-1 border border-border rounded-lg hover:bg-accent transition-colors text-sm">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
