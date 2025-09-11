import React, { useState } from 'react';
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from '../ui/button';
import { Edit } from 'lucide-react';
import EditQR from '../forms/EditQR';

function EditQrbtn({ qrData, onUpdate }) {
  const [open, setOpen] = useState(false);

  const handleUpdate = (updatedQR) => {
    onUpdate(updatedQR);
    setOpen(false); 
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button 
          size="sm"
          variant="outline"
          className="p-2 rounded-full bg-[#D5CEA3] text-[#1A120B] hover:bg-[#3C2A21] hover:text-[#E5E5CB] transition-colors duration-300 border-[#3C2A21]/30"
          aria-label="Edit QR Code"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-[#1A120B]/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 bg-[#E5E5CB] p-6 rounded-xl shadow-lg">
          <Dialog.Title className="text-xl font-semibold text-[#1A120B] mb-4">Edit QR</Dialog.Title>
          <EditQR qrData={qrData} onUpdate={handleUpdate} onClose={handleClose} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default EditQrbtn;

