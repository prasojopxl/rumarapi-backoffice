import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { DashboardCards } from "./components/DashboardCards";
import { QuickActions } from "./components/QuickActions";
import { RecentActivity } from "./components/RecentActivity";
import { ProductsPage } from "./components/ProductsPage";
import { AddProductPage } from "./components/AddProductPage";
import { OrdersPage } from "./components/OrdersPage";
import { ContentPage } from "./components/ContentPage";
import { MediaPage } from "./components/MediaPage";
import { UsersPage } from "./components/UsersPage";
import { AnalyticsPage } from "./components/AnalyticsPage";
import { SettingsPage } from "./components/SettingsPage";

export default function App() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showAddProduct, setShowAddProduct] = useState(false);

  const renderContent = () => {
    if (activeSection === "products") {
      if (showAddProduct) {
        return <AddProductPage onBack={() => setShowAddProduct(false)} />;
      }
      return <ProductsPage onAddProduct={() => setShowAddProduct(true)} />;
    }

    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold text-foreground mb-2">Welcome back!</h1>
              <p className="text-muted-foreground">Here's what's happening with your projects today.</p>
            </div>

            <DashboardCards />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <QuickActions />
              </div>
              <div>
                <RecentActivity />
              </div>
            </div>
          </div>
        );
      case "orders":
        return <OrdersPage />;
      case "content":
        return <ContentPage />;
      case "media":
        return <MediaPage />;
      case "users":
        return <UsersPage />;
      case "analytics":
        return <AnalyticsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return null;
    }
  };

  return (
    <div className="size-full flex bg-background">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={(section) => {
          setActiveSection(section);
          setShowAddProduct(false);
        }}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}