"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, uploadImage } from "@/lib/api";
import Link from "next/link";
import { 
  ArrowLeft, 
  UploadCloud, 
  Loader2, 
  AlertCircle, 
  CheckCircle,
  FileImage,
  Sparkles
} from "lucide-react";
import confetti from "canvas-confetti";

const CATEGORIES = ["Sarees", "Salwar Suits", "Kurtis", "Lehengas"];

function compressAndConvertToBase64(file: File, maxWidth = 800, maxHeight = 800, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas 2d context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const base64Url = canvas.toDataURL("image/jpeg", quality);
        resolve(base64Url);
      };
      img.onerror = (err) => {
        reject(err);
      };
    };
    reader.onerror = (err) => {
      reject(err);
    };
  });
}

export default function AddProductPage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Form Fields State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Sarees");
  const [customCategory, setCustomCategory] = useState("");
  const [useCustomCategory, setUseCustomCategory] = useState(false);

  // Image Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [dragging, setDragging] = useState(false);

  // Status Action States
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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
      }
    } catch (err) {
      console.error("New product auth check error:", err);
      router.push("/admin/login");
    } finally {
      setAuthLoading(false);
    }
  }, [router]);

  /**
   * Safe image file selector validator
   */
  const handleFileChange = (file: File) => {
    setErrorMsg("");
    const filetypes = /jpeg|jpg|png|webp/;
    const ext = file.name.split(".").pop()?.toLowerCase();
    
    if (!filetypes.test(file.type) && !filetypes.test(ext || "")) {
      setErrorMsg("Security Block: File format rejected! Only JPEG, JPG, PNG, and WEBP image formats are permitted.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Security Block: File size too large! Max image upload limit is 5MB.");
      return;
    }

    setImageFile(file);
    
    // Generate browser cache preview url
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  /**
   * Core form submission handler
   * 1. Safely uploads image to Express static upload endpoint
   * 2. Registers product metadata fields inside database via REST
   * 3. Explodes celebration confetti upon validation success
   */
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const token = session?.access_token;
    if (!token) {
      setErrorMsg("Security alert: Admin session expired. Please authenticate again.");
      return;
    }

    if (!imageFile) {
      setErrorMsg("Input Alert: Please drag or select a clothing product image.");
      return;
    }

    setSubmitting(true);

    try {
      // 1. Compress and convert picture locally to Base64 (persistent storage)
      setUploading(true);
      const imageUrl = await compressAndConvertToBase64(imageFile);
      setUploading(false);

      // 2. Format custom or selected category
      const activeCategory = useCustomCategory ? customCategory.trim() : category;
      if (!activeCategory) {
        throw new Error("Validation Error: Please select or write a category description.");
      }

      // 3. Register Product listing
      await createProduct({
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        category: activeCategory,
        image_url: imageUrl
      }, token);

      // Success micro-interaction: confetti blast!
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#E11D48", "#D97706", "#FAF9F6"]
      });

      setSuccessMsg("Product successfully published! Live on storefront now.");
      
      // Reset form variables
      setTitle("");
      setDescription("");
      setPrice("");
      setUseCustomCategory(false);
      setCustomCategory("");
      setImageFile(null);
      setImagePreview("");

      // Redirect back after brief moment
      setTimeout(() => {
        router.push("/admin");
      }, 2500);

    } catch (err: any) {
      setUploading(false);
      setErrorMsg(err.message || "Failed to publish product listing.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-brand-cream gap-4">
        <Loader2 className="w-10 h-10 text-brand-crimson animate-spin" />
        <span className="text-xs uppercase tracking-widest font-semibold text-brand-dark/70">
          Validating auth permission keys...
        </span>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="flex flex-col min-h-screen bg-brand-cream text-brand-dark">
      
      {/* Mini top navigator bar */}
      <div className="bg-brand-dark py-4 text-brand-cream border-b border-brand-gold/25">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link 
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs text-brand-cream/80 hover:text-brand-gold font-bold uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
          <span className="text-xs font-serif font-semibold tracking-wider text-brand-gold">
            AAKARSHAN PORTAL
          </span>
        </div>
      </div>

      {/* Main Form container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 flex-grow w-full">
        
        <div className="bg-brand-cream border border-brand-gold/35 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
          
          <div className="absolute top-6 right-6 text-brand-gold animate-pulse">
            <Sparkles className="w-5 h-5" />
          </div>

          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-dark tracking-wide">
              Publish New Garment
            </h1>
            <p className="text-xs text-brand-dark/70 mt-1">
              Add details, prices, and upload a beautiful boutique image to the public storefront catalog instantly.
            </p>
          </div>

          {/* Toast banners */}
          {errorMsg && (
            <div className="flex items-start gap-2.5 p-4 bg-brand-crimson/10 border border-brand-crimson/30 text-brand-crimson text-sm rounded-xl font-medium mb-6 animate-fadeIn">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="flex items-start gap-2.5 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-sm rounded-xl font-medium mb-6 animate-fadeIn">
              <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form Entry */}
          <form onSubmit={handleFormSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Form Details */}
              <div className="space-y-5">
                
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/80">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={80}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Elegant Handloom Zari Silk Saree"
                    className="w-full bg-brand-cream border border-brand-gold/25 focus:border-brand-crimson focus:ring-1 focus:ring-brand-crimson outline-none rounded-xl py-3 px-4 text-sm transition-all"
                  />
                </div>

                {/* Price (INR) */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/80">
                    Price in INR (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={1000000}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 5499"
                    className="w-full bg-brand-cream border border-brand-gold/25 focus:border-brand-crimson focus:ring-1 focus:ring-brand-crimson outline-none rounded-xl py-3 px-4 text-sm transition-all"
                  />
                </div>

                {/* Category selectors */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/80">
                      Product Category *
                    </label>
                    <button
                      type="button"
                      onClick={() => setUseCustomCategory(!useCustomCategory)}
                      className="text-[9px] text-brand-crimson hover:text-brand-gold uppercase tracking-wider font-bold"
                    >
                      {useCustomCategory ? "Select Predefined" : "Write Custom"}
                    </button>
                  </div>
                  
                  {useCustomCategory ? (
                    <input
                      type="text"
                      required
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="e.g. Banarasi Heritage"
                      className="w-full bg-brand-cream border border-brand-gold/25 focus:border-brand-crimson focus:ring-1 focus:ring-brand-crimson outline-none rounded-xl py-3 px-4 text-sm transition-all"
                    />
                  ) : (
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-brand-cream border border-brand-gold/25 focus:border-brand-crimson focus:ring-1 focus:ring-brand-crimson outline-none rounded-xl py-3 px-4 text-sm transition-all"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/80">
                    Product Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    maxLength={1000}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide premium details about fabric, embroidery work, style, sleeve options, length, and perfect occasions."
                    className="w-full bg-brand-cream border border-brand-gold/25 focus:border-brand-crimson focus:ring-1 focus:ring-brand-crimson outline-none rounded-xl py-3 px-4 text-sm transition-all resize-none"
                  />
                </div>

              </div>

              {/* Right Column: Drag and drop upload */}
              <div className="flex flex-col space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/80">
                  Clothing Photo Upload *
                </label>

                {/* Drag zone container */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("fileInput")?.click()}
                  className={`flex-grow border-2 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[250px] relative overflow-hidden bg-brand-gold/5 ${
                    dragging 
                      ? "border-brand-crimson bg-brand-crimson/5 scale-95" 
                      : imagePreview 
                        ? "border-brand-gold/45" 
                        : "border-brand-gold/25 hover:border-brand-crimson hover:bg-brand-crimson/5"
                  }`}
                >
                  
                  {/* File input invisible */}
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileChange(file);
                    }}
                  />

                  {imagePreview ? (
                    // Display cache preview
                    <div className="absolute inset-0 w-full h-full p-2 bg-brand-cream">
                      <div className="w-full h-full rounded-2xl overflow-hidden relative group">
                        <img
                          src={imagePreview}
                          alt="Product Preview"
                          className="w-full h-full object-cover"
                        />
                        {/* Overlay to remove */}
                        <div className="absolute inset-0 bg-brand-dark/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                          <span className="text-brand-cream font-bold text-xs uppercase tracking-wider">
                            Change Photo
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Upload instructions
                    <div className="space-y-4 flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full bg-brand-gold/15 flex items-center justify-center text-brand-gold">
                        <UploadCloud className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-brand-dark tracking-wide">
                          Drag & Drop or Click to Upload
                        </p>
                        <p className="text-[10px] text-brand-dark/60 mt-1 max-w-[200px] leading-relaxed mx-auto">
                          Supports JPEG, PNG, or WEBP high-resolution clothing photos (Max size 5MB)
                        </p>
                      </div>
                    </div>
                  )}

                </div>

                {imageFile && (
                  <div className="flex items-center gap-2 p-3 bg-brand-gold/10 border border-brand-gold/20 rounded-xl text-xs font-semibold text-brand-gold/90">
                    <FileImage className="w-4 h-4 shrink-0" />
                    <span className="line-clamp-1">{imageFile.name}</span>
                    <span className="text-[10px] shrink-0 ml-auto">
                      ({(imageFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  </div>
                )}

              </div>

            </div>

            {/* Submission triggers */}
            <div className="border-t border-brand-gold/15 pt-6 flex items-center justify-end gap-4">
              <Link
                href="/admin"
                className="px-6 py-3 border border-brand-gold/30 hover:bg-brand-dark hover:text-brand-cream text-brand-dark text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 bg-brand-crimson hover:bg-brand-gold text-brand-cream text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>
                      {uploading ? "Compressing picture..." : "Saving catalog..."}
                    </span>
                  </>
                ) : (
                  "Publish Product"
                )}
              </button>
            </div>

          </form>

        </div>

      </main>
    </div>
  );
}
