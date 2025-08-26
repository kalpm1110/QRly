

import React from 'react'

export default async function CamQR(searchParams) {

  const { camid } = await searchParams.params;
  console.log(camid);
  return (
    <div>
      CamQr for the {camid}!
    </div>
  )
}
