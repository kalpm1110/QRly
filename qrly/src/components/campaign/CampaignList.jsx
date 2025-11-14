"use client";
import React, { useState } from 'react';
import CreateQR from '../forms/CreateQR';
import { Button } from '../ui/button';
import CreateCambtn from './CreateCambtn';
import CreateQrbtn from '../buttons/CreateQrbtn';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase';

function CampaignList({ cam }) {
  const [camp, setCamp] = useState(cam);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const s = supabaseBrowser();
      const { error } = await s.from("campaigns").delete().eq("id", id);
      if (error) {
        console.log("Error", error);
        return;
      }
      setCamp((prev) => prev.filter((c) => c.id !== id));
      console.log("Deleted", id);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {camp.map((campaign) => (
          <div
            key={campaign.id}
            className="relative bg-[#E5E5CB] border border-[#3C2A21]/20 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 max-w-sm"
          >
            <button
              onClick={() => handleDelete(campaign.id)}
              disabled={loading}
              className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-red-100 transition-colors duration-200"
              aria-label="Delete Campaign"
            >
              <Trash2 className={`h-5 w-5 ${loading ? "text-red-300" : "text-red-500"}`} />
            </button>
            <h2 className="text-xl font-semibold text-[#1A120B] mb-3">{campaign.name}</h2>
            <p className="text-sm text-[#3C2A21] mb-4">
              Created: {campaign?.created_at
                ? new Date(campaign.created_at).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "N/A"}
            </p>
            <div className="flex gap-3">
              <Link href={`/${campaign.id}`}>
                <Button className="bg-[#1A120B] text-[#E5E5CB] hover:bg-[#3C2A21] hover:text-[#E5E5CB] transition-colors duration-300 rounded-md px-4 py-2">
                  View QR's
                </Button>
              </Link>
              <CreateQrbtn defaultcamid={campaign.id} defaultcamname={campaign.name} />
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 w-full max-w-md mx-auto">
        <CreateCambtn />
        <CreateQrbtn defaultcamid={null} defaultcamname={null} />
      </div>
    </div>
  );
}

export default CampaignList;