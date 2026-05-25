import { Filter, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getProducts, type Product } from "../../lib/api";

interface ProductsPageProps {
  onAddProduct: () => void;
}

export function ProductsPage({ onAddProduct }: ProductsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const result = await getProducts();
        setProducts(result);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    void loadProducts();
  }, []);

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const keyword = searchQuery.toLowerCase();
        return product.name.toLowerCase().includes(keyword) || product.slug.toLowerCase().includes(keyword);
      }),
    [products, searchQuery],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Products</h1>
          <p className="mt-1 text-muted-foreground">Manage your product inventory</p>
        </div>
        <button
          onClick={onAddProduct}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center gap-4 border-b border-border p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-transparent bg-input-background py-2 pl-10 pr-4 transition-colors focus:border-primary focus:outline-none"
            />
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 transition-colors hover:bg-accent">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td className="px-6 py-4 text-sm text-muted-foreground" colSpan={5}>
                    Loading products...
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="transition-colors hover:bg-accent/50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground">{product.name}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">{product.slug}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground">{Number(product.price).toLocaleString()}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">{product.stock ?? 0}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        {(product.status || "active").toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-border p-4">
          <p className="text-sm text-muted-foreground">Total products: {filteredProducts.length}</p>
        </div>
      </div>
    </div>
  );
}
