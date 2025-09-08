"use client";
import React, { useRef } from 'react';
import { Dialog, DialogHeader, DialogContent } from '../ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import QRCode from 'react-qr-code';
import { Copy, Download, QrCode } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

function QRModal({ open, onClose, link }) {
  const qrref = useRef();

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
  };

  const handleDownload = () => {
    if (!qrref.current) return;
    const svg = qrref.current.querySelector("svg");
    if (!svg) return;

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);

    const img = new Image();
    img.src = "data:image/svg+xml;base64," + btoa(source);

    img.onload = () => {
      const qrSize = 160;
      const padding = 16;
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-4 rounded-xl shadow-xl max-w-[90%] sm:max-w-sm bg-[#E5E5CB] transition-all duration-300">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium text-[#1A120B] text-center flex items-center justify-center gap-1">
            Scan or Share QR <QrCode size={16} className="inline-block text-[#3C2A21] animate-pulse" />
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-center p-4 bg-[#D5CEA3] rounded-lg mt-3 shadow-inner" ref={qrref}>
          <QRCode 
            value={link} 
            size={160} 
            fgColor="#1A120B" 
            bgColor="transparent" 
            className="rounded-lg transform hover:scale-105 transition-transform duration-200" 
          />
        </div>
        <div className="flex items-center align-middle gap-2 mt-3">
          <div className="flex-1">
            <Label className="text-[#1A120B] font-medium text-xs mb-1 block">Shareable Link</Label>
            <input
              className="w-full px-3 py-1.5 border border-[#3C2A21]/30 rounded-lg bg-[#E5E5CB] text-[#1A120B] text-md focus:border-[#3C2A21] focus:ring-2 focus:ring-[#D5CEA3] focus:outline-none transition-all duration-200"
              type="text"
              value={link}
              readOnly
            />
          </div>
          <Button
            variant="outline"
            onClick={handleCopy}
            className="border-[#3C2A21]/30 text-[#E5E5CB] bg-[#1A120B] hover:bg-[#3C2A21] hover:text-[#E5E5CB] transition-colors duration-300 p-2.5"
            aria-label="Copy link"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-between mt-4 gap-3">
          <Button
            onClick={handleDownload}
            className="flex-1 bg-[#1A120B] text-[#E5E5CB] hover:bg-[#3C2A21] transition-colors duration-300 rounded-lg py-1.5 text-sm flex items-center justify-center gap-1"
            aria-label="Download QR code"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1 bg-[#D5CEA3] text-[#1A120B] hover:bg-[#3C2A21] hover:text-[#E5E5CB] transition-colors duration-300 rounded-lg py-1.5 text-sm"
            aria-label="Close modal"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default QRModal;