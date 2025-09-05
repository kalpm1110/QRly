
import { currentUser } from '@clerk/nextjs/server';

import React from 'react'
import { QRList } from '@/components/QR/QRList';


export default async function CamQR({ params }) {
  const user = await currentUser();
  const { camid } = await params;
  console.log(camid);

  return (
    <div>
      CamQr for the {camid}!
      <QRList camid={camid} userid={user.id}></QRList>
    </div>
  )
}
