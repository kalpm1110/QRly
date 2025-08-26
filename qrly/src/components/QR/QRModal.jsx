"use client"
import React, { useRef } from 'react'
import { Dialog, DialogHeader, DialogContent } from '../ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog'
import QRCode from 'react-qr-code'
import { Copy, Download, QrCode } from 'lucide-react'
import { Button } from '../ui/button'

function QRModal({ open, onClose, link }) {

  const qrref = useRef();
  const handleCopy = () => {
    navigator.clipboard.writeText(link);
  }
  const handleDownload = () => {
    // const svg = qrref.current.querySelector("svg");
    if (!qrref.current) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(qrref.current);
    // const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    // const url = URL.createObjectURL(blob);

    // const a = document.createElement("a");
    // a.href = url;
    // a.download = "qr-code.svg";
    // a.click();
    // URL.revokeObjectURL(url);

    const img=new Image();
    img.src="data:image/svg+xml;base64,"+btoa(source);
    
    img.onload=()=>{
      const canvas=document.createElement("canvas");
      const size=256;
      canvas.width=size;
      canvas.height=size;
      const ctx=canvas.getContext("2d");
      ctx.fillStyle="#fff";
      ctx.fillRect(0,0,size,size);
      ctx.drawImage(img,0,0,size,size);

      const pnguri=canvas.toDataURL("image/png");
      const a=document.createElement("a");
      a.href=pnguri;
      a.download="QR-Code.png";
      a.click();
    };

  }
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-6 rounded-2xl shadow-lg max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">Scan OR Share this QR <QrCode size={16}></QrCode></DialogTitle>
        </DialogHeader>
        <div className="flex justify-center p-4 bg-gray-50 rounded-xl">
          <QRCode ref={qrref} value={link} size={200} className='rounded-xl'></QRCode>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <input className="flex-1 px-3 py-2 border rounded-md text-sm bg-gray-100" type="text" value={link} readOnly />
          <Button variant="outline" onClick={handleCopy} ><Copy className="h-4 w-4"></Copy></Button>
        </div>
        <div className="flex justify-between mt-6">
          <Button onClick={handleDownload}><Download className="h-4 w-4 mr-2"></Download></Button>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>

    </Dialog>

  )
}

export default QRModal;
