"use client";
import React, { useRef } from 'react';
import { Dialog, DialogHeader, DialogContent } from '../ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import QRCode from 'react-qr-code';
import { Copy, Download, QrCode } from 'lucide-react';
import { Button } from '../ui/button';

function QRModal({ open, onClose, link }) {
  const qrref = useRef();

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
  };

  const handleDownload = () => {
    if (!qrref.current) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(qrref.current);
    const img = new Image();
    img.src = "data:image/svg+xml;base64," + btoa(source);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const size = 256;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#E5E5CB";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      const pnguri = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pnguri;
      a.download = "QR-Code.png";
      a.click();
    };
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-6 rounded-xl shadow-lg max-w-md bg-[#E5E5CB]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[#1A120B] text-center">
            Scan or Share this QR <QrCode size={16} className="inline-block ml-2" />
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-center p-4 bg-[#D5CEA3] rounded-xl">
          <QRCode ref={qrref} value={link} size={200} fgColor="#1A120B" bgColor="transparent" className="rounded-xl" />
        </div>
        <div className="flex items-center gap-2 mt-4">
          <input
            className="flex-1 px-3 py-2 border border-[#3C2A21]/20 rounded-lg bg-[#E5E5CB] text-[#1A120B] text-sm focus:border-[#3C2A21] focus:ring-[#D5CEA3]"
            type="text"
            value={link}
            readOnly
          />
          <Button
            variant="outline"
            onClick={handleCopy}
            className="border-[#3C2A21]/20 text-[#1A120B] hover:bg-[#D5CEA3]"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-between mt-6">
          <Button
            onClick={handleDownload}
            className="bg-[#1A120B] text-[#E5E5CB] hover:bg-[#3C2A21] transition-colors duration-300"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button
            variant="secondary"
            onClick={onClose}
            className="bg-[#D5CEA3] text-[#1A120B] hover:bg-[#3C2A21] hover:text-[#E5E5CB] transition-colors duration-300"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default QRModal;