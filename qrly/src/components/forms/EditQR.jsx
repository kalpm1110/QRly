"use client";
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useUser } from '@clerk/nextjs';

export default function EditQR({ qrData, onUpdate, onClose }) {
  const { user } = useUser();
  const [title, setTitle] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [maxScans, setMaxScans] = useState(qrData.max_scans);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (qrData) {
      setTitle(qrData.title || "");
      setTargetUrl(qrData.target_url || "");
      setMaxScans(qrData.max_scans || -1);

      if (qrData.expire_at) {
        const date = new Date(qrData.expire_at);
        const localDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        setExpiresAt(localDateTime.toISOString().slice(0, 16));
      } else {
        setExpiresAt("");
      }
    }
  }, [qrData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      qrId: qrData.qr_id,
      title,
      max_scans: maxScans || 0,
      total_scans:qrData.total_scans,
      campaign_id:qrData.campaign_id,
      url: targetUrl,
      expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
    };
    console.log(payload);

    try {
      const res = await fetch("/api/qr_codes", {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const result = await res.json();
      
      if (!res.ok) {
        alert(result.error || "Failed to update QR");
        return;
      }

      onUpdate(result.updatedQR);
      
      setTitle(qrData.title || "");
      setTargetUrl(qrData.target_url || "");
      setMaxScans(qrData.max_scans || -1);
      if (qrData.expire_at) {
        const date = new Date(qrData.expire_at);
        const localDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        setExpiresAt(localDateTime.toISOString().slice(0, 16));
      } else {
        setExpiresAt("");
      }
    } catch (error) {
      console.error("Error updating QR:", error);
      alert("Failed to update QR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="text-[#1A120B] font-medium">Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="bg-[#E5E5CB] border-[#3C2A21]/20 focus:border-[#3C2A21] focus:ring-[#D5CEA3]"
          />
        </div>
        <div>
          <Label className="text-[#1A120B] font-medium">Destination URL</Label>
          <Input
            type="url"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            required
            placeholder="https://example.com"
            className="bg-[#E5E5CB] border-[#3C2A21]/20 focus:border-[#3C2A21] focus:ring-[#D5CEA3]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-[#1A120B] font-medium">Expires at (optional)</Label>
            <Input
              type="datetime-local"
              value={expiresAt}
              min={new Date().toISOString().slice(0, 16)}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="bg-[#E5E5CB] border-[#3C2A21]/20 focus:border-[#3C2A21] focus:ring-[#D5CEA3]"
            />
          </div>
          <div>
            <Label className="text-[#1A120B] font-medium">Max scans</Label>
            <Input
              type="number"
              placeholder="-1 for No Limit"
              value={maxScans}
              onChange={(e) => setMaxScans(e.target.value)}
              className="bg-[#E5E5CB] border-[#3C2A21]/20 focus:border-[#3C2A21] focus:ring-[#D5CEA3]"
            />
          </div>
          <p className="font-bold col-span-1 sm:col-span-2 text-center text-[#1A120B] text-xs opacity-80 mt-1">* -1 for No Scans Limit</p>
        </div>
        
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            disabled={loading}
            className="flex-1 bg-[#D5CEA3] text-[#1A120B] hover:bg-[#3C2A21] hover:text-[#E5E5CB] transition-colors duration-300 border-[#3C2A21]/30"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#1A120B] text-[#E5E5CB] hover:bg-[#3C2A21] transition-colors duration-300 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-[#E5E5CB] border-t-transparent rounded-full animate-spin"></div>
                Updating...
              </div>
            ) : (
              "Update QR"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

