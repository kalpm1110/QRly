
import { currentUser } from '@clerk/nextjs/server';
import { supabaseServer } from '@/lib/supabase';
import React from 'react'
import QRList from '@/components/QR/QRList';

export default async function CamQR({ params }) {
  const user = await currentUser();
  const { camid } = await params;
  console.log(camid);

  const supabase = supabaseServer();
  const { data: qrs, error } = await supabase
    .from("qrs")
    .select("*")
    .eq("campaign_id", camid)
    .eq("owner_id", user.id);

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      CamQr for the {camid}!
      <QRList qrs={qrs}></QRList>
    </div>
  )
}
