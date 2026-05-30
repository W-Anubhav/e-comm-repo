"use client";

import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/lib/api";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
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
  const initiateWhatsAppCheckout = () => {
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
    <div className="group relative bg-brand-cream border border-brand-gold/15 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-brand-gold/45 transition-all duration-500 flex flex-col h-full transform hover:-translate-y-1">
      
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
  );
}
