import { RefreshCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  createCategory,
  createPost,
  getCategories,
  getPosts,
  toSlug,
  type AuthUser,
  type Category,
  type Post,
} from "../../lib/api";

type ContentPageProps = {
  currentUser: AuthUser | null;
};

export function ContentPage({ currentUser }: ContentPageProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const [categoryData, setCategoryData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const [postData, setPostData] = useState({
    title: "",
    slug: "",
    content: "",
    featuredImageId: "",
    type: "article",
    status: "draft",
  });

  async function refreshData() {
    setLoading(true);
    setError("");
    try {
      const [nextCategories, nextPosts] = await Promise.all([getCategories(), getPosts()]);
      setCategories(nextCategories);
      setPosts(nextPosts);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed loading content data";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshData();
  }, []);

  const publishedCount = useMemo(
    () => posts.filter((item) => (item.status || "").toLowerCase() === "published").length,
    [posts],
  );

  async function handleCreateCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setFeedback("");

    try {
      await createCategory({
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description || undefined,
      });
      setFeedback("Category berhasil dibuat");
      setCategoryData({ name: "", slug: "", description: "" });
      await refreshData();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal membuat category";
      setError(message);
    }
  }

  async function handleCreatePost(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setFeedback("");

    if (!currentUser?.id) {
      setError("User login tidak ditemukan, silakan login ulang");
      return;
    }

    try {
      await createPost({
        authorId: currentUser.id,
        title: postData.title,
        slug: postData.slug,
        content: postData.content,
        featuredImageId: postData.featuredImageId || undefined,
        type: postData.type,
        status: postData.status,
      });
      setFeedback("Post berhasil dibuat");
      setPostData({
        title: "",
        slug: "",
        content: "",
        featuredImageId: "",
        type: "article",
        status: "draft",
      });
      await refreshData();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal membuat post";
      setError(message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Content Manager</h1>
          <p className="mt-1 text-muted-foreground">Create category dan post langsung ke backend API.</p>
        </div>
        <button
          onClick={() => void refreshData()}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
          type="button"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Total Categories</p>
          <p className="mt-1 text-3xl font-semibold text-foreground">{categories.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Total Posts</p>
          <p className="mt-1 text-3xl font-semibold text-foreground">{posts.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Published Posts</p>
          <p className="mt-1 text-3xl font-semibold text-foreground">{publishedCount}</p>
        </div>
      </div>

      {feedback ? <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">{feedback}</p> : null}
      {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p> : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <form onSubmit={handleCreateCategory} className="space-y-4 rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">Create Category</h2>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Name</label>
            <input
              value={categoryData.name}
              onChange={(event) =>
                setCategoryData((prev) => ({
                  ...prev,
                  name: event.target.value,
                  slug: prev.slug ? prev.slug : toSlug(event.target.value),
                }))
              }
              placeholder="Example: Electronics"
              className="w-full rounded-lg border border-border bg-input-background px-4 py-2"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Slug</label>
            <input
              value={categoryData.slug}
              onChange={(event) => setCategoryData((prev) => ({ ...prev, slug: toSlug(event.target.value) }))}
              placeholder="electronics"
              className="w-full rounded-lg border border-border bg-input-background px-4 py-2"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Description</label>
            <textarea
              value={categoryData.description}
              onChange={(event) => setCategoryData((prev) => ({ ...prev, description: event.target.value }))}
              rows={4}
              className="w-full resize-none rounded-lg border border-border bg-input-background px-4 py-2"
              placeholder="Optional"
            />
          </div>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" type="submit">
            Simpan Category
          </button>
        </form>

        <form onSubmit={handleCreatePost} className="space-y-4 rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">Create Post</h2>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Title</label>
            <input
              value={postData.title}
              onChange={(event) =>
                setPostData((prev) => ({
                  ...prev,
                  title: event.target.value,
                  slug: prev.slug ? prev.slug : toSlug(event.target.value),
                }))
              }
              placeholder="Judul post"
              className="w-full rounded-lg border border-border bg-input-background px-4 py-2"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Slug</label>
            <input
              value={postData.slug}
              onChange={(event) => setPostData((prev) => ({ ...prev, slug: toSlug(event.target.value) }))}
              placeholder="judul-post"
              className="w-full rounded-lg border border-border bg-input-background px-4 py-2"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Content</label>
            <textarea
              value={postData.content}
              onChange={(event) => setPostData((prev) => ({ ...prev, content: event.target.value }))}
              rows={5}
              className="w-full resize-none rounded-lg border border-border bg-input-background px-4 py-2"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Type</label>
              <input
                value={postData.type}
                onChange={(event) => setPostData((prev) => ({ ...prev, type: event.target.value }))}
                className="w-full rounded-lg border border-border bg-input-background px-4 py-2"
                placeholder="article"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Status</label>
              <input
                value={postData.status}
                onChange={(event) => setPostData((prev) => ({ ...prev, status: event.target.value }))}
                className="w-full rounded-lg border border-border bg-input-background px-4 py-2"
                placeholder="draft"
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Featured Image ID</label>
            <input
              value={postData.featuredImageId}
              onChange={(event) => setPostData((prev) => ({ ...prev, featuredImageId: event.target.value }))}
              className="w-full rounded-lg border border-border bg-input-background px-4 py-2"
              placeholder="Optional media ID"
            />
          </div>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" type="submit">
            Simpan Post
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Latest Categories</h3>
          {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : null}
          <div className="space-y-3">
            {categories.slice(0, 6).map((category) => (
              <div key={category.id} className="rounded-lg border border-border px-4 py-3">
                <p className="font-medium text-foreground">{category.name}</p>
                <p className="text-sm text-muted-foreground">/{category.slug}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Latest Posts</h3>
          {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : null}
          <div className="space-y-3">
            {posts.slice(0, 6).map((post) => (
              <div key={post.id} className="rounded-lg border border-border px-4 py-3">
                <p className="font-medium text-foreground">{post.title}</p>
                <p className="text-sm text-muted-foreground">/{post.slug}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
