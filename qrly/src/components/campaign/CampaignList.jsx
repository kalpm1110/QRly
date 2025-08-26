"use client";

import React from 'react'
import CreateQR from '../forms/CreateQR';
import { Button } from '../ui/button';
import CreateCambtn from './CreateCambtn';
import CreateQrbtn from '../buttons/CreateQrbtn';

function CampaignList({ cam }) {
  const handleNewQR = (qr) => {
    // Refresh QR list or show toast
    console.log("New QR created:", qr);
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cam.map((campaign) => (
        <div key={campaign.id} className="p-4 border rounded-lg shadow-sm bg-white">
          <h2 className="text-lg font-bold mb-2">{campaign.name}</h2>
          <p>Created at: {new Date(campaign.created_at).toLocaleDateString()}</p>
          <div className='flex align-middle gap-3 mt-2'>

          <Button>View QR's</Button>
          {/* Button to generate QR for this campaign */}
          <CreateQrbtn defaultcamid={campaign.id}></CreateQrbtn>
          </div>
        </div>
      ))}
      <CreateCambtn></CreateCambtn>
    </div>
  )
}

export default CampaignList
