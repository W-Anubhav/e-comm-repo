"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchProducts, deleteProduct, Product } from "@/lib/api";
import Link from "next/link";
import Footer from "@/components/Footer";
import { 
  Plus, 
  Trash2, 
  ExternalLink, 
  LogOut, 
  FolderHeart, 
  Layers, 
  Loader2, 
  AlertCircle,
  CheckCircle,
  Shirt
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Authenticate Admin session locally first
  useEffect(() => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        router.push("/admin/login");
      } else {
        setSession({ access_token: token });
        loadAdminData();
      }
    } catch (err) {
      console.error("Dashboard auth check error:", err);
      router.push("/admin/login");
    } finally {
      setAuthLoading(false);
    }
  }, [router]);

  /**
   * Loads inventory products lists from Backend API
   */
  async function loadAdminData() {
    try {
      setLoading(true);
      setErrorMsg("");
      const data = await fetchProducts();
      setProducts(data);
    } catch (err: any) {
      setErrorMsg("Failed to connect with secure API server. Check your connection or .env configs.");
    } finally {
      setLoading(false);
    }
  }

  /**
   * Executed to delete product through the secure server API
   */
  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product listing from the storefront?")) {
      return;
    }

    try {
      setErrorMsg("");
      setSuccessMsg("");
      
      const token = session?.access_token;
      if (!token) throw new Error("Auth session expired. Please re-login.");

      await deleteProduct(id, token);
      
      // Update UI state
      setProducts(products.filter(p => p.id !== id));
      setSuccessMsg("Listing successfully deleted.");
      
      // Clear success banner
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to delete product.");
    }
  };

  /**
   * Log out session locally
   */
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    router.push("/admin/login");
  };

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-brand-cream gap-4">
        <Loader2 className="w-10 h-10 text-brand-crimson animate-spin" />
        <span className="text-xs uppercase tracking-widest font-semibold text-brand-dark/70">
          Verifying security authorization...
        </span>
      </div>
    );
  }

  // Double security block check
  if (!session) return null;

  // Compute key stats
  const totalItems = products.length;
  const categoriesCount = new Set(products.map(p => p.category)).size;
  const highestPrice = products.length > 0 ? Math.max(...products.map(p => p.price)) : 0;

  return (
    <div className="flex flex-col min-h-screen bg-brand-cream text-brand-dark">
      
      {/* Header bar for dashboard */}
      <header className="sticky top-0 z-40 bg-brand-dark text-brand-cream border-b border-brand-gold/45 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-serif font-bold text-brand-cream tracking-wide">
              AAKARSHAN
            </span>
            <span className="text-[9px] tracking-wider text-brand-gold font-bold uppercase mt-[-2px]">
              Store Administration
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              target="_blank" 
              className="hidden sm:flex items-center gap-1.5 text-xs text-brand-cream/80 hover:text-brand-gold transition-colors font-semibold"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Storefront
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-1.5 border border-brand-crimson/50 hover:bg-brand-crimson rounded-full text-xs font-semibold text-brand-cream transition-all duration-300 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main dashboard content area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow">
        
        {/* Dash title & add btn */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-wide text-brand-dark">
              Management Dashboard
            </h1>
            <p className="text-xs text-brand-dark/70 mt-1">
              Add new inventory listings, delete items, and inspect active collections.
            </p>
          </div>

          <Link
            href="/admin/new"
            className="inline-flex items-center justify-center gap-1.5 px-6 py-3 bg-brand-crimson hover:bg-brand-gold text-brand-cream text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add New Product
          </Link>
        </div>

        {/* Status messages banner */}
        {errorMsg && (
          <div className="flex items-start gap-2.5 p-4 bg-brand-crimson/10 border border-brand-crimson/30 text-brand-crimson text-sm rounded-xl font-medium mb-6">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="flex items-start gap-2.5 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-sm rounded-xl font-medium mb-6">
            <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Stats Section Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          
          <div className="bg-brand-cream border border-brand-gold/25 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-crimson/10 border border-brand-crimson/25 flex items-center justify-center text-brand-crimson">
              <Shirt className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-brand-dark/60 block">Total Catalog Items</span>
              <span className="text-2xl font-bold text-brand-dark">{totalItems} Products</span>
            </div>
          </div>

          <div className="bg-brand-cream border border-brand-gold/25 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-gold/10 border border-brand-gold/25 flex items-center justify-center text-brand-gold">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-brand-dark/60 block">Categories Active</span>
              <span className="text-2xl font-bold text-brand-dark">{categoriesCount} Sections</span>
            </div>
          </div>

          <div className="bg-brand-cream border border-brand-gold/25 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-dark/10 border border-brand-dark/25 flex items-center justify-center text-brand-dark">
              <FolderHeart className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-brand-dark/60 block">Max Value Premium</span>
              <span className="text-2xl font-bold text-brand-dark">
                {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(highestPrice)}
              </span>
            </div>
          </div>

        </div>

        {/* Product listing table */}
        <div className="bg-brand-cream border border-brand-gold/25 rounded-2xl overflow-hidden shadow-md">
          
          <div className="p-6 border-b border-brand-gold/15 flex items-center justify-between">
            <h3 className="text-base font-serif font-bold text-brand-dark tracking-wide">
              Product Listing Inventory
            </h3>
            <button 
              onClick={loadAdminData}
              className="text-xs text-brand-gold hover:text-brand-crimson font-bold uppercase tracking-wider transition-colors"
            >
              Refresh Table
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
              <p className="text-xs text-brand-dark/60 uppercase tracking-widest font-semibold animate-pulse">
                Fetching secure records...
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <Shirt className="w-12 h-12 text-brand-dark/20 mb-3" />
              <h4 className="text-base font-bold text-brand-dark">No Products Registered</h4>
              <p className="text-xs text-brand-dark/70 mt-1 max-w-sm">
                Your database is empty. Click the "Add New Product" button above to upload clothing photos and create catalog entries.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-dark/5 text-[10px] font-bold uppercase tracking-wider text-brand-dark/70 border-b border-brand-gold/15">
                    <th className="py-4 px-6">Garment Preview</th>
                    <th className="py-4 px-6">Product Details</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Price</th>
                    <th className="py-4 px-6 text-center">Safety Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-gold/10">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-brand-gold/5 transition-colors">
                      
                      {/* Image preview */}
                      <td className="py-4 px-6">
                        <div className="w-12 h-16 rounded-lg overflow-hidden border border-brand-gold/20 bg-brand-dark/5">
                          <img
                            src={product.image_url}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>

                      {/* Details */}
                      <td className="py-4 px-6 max-w-xs">
                        <span className="text-sm font-bold text-brand-dark block line-clamp-1">
                          {product.title}
                        </span>
                        <span className="text-xs text-brand-dark/60 block line-clamp-1 mt-0.5">
                          {product.description}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-crimson/10 text-brand-crimson border border-brand-crimson/20">
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-6 font-semibold font-sans text-brand-dark">
                        {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(product.price)}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 border border-brand-crimson/30 text-brand-crimson hover:bg-brand-crimson hover:text-brand-cream rounded-full transition-all duration-300 cursor-pointer inline-flex items-center justify-center"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
