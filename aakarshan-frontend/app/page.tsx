"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { fetchProducts, Product } from "@/lib/api";
import { Heart, Sparkles, MapPin, Store, Check, ArrowRight } from "lucide-react";

// Pre-seeded luxury fallback products in case database is empty on first boot
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Premium Banarasi Silk Saree",
    description: "Intricately handwoven with pure golden zari work across royal crimson silk, crafted for traditional wedding celebrations.",
    price: 8499,
    category: "Sarees",
    image_url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    created_at: "",
    updated_at: ""
  },
  {
    id: "2",
    title: "Embroidered Georgette Anarkali Suit",
    description: "Flowing designer georgette suit adorned with intricate Lucknowi Chikankari embroidery, paired with a matching lace dupatta.",
    price: 3499,
    category: "Salwar Suits",
    image_url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
    created_at: "",
    updated_at: ""
  },
  {
    id: "3",
    title: "Pure Cotton Hand-Block Printed Kurti",
    description: "Chic and breathable summer kurti featuring hand-crafted floral blocks, ideal for comfort and elegant daily wear.",
    price: 1499,
    category: "Kurtis",
    image_url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    created_at: "",
    updated_at: ""
  },
  {
    id: "4",
    title: "Royal Velvet Bridal Lehenga",
    description: "Magnificent dark crimson velvet lehenga with handcrafted zardozi embroidery, featuring heavy gold sequins and double net dupatta.",
    price: 18999,
    category: "Lehengas",
    image_url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
    created_at: "",
    updated_at: ""
  }
];

const CATEGORIES = ["All", "Sarees", "Salwar Suits", "Kurtis", "Lehengas"];

export default function Storefront() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Fetch from Express API
        const data = await fetchProducts(selectedCategory === "All" ? undefined : selectedCategory);
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          // Fallback to beautiful static products if API returns empty
          const filteredFallback = selectedCategory === "All" 
            ? FALLBACK_PRODUCTS
            : FALLBACK_PRODUCTS.filter(p => p.category === selectedCategory);
          setProducts(filteredFallback);
        }
      } catch (err) {
        console.warn("Could not connect to Express backend. Loading beautiful local demo items.", err);
        const filteredFallback = selectedCategory === "All" 
          ? FALLBACK_PRODUCTS
          : FALLBACK_PRODUCTS.filter(p => p.category === selectedCategory);
        setProducts(filteredFallback);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [selectedCategory]);

  return (
    <div className="flex flex-col min-h-screen bg-brand-cream">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-brand-dark text-brand-cream py-24 sm:py-32">
        <div className="absolute inset-0 opacity-15">
          <img
            src="/brand-assets/unnamed (1).webp"
            alt="Aakarshan Store Background"
            className="w-full h-full object-cover filter blur-[2px]"
          />
        </div>
        
        {/* Luxury Gold Border Details */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-gold/30 bg-brand-gold/10 text-brand-gold text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            Exquisite Indian Craftsmanship
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-brand-cream tracking-tight max-w-4xl leading-tight">
            Unveil Your Inner <span className="text-brand-crimson">Elegance</span>
          </h1>
          
          <p className="mt-6 text-base sm:text-xl text-brand-cream/80 max-w-2xl leading-relaxed font-light">
            Step into the luxury world of Aakarshan Women’s Wear. Explore custom handcrafted sarees, bespoke designer suits, elegant kurtis, and royal bridal collections.
          </p>

          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <a
              href="#collections"
              className="px-8 py-3.5 bg-brand-crimson hover:bg-brand-gold text-brand-cream text-sm font-bold uppercase tracking-wider rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Browse Collections
            </a>
            <a
              href="#gallery"
              className="px-8 py-3.5 border border-brand-gold/50 hover:bg-brand-cream hover:text-brand-dark text-brand-cream text-sm font-bold uppercase tracking-wider rounded-full transition-all duration-300"
            >
              Tour Boutique
            </a>
          </div>
        </div>
      </section>

      {/* Main E-commerce Shop Area */}
      <main id="collections" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Title area */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-dark tracking-wide">
            Our Designer Collections
          </h2>
          <div className="mt-2 flex items-center justify-center gap-2">
            <div className="h-[1px] w-12 bg-brand-gold" />
            <Heart className="w-4 h-4 text-brand-crimson fill-brand-crimson" />
            <div className="h-[1px] w-12 bg-brand-gold" />
          </div>
        </div>

        {/* Collection Selector Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-brand-crimson text-brand-cream border-brand-crimson shadow-md"
                  : "bg-brand-cream text-brand-dark border-brand-gold/25 hover:border-brand-crimson hover:text-brand-crimson"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Dynamic Product Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-brand-crimson border-t-transparent rounded-full animate-spin" />
            <p className="text-brand-dark/70 text-sm tracking-widest font-semibold uppercase animate-pulse">
              Curating Fine Garments...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      {/* Interactive Shop Showcase Gallery (Featuring Real Assets) */}
      <section id="gallery" className="bg-brand-dark text-brand-cream py-20 border-t-2 border-brand-gold/45 border-b-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <span className="text-brand-gold text-xs font-bold uppercase tracking-widest block mb-2">
              Authentic Experience
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-brand-cream tracking-wide">
              Step Inside Akarshan
            </h2>
            <p className="mt-4 text-brand-cream/70 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
              Explore our physically located designer studio boutique. From high-quality hand-stitched details to royal gold trims, check out our store layouts.
            </p>
            <div className="mt-3 flex items-center justify-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
              <div className="w-8 h-[1px] bg-brand-gold" />
              <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
            </div>
          </div>

          {/* Real Assets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Gallery Image 1 */}
            <div className="group relative rounded-2xl overflow-hidden border border-brand-gold/25 aspect-[3/4] shadow-md">
              <img
                src="/brand-assets/unnamed.webp"
                alt="Aakarshan Store Entrance"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="flex items-center gap-1.5 text-brand-gold text-xs font-bold uppercase tracking-widest mb-1">
                  <Store className="w-3.5 h-3.5" />
                  Boutique Entrance
                </span>
                <h4 className="text-lg font-serif font-bold">Welcoming Entryway</h4>
                <p className="text-xs text-brand-cream/70 mt-1 leading-relaxed">
                  Stepping down into a treasure trove of luxurious premium fabrics.
                </p>
              </div>
            </div>

            {/* Gallery Image 2 */}
            <div className="group relative rounded-2xl overflow-hidden border border-brand-gold/25 aspect-[3/4] shadow-md">
              <img
                src="/brand-assets/unnamed (2).webp"
                alt="Aakarshan Signature Sign"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="flex items-center gap-1.5 text-brand-gold text-xs font-bold uppercase tracking-widest mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Luxury Seal
                </span>
                <h4 className="text-lg font-serif font-bold">Signature Emblem</h4>
                <p className="text-xs text-brand-cream/70 mt-1 leading-relaxed">
                  Frosted back-lit logo set in fine dark mahogany wood panels.
                </p>
              </div>
            </div>

            {/* Gallery Image 3 */}
            <div className="group relative rounded-2xl overflow-hidden border border-brand-gold/25 aspect-[3/4] shadow-md">
              <img
                src="/brand-assets/unnamed (1).webp"
                alt="Aakarshan Store Showroom"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="flex items-center gap-1.5 text-brand-gold text-xs font-bold uppercase tracking-widest mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  Showroom Floor
                </span>
                <h4 className="text-lg font-serif font-bold">Curated Counters</h4>
                <p className="text-xs text-brand-cream/70 mt-1 leading-relaxed">
                  Spacious counters and customized displays of fine sarees and suits.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* About Boutique & trust elements */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Details column */}
          <div className="space-y-6">
            <span className="text-brand-crimson text-xs font-bold uppercase tracking-widest block">
              Our Heritage & Quality
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-dark leading-tight">
              Bespoke Designs Crafted For Timeless Elegance
            </h2>
            <p className="text-brand-dark/70 text-sm sm:text-base leading-relaxed font-light">
              At Akarshan, every piece is more than apparel; it is a canvas of Indian cultural heritage. For years, we have handpicked individual threads, verified embellishments, and custom-tailored masterpieces. 
            </p>
            <p className="text-brand-dark/70 text-sm sm:text-base leading-relaxed font-light">
              We specialize in custom sizing, personalized embroidery colors, and doorstep courier deliveries across the country. Speak directly with us via WhatsApp to construct your dream dress!
            </p>
            
            {/* Bullet trust list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-gold/15 flex items-center justify-center text-brand-gold">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-dark/80">100% Hand-curated</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-gold/15 flex items-center justify-center text-brand-gold">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-dark/80">Custom Sizing Options</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-gold/15 flex items-center justify-center text-brand-gold">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-dark/80">Secured Direct Shipping</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-gold/15 flex items-center justify-center text-brand-gold">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-dark/80">Personalized WhatsApp Sales</span>
              </div>
            </div>
          </div>

          {/* Visual column with double border */}
          <div className="relative p-4">
            <div className="absolute inset-0 border border-brand-gold/25 rounded-2xl transform rotate-2 pointer-events-none" />
            <div className="absolute inset-0 border border-brand-crimson/25 rounded-2xl transform -rotate-1 pointer-events-none" />
            <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-video bg-brand-dark">
              <img
                src="/brand-assets/unnamed (2).webp"
                alt="Aakarshan Premium Brand Signboard"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
