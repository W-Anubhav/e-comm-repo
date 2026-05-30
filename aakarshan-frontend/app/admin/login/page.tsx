"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/lib/api";
import { Lock, Mail, ShieldAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Check session on load
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      router.push("/admin");
    }
  }, [router]);

  /**
   * Safe login execution against local Express JWT endpoint
   */
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      if (!email.trim() || !password.trim()) {
        throw new Error("Security Alert: Both email and password fields must be filled!");
      }

      // Call our self-contained Express Auth endpoint
      const data = await loginAdmin(email.trim(), password);

      if (data && data.token) {
        // Save session locally
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminUser", JSON.stringify(data.user));
        
        router.push("/admin");
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid administrator credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-cream justify-center items-center px-4 sm:px-6 lg:px-8 py-12 relative">
      
      {/* Background brand graphic overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <img
          src="/brand-assets/unnamed.webp"
          alt="Aakarshan Background Seal"
          className="w-full h-full object-cover filter blur-[4px]"
        />
      </div>

      <div className="max-w-md w-full bg-brand-cream border border-brand-gold/30 rounded-2xl p-8 sm:p-10 shadow-2xl relative z-10">
        
        {/* Navigation back */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs text-brand-dark/65 hover:text-brand-crimson transition-colors mb-6 font-semibold uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Store
        </Link>

        {/* Branding header */}
        <div className="text-center flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-brand-crimson/10 border border-brand-crimson/30 rounded-full flex items-center justify-center text-brand-crimson mb-4">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-dark tracking-wide">
            Admin Auth Portal
          </h2>
          <span className="text-[10px] tracking-[0.25em] font-sans font-semibold text-brand-gold uppercase mt-1">
            Secure Administrator Login
          </span>
        </div>

        {/* Secure Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-6">
          
          {/* Visual feedback error banner */}
          {errorMsg && (
            <div className="flex items-start gap-2.5 p-3.5 bg-brand-crimson/10 border border-brand-crimson/30 text-brand-crimson text-xs rounded-xl font-semibold leading-relaxed animate-fadeIn">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Email input field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/70">
              Admin Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-brand-dark/40 pointer-events-none">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ramanujmaurya1971@gmail.com"
                className="w-full bg-brand-cream border border-brand-gold/25 focus:border-brand-crimson focus:ring-1 focus:ring-brand-crimson outline-none rounded-xl py-3 pl-10 pr-4 text-sm transition-all duration-300"
                suppressHydrationWarning
              />
            </div>
          </div>

          {/* Password input field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/70">
              Secret Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-brand-dark/40 pointer-events-none">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-brand-cream border border-brand-gold/25 focus:border-brand-crimson focus:ring-1 focus:ring-brand-crimson outline-none rounded-xl py-3 pl-10 pr-4 text-sm transition-all duration-300"
                suppressHydrationWarning
              />
            </div>
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-brand-dark hover:bg-brand-crimson text-brand-cream font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            suppressHydrationWarning
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-brand-cream border-t-transparent rounded-full animate-spin" />
            ) : (
              "Secure Authentication"
            )}
          </button>
        </form>

        <p className="text-center text-[10px] text-brand-dark/40 mt-8 font-light leading-relaxed">
          Zero-Trust security is active. Credentials are encrypted and authenticated directly with your independent Render Database.
        </p>

      </div>
    </div>
  );
}
