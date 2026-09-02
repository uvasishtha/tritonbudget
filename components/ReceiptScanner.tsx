"use client";
import { useState } from "react";

export default function ReceiptScanner({ onScanComplete }: { onScanComplete?: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/scan-receipt", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        if (onScanComplete) onScanComplete();
        alert("Receipt scanned and transaction added!");
      } else {
        alert("Failed to parse receipt photo.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2">
        <span>📷 {loading ? "Analyzing Photo..." : "Scan or Upload Receipt"}</span>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileUpload}
          disabled={loading}
          className="hidden"
        />
      </label>
    </div>
  );
}