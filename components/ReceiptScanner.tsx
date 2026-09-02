"use client";

import { useState, useRef } from "react";

interface ReceiptScannerProps {
  onScanComplete?: () => void;
}

export default function ReceiptScanner({ onScanComplete }: ReceiptScannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/scan-receipt", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setIsOpen(false);
        if (onScanComplete) onScanComplete();
        alert("Receipt processed! Transaction added.");
      } else {
        setError(data.error || "Failed to parse receipt image.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while uploading. Please try again.");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  return (
    <>
      {/* 1. Main On-Page Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="group relative overflow-hidden rounded-xl bg-[#082f6b] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-900/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#071f49] hover:shadow-lg hover:shadow-blue-900/30 active:scale-[0.98]"
      >
        <span className="flex items-center justify-center gap-2">
          <svg
            className="h-5 w-5 stroke-[#f6c343] fill-none transition-transform duration-300 group-hover:scale-110"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          Add Receipt
        </span>
      </button>

      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* 2. Modal Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => !loading && setIsOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95">
            
            {/* Header with Trident Logo */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#082f6b] shadow-md shadow-blue-900/15">
                  <svg
                    viewBox="0 0 40 40"
                    className="h-6 w-6 fill-none stroke-[#f6c343]"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 5v27" />
                    <path d="M12 11v8c0 5 3 8 8 8s8-3 8-8v-8" />
                    <path d="M8 11l4-5 4 5" />
                    <path d="M24 11l4-5 4 5" />
                    <path d="M16 8l4-5 4 5" />
                    <path d="M16 32h8" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold tracking-tight text-[#071f49]">
                    Scan Receipt
                  </h3>
                  <p className="text-xs text-slate-500">
                    Use your camera or upload a file
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                disabled={loading}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body / Actions */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-100 border-t-[#082f6b]" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-800">
                    Analyzing with AI...
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Extracting merchant, amount, date & category
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {error && (
                  <div className="rounded-xl bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-100 flex items-center gap-2">
                    <span className="text-base">⚠️</span>
                    {error}
                  </div>
                )}

                {/* Camera Option */}
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="group flex w-full items-center gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-all duration-200 hover:border-blue-400 hover:bg-white hover:shadow-md"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 text-xl transition group-hover:bg-[#082f6b] group-hover:text-white">
                    📷
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-slate-900 group-hover:text-blue-700">
                      Take Photo
                    </div>
                    <p className="text-xs text-slate-500">
                      Launch device camera directly
                    </p>
                  </div>
                </button>

                {/* File Upload Option */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="group flex w-full items-center gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-all duration-200 hover:border-blue-400 hover:bg-white hover:shadow-md"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-slate-200 text-xl transition group-hover:bg-[#082f6b] group-hover:text-white">
                    📁
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-slate-900 group-hover:text-blue-700">
                      Upload File
                    </div>
                    <p className="text-xs text-slate-500">
                      Choose an image from your device
                    </p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}