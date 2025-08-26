import React from 'react'
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from '../ui/button'
import CreateCam from '../forms/CreateCam';

function CreateCambtn() {
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <Button variant='default'>Create New Campaign</Button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                <Dialog.Content className="fixed top-1/2 left-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
                    <Dialog.Title className="text-lg font-bold mb-4">New Campaign</Dialog.Title>
                    <CreateCam/>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

export default CreateCambtn;
