"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X, Shield } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-brand-cream/80 backdrop-blur-md border-b border-brand-gold/15 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand Area */}
          <div className="flex-shrink-0 flex flex-col">
            <Link href="/" className="group flex flex-col">
              <span className="text-2xl sm:text-3xl font-serif font-bold tracking-wider text-brand-crimson group-hover:text-brand-gold transition-colors duration-300">
                AAKARSHAN
              </span>
              <span className="text-[10px] tracking-[0.25em] font-sans font-semibold text-brand-gold uppercase text-center mt-[-4px]">
                Women's Wear
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-brand-dark/80 hover:text-brand-crimson font-medium tracking-wide transition-colors duration-300"
            >
              Home
            </Link>
            <a 
              href="#collections" 
              className="text-brand-dark/80 hover:text-brand-crimson font-medium tracking-wide transition-colors duration-300"
            >
              Collections
            </a>
            <a 
              href="#gallery" 
              className="text-brand-dark/80 hover:text-brand-crimson font-medium tracking-wide transition-colors duration-300"
            >
              Boutique Gallery
            </a>
            <a 
              href="#about" 
              className="text-brand-dark/80 hover:text-brand-crimson font-medium tracking-wide transition-colors duration-300"
            >
              About
            </a>
            <Link 
              href="/admin" 
              className="flex items-center gap-1.5 px-4 py-2 border border-brand-gold/45 rounded-full text-xs font-semibold text-brand-gold hover:bg-brand-gold hover:text-brand-cream transition-all duration-300 shadow-sm"
            >
              <Shield className="w-3.5 h-3.5" />
              Admin Portal
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-brand-crimson hover:text-brand-gold hover:bg-brand-cream/50 focus:outline-none transition-colors duration-200"
            >
              {isOpen ? <X className="h-6 h-6" /> : <Menu className="h-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden bg-brand-cream border-b border-brand-gold/15 py-4 px-6 animate-fadeIn">
          <div className="flex flex-col space-y-4">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="text-brand-dark hover:text-brand-crimson text-lg font-medium py-1 transition-colors"
            >
              Home
            </Link>
            <a
              href="#collections"
              onClick={() => setIsOpen(false)}
              className="text-brand-dark hover:text-brand-crimson text-lg font-medium py-1 transition-colors"
            >
              Collections
            </a>
            <a
              href="#gallery"
              onClick={() => setIsOpen(false)}
              className="text-brand-dark hover:text-brand-crimson text-lg font-medium py-1 transition-colors"
            >
              Boutique Gallery
            </a>
            <a
              href="#about"
              onClick={() => setIsOpen(false)}
              className="text-brand-dark hover:text-brand-crimson text-lg font-medium py-1 transition-colors"
            >
              About
            </a>
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 py-3 border border-brand-gold/45 rounded-full text-sm font-semibold text-brand-gold hover:bg-brand-gold hover:text-brand-cream transition-all duration-300"
            >
              <Shield className="w-4 h-4" />
              Admin Portal
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
