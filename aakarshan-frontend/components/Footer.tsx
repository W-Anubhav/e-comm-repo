import Link from "next/link";
import { Phone, MapPin, Clock, Mail, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-brand-cream border-t-2 border-brand-gold/40 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Brand Presentation Section */}
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col">
              <span className="text-3xl font-serif font-bold tracking-wider text-brand-crimson">
                AAKARSHAN
              </span>
              <span className="text-xs tracking-[0.25em] font-sans font-semibold text-brand-gold uppercase mt-[-4px]">
                Women's Wear
              </span>
            </div>
            <p className="text-brand-cream/70 text-sm leading-relaxed max-w-sm">
              Discover unparalleled craftsmanship and timeless elegance. Curated selection of Banarasi sarees, bridal lehengas, custom designer kurtis, and royal Anarkali suits.
            </p>
          </div>

          {/* Quick Shop Location Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-semibold text-brand-gold tracking-wide border-b border-brand-gold/20 pb-2">
              Visit Our Boutique
            </h3>
            <ul className="space-y-3 text-sm text-brand-cream/80">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-crimson shrink-0 mt-0.5" />
                <span>Akarshan Women's Wear, Opp. Clothing Plaza, Lucknow, Uttar Pradesh, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-brand-crimson shrink-0" />
                <span>Mon - Sun: 11:00 AM - 9:00 PM</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-crimson shrink-0" />
                <a href="tel:+919369261352" className="hover:text-brand-gold transition-colors">
                  +91 9369261352
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service & Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-semibold text-brand-gold tracking-wide border-b border-brand-gold/20 pb-2">
              Customer Experience
            </h3>
            <p className="text-brand-cream/70 text-sm leading-relaxed">
              Every garment we create is handcrafted with love. Click the direct <b>WhatsApp Order button</b> on any item to order, customize sizing, or coordinate shipping with our sales concierge directly.
            </p>
            <div className="pt-2 text-xs text-brand-gold/80 flex items-center gap-1">
              <span>Direct Support Helpline:</span>
              <a href="https://wa.me/919369261352" className="underline hover:text-brand-crimson transition-colors font-medium">
                Open Chat
              </a>
            </div>
          </div>

        </div>

        {/* Footer Subline */}
        <div className="border-t border-brand-cream/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-cream/50 gap-4">
          <p>© {new Date().getFullYear()} Aakarshan Women's Wear. All Rights Reserved.</p>
          <p className="flex items-center gap-1">
            Handcrafted with <Heart className="w-3.5 h-3.5 text-brand-crimson fill-brand-crimson" /> for elegance.
          </p>
        </div>
      </div>
    </footer>
  );
}
