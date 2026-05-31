"use client";

import { useState } from "react";
import { ShoppingCart, X } from "lucide-react";
import { Product } from "@/lib/api";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Format price inside standard Indian Rupees format
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(product.price);

  /**
   * Generates a secure, URI-encoded direct WhatsApp message 
   * targeting +91 9369261352 to initiate immediate order
   */
  const initiateWhatsAppCheckout = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); // Block card modal trigger
    const targetNumber = "919369261352";
    const message = `Hello Akarshan, I want to buy this gorgeous dress from your storefront:
    
✨ *Product Name:* ${product.title}
🏷️ *Category:* ${product.category}
💰 *Price:* ${formattedPrice}
📸 *Reference Image:* ${product.image_url}

Please verify availability and advise how I can complete the checkout and sizing options!`;

    const secureUrl = `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
    window.open(secureUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* Product Card Container */}
      <div 
        onClick={() => setIsModalOpen(true)}
        className="group relative bg-brand-cream border border-brand-gold/15 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-brand-gold/45 transition-all duration-500 flex flex-col h-full transform hover:-translate-y-1 cursor-pointer"
      >
        {/* Premium Product Image Container */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-dark/5">
          <img
            src={product.image_url}
            alt={product.title}
            className="h-full w-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          
          {/* Luxury Tag overlay */}
          <div className="absolute top-3 left-3 bg-brand-dark/70 backdrop-blur-md text-brand-gold border border-brand-gold/30 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest">
            {product.category}
          </div>
        </div>

        {/* Information Area */}
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-serif font-bold text-brand-dark tracking-wide line-clamp-1 group-hover:text-brand-crimson transition-colors duration-300">
            {product.title}
          </h3>
          
          <p className="mt-2 text-sm text-brand-dark/70 line-clamp-2 leading-relaxed flex-grow">
            {product.description}
          </p>

          <div className="mt-4 flex items-center justify-between border-t border-brand-gold/10 pt-4 gap-4">
            <span className="text-xl font-bold font-sans text-brand-crimson">
              {formattedPrice}
            </span>

            {/* Premium checkout button */}
            <button
              onClick={initiateWhatsAppCheckout}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-crimson hover:bg-brand-gold text-brand-cream rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-md luxury-glow"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Buy on WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* Premium Detailed Product Modal Overlay */}
      {isModalOpen && (
        <div 
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-dark/65 backdrop-blur-md p-4 transition-all duration-300 overflow-y-auto"
        >
          {/* Modal Card */}
          <div 
            onClick={(e) => e.stopPropagation()} // Prevent clicking modal content from closing it
            className="relative bg-brand-cream border border-brand-gold/30 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl flex flex-col md:flex-row gap-6 animate-scaleUp max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button Icon */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-brand-dark/60 hover:text-brand-crimson p-1.5 rounded-full hover:bg-brand-dark/5 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left: Product Image */}
            <div className="w-full md:w-1/2 aspect-[3/4] md:aspect-auto md:h-[400px] rounded-2xl overflow-hidden relative border border-brand-gold/15 bg-brand-dark/5 shrink-0">
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-brand-dark/75 backdrop-blur-md text-brand-gold border border-brand-gold/30 px-3 py-1 rounded-full text-[9px] uppercase font-bold tracking-widest">
                {product.category}
              </div>
            </div>

            {/* Right: Detailed text & WhatsApp trigger */}
            <div className="flex flex-col justify-between flex-grow py-2">
              <div>
                <span className="text-[10px] text-brand-gold font-bold uppercase tracking-widest font-sans">
                  {product.category} Collection
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-brand-dark tracking-wide mt-1">
                  {product.title}
                </h2>
                
                {/* Full Description text area */}
                <div className="mt-4 text-sm text-brand-dark/85 leading-relaxed overflow-y-auto max-h-[180px] pr-2 scrollbar-thin">
                  {product.description}
                </div>
              </div>

              <div className="mt-6 border-t border-brand-gold/15 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-brand-dark/60 font-bold uppercase tracking-wider">
                    Boutique Pricing
                  </span>
                  <span className="text-2xl font-bold font-sans text-brand-crimson mt-0.5">
                    {formattedPrice}
                  </span>
                </div>

                <button
                  onClick={initiateWhatsAppCheckout}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-brand-crimson hover:bg-brand-gold text-brand-cream rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-md luxury-glow"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Order on WhatsApp
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
