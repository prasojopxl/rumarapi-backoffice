import { Upload, Search, Grid3x3, List, Trash2, Download, Eye } from "lucide-react";
import { useState } from "react";

export function MediaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const mediaItems = [
    { id: 1, name: "product-image-1.jpg", size: "2.4 MB", type: "Image", date: "2026-05-20", preview: "🖼️" },
    { id: 2, name: "banner-hero.png", size: "5.1 MB", type: "Image", date: "2026-05-19", preview: "🎨" },
    { id: 3, name: "logo.svg", size: "45 KB", type: "Vector", date: "2026-05-18", preview: "⚡" },
    { id: 4, name: "product-video.mp4", size: "12.3 MB", type: "Video", date: "2026-05-17", preview: "🎬" },
    { id: 5, name: "document.pdf", size: "1.2 MB", type: "Document", date: "2026-05-16", preview: "📄" },
    { id: 6, name: "icon-set.zip", size: "3.8 MB", type: "Archive", date: "2026-05-15", preview: "📦" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Media Library</h1>
          <p className="text-muted-foreground mt-1">Manage your images, videos, and files</p>
        </div>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Upload className="w-4 h-4" />
          Upload Files
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Files", value: "234" },
          { label: "Images", value: "156" },
          { label: "Videos", value: "23" },
          { label: "Documents", value: "55" },
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
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input-background rounded-lg border border-transparent focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mediaItems.map((item) => (
              <div
                key={item.id}
                className="bg-muted rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all group"
              >
                <div className="aspect-square flex items-center justify-center text-6xl bg-gradient-to-br from-purple-100 to-blue-100">
                  {item.preview}
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.size}</p>
                  <div className="mt-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="flex-1 p-1.5 bg-accent rounded hover:bg-accent/80 transition-colors">
                      <Eye className="w-3 h-3 mx-auto" />
                    </button>
                    <button className="flex-1 p-1.5 bg-accent rounded hover:bg-accent/80 transition-colors">
                      <Download className="w-3 h-3 mx-auto" />
                    </button>
                    <button className="flex-1 p-1.5 bg-destructive/10 rounded hover:bg-destructive/20 transition-colors">
                      <Trash2 className="w-3 h-3 mx-auto text-destructive" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    File Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Upload Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mediaItems.map((item) => (
                  <tr key={item.id} className="hover:bg-accent/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.preview}</span>
                        <span className="font-medium text-foreground">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{item.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{item.size}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{item.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                          <Download className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="p-2 hover:bg-destructive/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing 1 to 6 of 6 files</p>
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
