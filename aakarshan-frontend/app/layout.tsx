import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aakarshan | Premium Women's Wear Boutique",
  description: "Explore exquisite handcrafted ethnic sarees, designer Anarkali suits, custom Kurtis, and luxury bridal Lehengas at Aakarshan Women's Wear. Visit our physical store or buy instantly via WhatsApp.",
  keywords: ["Aakarshan", "Women's Wear", "Sarees", "Kurtis", "Lehenga", "Suits", "Ethnic Wear", "Indian Boutique"],
  authors: [{ name: "Aakarshan Women's Wear" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${playfairDisplay.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body 
        className="min-h-full flex flex-col bg-brand-cream text-brand-dark font-sans selection:bg-brand-crimson selection:text-white"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
