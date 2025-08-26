
"use client"
import React, { useState } from 'react'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from '@clerk/nextjs';

export default function CreateQR({ defaultCampaignId = null }) {
  const { user } = useUser();
  const [reqpass, setreqpass] = useState(false);
  const [title, setTitle] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [campaignId, setCampaignId] = useState(defaultCampaignId);
  const [password, setPassword] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  // const [maxScans, setMaxScans] = useState("");
  const [shortUrl, setShortUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleSubmit=async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload={
      title,
      owner_id:user.id,
      campaign_id:defaultCampaignId || null,
      reqpass,
      url:targetUrl,
      password:reqpass?password:undefined,
      expires_at:expiresAt?new Date(expiresAt).toISOString():undefined,
    }
    const res=await fetch("/api/qr_codes",{
      method:"POST",
      headers:{"Content-type":"application/json"},
      body:JSON.stringify(payload)
    });
    const result=await res.json();
    setLoading(false);
    console.log(result);
    if(!res.ok){
      console.log("Error!!!")
      return alert(result.error || "Failed");
    }
  }
  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div>
          <Label>Destination URL</Label>
          <Input type="url" value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} required placeholder="https://example.com" />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="pw" checked={reqpass} onCheckedChange={(v) => setreqpass(Boolean(v))} />
          <Label htmlFor="pw">Password protect</Label>
        </div>

        {reqpass && (
          <div>
            <Label>Password</Label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <Label>Expires at (optional)</Label>
            <Input type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
          </div>
          {/* <div>
            <Label>Max scans (optional)</Label>
            <Input type="number" min={1} value={maxScans} onChange={(e) => setMaxScans(e.target.value)} />
          </div> */}
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creating..." : "Create Dynamic QR"}
        </Button>
      </form>

      {shortUrl && (
        <div className="mt-3 p-3 border rounded">
          <p className="text-sm mb-2">Short URL</p>
          <a href={shortUrl} target="_blank" rel="noreferrer" className="underline break-all">{shortUrl}</a>

          <div className="mt-4 flex justify-center">
            {/* <QRCode value={shortUrl} size={200} /> */}
          </div>
        </div>
      )}
    </div>
  )
}


