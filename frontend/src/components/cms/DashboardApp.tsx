import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { DashboardCards } from "./DashboardCards";
import { QuickActions } from "./QuickActions";
import { RecentActivity } from "./RecentActivity";
import { ProductsPage } from "./ProductsPage";
import { AddProductPage } from "./AddProductPage";
import { OrdersPage } from "./OrdersPage";
import { ContentPage } from "./ContentPage";
import { MediaPage } from "./MediaPage";
import { UsersPage } from "./UsersPage";
import { AnalyticsPage } from "./AnalyticsPage";
import { SettingsPage } from "./SettingsPage";
import type { AuthUser } from "../../lib/api";

type DashboardAppProps = {
  currentUser: AuthUser | null;
};

export function DashboardApp({ currentUser }: DashboardAppProps) {
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
              <h1 className="mb-2 text-3xl font-semibold text-foreground">Welcome back!</h1>
              <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your projects today.</p>
            </div>

            <DashboardCards />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
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
        return <ContentPage currentUser={currentUser} />;
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
    <div className="flex min-h-screen bg-background">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={(section) => {
          setActiveSection(section);
          setShowAddProduct(false);
        }}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}
