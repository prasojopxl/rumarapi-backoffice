import { ArrowLeft, Upload, X } from "lucide-react";
import { useState } from "react";

interface AddProductPageProps {
  onBack: () => void;
}

export function AddProductPage({ onBack }: AddProductPageProps) {
  const [productData, setProductData] = useState({
    name: "",
    category: "",
    price: "",
    comparePrice: "",
    stock: "",
    sku: "",
    description: "",
    status: "active",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Product data:", productData);
    onBack();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Add New Product</h1>
          <p className="text-muted-foreground mt-1">Create a new product for your store</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Product Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={productData.name}
                  onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                  placeholder="Enter product name"
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:border-primary focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  value={productData.description}
                  onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                  placeholder="Enter product description"
                  rows={5}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:border-primary focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Category
                  </label>
                  <select
                    value={productData.category}
                    onChange={(e) => setProductData({ ...productData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:border-primary focus:outline-none transition-colors"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="accessories">Accessories</option>
                    <option value="home">Home & Kitchen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={productData.sku}
                    onChange={(e) => setProductData({ ...productData, sku: e.target.value })}
                    placeholder="SKU-001"
                    className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Product Images</h3>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-foreground mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Pricing</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <input
                    type="number"
                    value={productData.price}
                    onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-2 bg-input-background rounded-lg border border-border focus:border-primary focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Compare at Price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <input
                    type="number"
                    value={productData.comparePrice}
                    onChange={(e) => setProductData({ ...productData, comparePrice: e.target.value })}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-2 bg-input-background rounded-lg border border-border focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Product Status</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={productData.status === "active"}
                  onChange={(e) => setProductData({ ...productData, status: e.target.value })}
                  className="w-4 h-4 text-primary"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">Active</p>
                  <p className="text-xs text-muted-foreground">Product is visible in store</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={productData.status === "draft"}
                  onChange={(e) => setProductData({ ...productData, status: e.target.value })}
                  className="w-4 h-4 text-primary"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">Draft</p>
                  <p className="text-xs text-muted-foreground">Product is hidden</p>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Inventory</h3>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                value={productData.stock}
                onChange={(e) => setProductData({ ...productData, stock: e.target.value })}
                placeholder="0"
                className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:border-primary focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              Add Product
            </button>
            <button
              type="button"
              onClick={onBack}
              className="w-full border border-border py-3 rounded-lg hover:bg-accent transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
