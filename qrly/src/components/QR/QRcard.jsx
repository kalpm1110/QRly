"use client";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Link as LinkIcon, Activity } from "lucide-react";
import QRCode from "react-qr-code";

export default function QRcard({ a }) {
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
  const statusText = isExpired ? "Expired" : "Active";

  return (
    <Card className="bg-[#E5E5CB] border-[#3C2A21]/20 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4">
      <CardHeader className="flex flex-col items-center space-y-3 pb-3">
        <div className="p-3 bg-[#D5CEA3] rounded-lg">
          <QRCode size={100} value={a?.url} fgColor="#1A120B" bgColor="transparent" />
        </div>
        <div className="flex items-center space-x-2 text-sm text-[#3C2A21]">
          <LinkIcon size={14} />
          <a
            href={a.url}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate max-w-[200px] hover:text-[#D5CEA3] transition-colors duration-200"
          >
            {a.url}
          </a>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1 text-[#3C2A21]">
            <Activity size={13} />
            Scans
          </span>
          <span className="font-semibold text-[#1A120B]">{a.total_scans ?? 0}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1 text-[#3C2A21]">
            <Calendar size={13} />
            Expiry
          </span>
          <span className="text-[#3C2A21]">{expiryDate ?? "—"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#3C2A21]">Status</span>
          <Badge
            className={`px-2 py-0.5 text-xs rounded-md ${
              isExpired
                ? "bg-[#3C2A21]/20 text-[#3C2A21]"
                : "bg-[#D5CEA3]/50 text-[#1A120B]"
            }`}
          >
            {statusText}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}