import { Save, Upload } from "lucide-react";
import { useState } from "react";

export function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "My E-commerce Store",
    siteEmail: "admin@example.com",
    siteDescription: "Your trusted online store",
    currency: "USD",
    language: "en",
    timezone: "UTC",
    notificationsEmail: true,
    notificationsOrder: true,
    notificationsSms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Settings saved:", settings);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your application settings</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">General Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Site Email
                </label>
                <input
                  type="email"
                  value={settings.siteEmail}
                  onChange={(e) => setSettings({ ...settings, siteEmail: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Site Description
                </label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:border-primary focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Currency
                  </label>
                  <select
                    value={settings.currency}
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                    className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:border-primary focus:outline-none transition-colors"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="IDR">IDR - Indonesian Rupiah</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Language
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                    className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:border-primary focus:outline-none transition-colors"
                  >
                    <option value="en">English</option>
                    <option value="id">Indonesian</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Branding</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Logo
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                    <span className="text-white text-xl font-semibold">LOGO</span>
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload New Logo
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Favicon
                </label>
                <button
                  type="button"
                  className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload Favicon
                </button>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Notifications</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-foreground">Email Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive email updates</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notificationsEmail}
                  onChange={(e) => setSettings({ ...settings, notificationsEmail: e.target.checked })}
                  className="w-5 h-5 rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-foreground">Order Notifications</p>
                  <p className="text-xs text-muted-foreground">Get notified about new orders</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notificationsOrder}
                  onChange={(e) => setSettings({ ...settings, notificationsOrder: e.target.checked })}
                  className="w-5 h-5 rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-foreground">SMS Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive SMS alerts</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notificationsSms}
                  onChange={(e) => setSettings({ ...settings, notificationsSms: e.target.checked })}
                  className="w-5 h-5 rounded"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Regional Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Timezone
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:border-primary focus:outline-none transition-colors"
                >
                  <option value="UTC">UTC</option>
                  <option value="Asia/Jakarta">Asia/Jakarta</option>
                  <option value="America/New_York">America/New York</option>
                  <option value="Europe/London">Europe/London</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Danger Zone</h3>
            <div className="space-y-3">
              <button
                type="button"
                className="w-full px-4 py-2 border border-destructive text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
              >
                Clear Cache
              </button>
              <button
                type="button"
                className="w-full px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Reset All Settings
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
