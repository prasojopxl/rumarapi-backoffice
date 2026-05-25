import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { createProduct, getCategories, toSlug, type Category } from "../../lib/api";

interface AddProductPageProps {
  onBack: () => void;
}

export function AddProductPage({ onBack }: AddProductPageProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  const [productData, setProductData] = useState({
    name: "",
    slug: "",
    categoryId: "",
    price: "",
    stock: "0",
    description: "",
    status: "active",
  });

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch {
        setCategories([]);
      }
    }

    void loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setFeedback("");

    try {
      await createProduct({
        categoryId: productData.categoryId || undefined,
        name: productData.name,
        slug: productData.slug,
        description: productData.description || undefined,
        price: Number(productData.price),
        stock: Number(productData.stock || "0"),
        status: productData.status,
      });

      setFeedback("Product berhasil dibuat");
      setProductData({
        name: "",
        slug: "",
        categoryId: "",
        price: "",
        stock: "0",
        description: "",
        status: "active",
      });
      onBack();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal membuat product";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="rounded-lg p-2 transition-colors hover:bg-accent">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Add New Product</h1>
          <p className="mt-1 text-muted-foreground">Create product langsung ke backend.</p>
        </div>
      </div>

      {feedback ? <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">{feedback}</p> : null}
      {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p> : null}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Product Information</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Product Name</label>
                <input
                  type="text"
                  value={productData.name}
                  onChange={(e) =>
                    setProductData((prev) => ({
                      ...prev,
                      name: e.target.value,
                      slug: prev.slug ? prev.slug : toSlug(e.target.value),
                    }))
                  }
                  placeholder="Enter product name"
                  className="w-full rounded-lg border border-border bg-input-background px-4 py-2"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Slug</label>
                <input
                  type="text"
                  value={productData.slug}
                  onChange={(e) => setProductData((prev) => ({ ...prev, slug: toSlug(e.target.value) }))}
                  placeholder="product-slug"
                  className="w-full rounded-lg border border-border bg-input-background px-4 py-2"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Description</label>
                <textarea
                  value={productData.description}
                  onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                  placeholder="Enter product description"
                  rows={5}
                  className="w-full resize-none rounded-lg border border-border bg-input-background px-4 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Category</label>
                  <select
                    value={productData.categoryId}
                    onChange={(e) => setProductData({ ...productData, categoryId: e.target.value })}
                    className="w-full rounded-lg border border-border bg-input-background px-4 py-2"
                  >
                    <option value="">No category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Status</label>
                  <select
                    value={productData.status}
                    onChange={(e) => setProductData({ ...productData, status: e.target.value })}
                    className="w-full rounded-lg border border-border bg-input-background px-4 py-2"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Pricing & Inventory</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Price</label>
                <input
                  type="number"
                  value={productData.price}
                  onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                  placeholder="0"
                  className="w-full rounded-lg border border-border bg-input-background px-4 py-2"
                  required
                  min={0}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Stock Quantity</label>
                <input
                  type="number"
                  value={productData.stock}
                  onChange={(e) => setProductData({ ...productData, stock: e.target.value })}
                  placeholder="0"
                  className="w-full rounded-lg border border-border bg-input-background px-4 py-2"
                  required
                  min={0}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={saving}
          >
            {saving ? "Menyimpan..." : "Add Product"}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="w-full rounded-lg border border-border py-3 font-medium transition-colors hover:bg-accent"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
