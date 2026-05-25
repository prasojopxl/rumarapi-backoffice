import { Copy, Search, Upload } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { getImages, uploadImage, type ImageItem } from "../../lib/api";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ??
  import.meta.env.VITE_API_PROXY_TARGET ??
  "http://localhost:3000";
const PAGE_SIZE = 9;

function formatBytes(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mediaItems, setMediaItems] = useState<ImageItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  async function refreshImages() {
    setLoading(true);
    try {
      const items = await getImages();
      const sorted = [...items].sort((a, b) => {
        const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bDate - aDate;
      });
      setMediaItems(sorted);
      setCurrentPage(1);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal load media";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshImages();
  }, []);

  const filteredMedia = useMemo(
    () =>
      mediaItems.filter((item) => {
        const keyword = searchQuery.toLowerCase();
        return (
          item.filename.toLowerCase().includes(keyword) ||
          item.id.toLowerCase().includes(keyword) ||
          item.fileType.toLowerCase().includes(keyword)
        );
      }),
    [mediaItems, searchQuery],
  );

  const totalPages = Math.max(1, Math.ceil(filteredMedia.length / PAGE_SIZE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedMedia = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredMedia.slice(start, start + PAGE_SIZE);
  }, [filteredMedia, currentPage]);

  async function copyText(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setFeedback(`${label} berhasil disalin`);
      setError("");
    } catch {
      setError(`Gagal menyalin ${label}`);
    }
  }

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    setError("");
    setFeedback("");

    try {
      const result = await uploadImage(file);
      setFeedback(result.message || "Upload sukses");
      await refreshImages();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload gagal";
      setError(message);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Media Library</h1>
          <p className="mt-1 text-muted-foreground">Upload image ke backend dan pakai ID-nya untuk post/product.</p>
        </div>
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
          <button
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={uploading}
          >
            <Upload className="h-4 w-4" />
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
        </>
      </div>

      {feedback ? <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">{feedback}</p> : null}
      {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p> : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Total Files</p>
          <h3 className="text-2xl font-semibold text-foreground">{mediaItems.length}</h3>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Images</p>
          <h3 className="text-2xl font-semibold text-foreground">{mediaItems.length}</h3>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Storage</p>
          <h3 className="text-2xl font-semibold text-foreground">
            {formatBytes(mediaItems.reduce((sum, item) => sum + item.fileSize, 0))}
          </h3>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-transparent bg-input-background py-2 pl-10 pr-4 transition-colors focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
          {loading ? <p className="text-sm text-muted-foreground">Loading media...</p> : null}
          {!loading && paginatedMedia.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada gambar yang cocok dengan pencarian.</p>
          ) : null}
          {!loading
            ? paginatedMedia.map((item) => {
                const imageUrl = `${API_BASE}${item.filePath}`;
                return (
                  <article key={item.id} className="overflow-hidden rounded-xl border border-border bg-background">
                    <div className="aspect-[4/3] bg-muted">
                      <img
                        src={imageUrl}
                        alt={item.filename}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="space-y-2 p-4">
                      <p className="truncate text-sm font-semibold text-foreground">{item.filename}</p>
                      <p className="text-xs text-muted-foreground">ID: {item.id}</p>
                      <p className="text-xs text-muted-foreground">{item.fileType} • {formatBytes(item.fileSize)}</p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => void copyText(item.id, "Media ID")}
                          className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs hover:bg-accent"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          Copy ID
                        </button>
                        <button
                          type="button"
                          onClick={() => void copyText(imageUrl, "Image URL")}
                          className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs hover:bg-accent"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          Copy URL
                        </button>
                        <a
                          href={imageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center rounded-md border border-border px-2.5 py-1.5 text-xs hover:bg-accent"
                        >
                          Open
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })
            : null}
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * PAGE_SIZE + (paginatedMedia.length > 0 ? 1 : 0)}-
            {(currentPage - 1) * PAGE_SIZE + paginatedMedia.length} of {filteredMedia.length} images
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage <= 1}
              className="rounded-md border border-border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage >= totalPages}
              className="rounded-md border border-border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
