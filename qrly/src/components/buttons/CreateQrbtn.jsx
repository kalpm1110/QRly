import React from 'react';
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from '../ui/button';
import CreateQR from '../forms/CreateQR';

function CreateQrbtn({ defaultcamid,defaultcamname }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button className="bg-[#1A120B] text-[#E5E5CB] hover:bg-[#3C2A21] transition-colors duration-300">
          Generate QR
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-[#1A120B]/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 bg-[#E5E5CB] p-6 rounded-xl shadow-lg">
          <Dialog.Title className="text-xl font-semibold text-[#1A120B] mb-4">New QR</Dialog.Title>
          <CreateQR defaultCampaignId={defaultcamid} defaultcamname={defaultcamname} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default CreateQrbtn;