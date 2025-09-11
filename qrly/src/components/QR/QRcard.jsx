"use client";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Link as LinkIcon, Activity, QrCode, Download, Trash2, Edit, MoreVertical } from "lucide-react";
import QRCode from "react-qr-code";
import { Button } from "../ui/button";
import { useRef, useState } from "react";
import EditQrbtn from "../buttons/EditQrbtn";

export default function QRcard({ a, onDelete, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const qrref = useRef();
  const expiryDate = a.expire_at
    ? new Date(a.expire_at).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    : null;

  const isExpired = a.expire_at ? new Date(a.expire_at) < new Date() : false;
  const islimit = a.max_scans !== -1 ? a.total_scans >= a.max_scans : false;
  const exptext = islimit ? "Max Scans!" : ""
  const statusText = isExpired ? "Expired" : "Active";
  const handleDownload = () => {
    if (!qrref.current) return;
    const svg = qrref.current.querySelector("svg");
    if (!svg) return;

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);

    const img = new Image();
    img.src = "data:image/svg+xml;base64," + btoa(source);

    img.onload = () => {
      const qrSize = 200;
      const padding = 20;
      const totalSize = qrSize + padding * 2;

      const canvas = document.createElement("canvas");
      canvas.width = totalSize;
      canvas.height = totalSize;
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = "#E5E5CB";
      ctx.fillRect(0, 0, totalSize, totalSize);

      ctx.drawImage(img, padding, padding, qrSize, qrSize);

      const pnguri = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pnguri;
      a.download = "QR-Code.png";
      a.click();
    };
  };


  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/qr_codes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          qrId: a.qr_id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        onDelete(a.qr_id);
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete QR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="relative bg-[#E5E5CB] border-[#3C2A21]/20 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 max-w-xs group">
      {/* Action buttons in top right */}
      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="p-2 rounded-full hover:bg-red-100 transition-colors duration-200"
          aria-label="Delete QR Code"
        >
          <Trash2 className={`h-4 w-4 ${loading ? "text-red-300" : "text-red-500"}`} />
        </button>
      </div>

      {/* Edit button in top left */}
      <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <EditQrbtn qrData={a} onUpdate={onUpdate} />
      </div>


      <CardHeader className="flex flex-col items-center space-y-4 pb-2 pt-8">
        <div className="flex items-center gap-2 text-[#3C2A21] font-semibold text-lg text-center px-8">
          <QrCode size={20} className="text-[#1A120B] flex-shrink-0" />
          <span className="truncate" title={a?.title}>
            {a?.title}
          </span>
        </div>
        <div className="p-4 bg-[#D5CEA3] rounded-lg shadow-inner" ref={qrref}>
          <QRCode size={120} value={a?.url} fgColor="#1A120B" bgColor="transparent" />
        </div>
        <div className="flex items-center justify-center space-x-3 text-sm text-[#3C2A21]">
          <LinkIcon size={16} />
          <a
            href={a.target_url}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate max-w-[180px] hover:text-[#1A120B] transition-colors duration-200 underline"
          >
            {a.target_url}
          </a>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1.5 text-[#3C2A21]">
            <Activity size={14} />
            Scans
          </span>
          <span className="font-semibold text-[#1A120B]">{a.total_scans ?? 0}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1.5 text-[#3C2A21]">
            <Calendar size={14} />
            Expiry
          </span>
          <span className="text-[#3C2A21]">{expiryDate ?? "—"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#3C2A21] font-medium">Status</span>
          <div className="flex gap-2 align-middle">

            <Badge
              className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${isExpired ? "bg-[#3C2A21]/20 text-[#3C2A21]" : "bg-[#D5CEA3] text-[#1A120B]"
                }`}
            >
              {statusText}
            </Badge>
            {islimit ? <Badge className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${isExpired ? "bg-[#3C2A21]/20 text-[#3C2A21]" : "bg-[#D5CEA3] text-[#1A120B]"
              }`} >{exptext}</Badge> : ""}
          </div>
        </div>
        {!isExpired && (
          <Button
            onClick={handleDownload}
            className="w-full mt-3 bg-[#D5CEA3] text-[#1A120B] hover:bg-[#3C2A21] hover:text-[#E5E5CB] transition-colors duration-200 rounded-md py-2"
            disabled={loading}
          >
            <Download className="h-4 w-4 mr-2" />
            Download QR
          </Button>
        )}
      </CardContent>
    </Card>
  );
}