"use client";
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from '@clerk/nextjs';
import QRModal from '../QR/QRModal';

export default function CreateQR({ defaultCampaignId = null }) {
  const { user } = useUser();
  const [title, setTitle] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [campaignId, setCampaignId] = useState(defaultCampaignId);
  const [expiresAt, setExpiresAt] = useState("");
  const [maxScans, setMaxScans] = useState(-1);
  const [shortUrl, setShortUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalopn, setmodalopn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      title,
      owner_id: user.id,
      campaign_id: defaultCampaignId || null,
      max_scans: maxScans || 0,
      url: targetUrl,
      expires_at: expiresAt ? new Date(expiresAt).toISOString() : undefined,
    };
    const res = await fetch("/api/qr_codes", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    setLoading(false);
    if (!res.ok) {
      console.log("Error!!!");
      return alert(result.error || "Failed");
    }
    setmodalopn(true);
    setShortUrl(result.short_url);
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
              onChange={(e) => setExpiresAt(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
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
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1A120B] text-[#E5E5CB] hover:bg-[#3C2A21] transition-colors duration-300"
        >
          {loading ? "Creating..." : "Create Dynamic QR"}
        </Button>
      </form>
      {shortUrl && (
        <QRModal open={modalopn} onClose={() => setmodalopn(false)} link={shortUrl} />
      )}
    </div>
  );
}