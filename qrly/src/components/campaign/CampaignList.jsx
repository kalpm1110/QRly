"use client";
import React from 'react';
import CreateQR from '../forms/CreateQR';
import { Button } from '../ui/button';
import CreateCambtn from './CreateCambtn';
import CreateQrbtn from '../buttons/CreateQrbtn';
import Link from 'next/link';

function CampaignList({ cam }) {
  return (
    <div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cam.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-[#E5E5CB] border border-[#3C2A21]/20 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold text-[#1A120B] mb-3">{campaign.name}</h2>
            <p className="text-sm text-[#3C2A21] mb-4">
              Created: {campaign?.created_at
                ? new Date(campaign.created_at).toLocaleDateString("en-IN")
                : "N/A"}

            </p>
            <div className="flex gap-3">
              <Link href={`/${campaign.id}`}>
                <Button className="bg-[#1A120B] text-[#E5E5CB] hover:bg-[#3C2A21] transition-colors duration-300">
                  View QR's
                </Button>
              </Link>
              <CreateQrbtn defaultcamid={campaign.id} />
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-row sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-6 w-full max-w-md mx-auto sm:max-w-lg">
        <div>
          <CreateCambtn />
        </div>
        <div >
          <CreateQrbtn defaultcamid={null} />
        </div>
      </div>
    </div>
  );
}

export default CampaignList;