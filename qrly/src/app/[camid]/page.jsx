import { currentUser } from '@clerk/nextjs/server';
import { QRList } from '@/components/QR/QRList';
import { supabaseServer } from '@/lib/supabase';


export async function generateStaticParams(){
  const s=supabaseServer();
  const {data,error}=await s.from("campaigns").select("id");
  return data.map((cam)=>({camid:cam.id.toString()}));
}


export async function generateMetadata({ params }) {
  const { camid } = params;

  const s = supabaseServer();
  const { data, error } = await s
    .from("qranalytics")
    .select("camname")
    .eq("campaign_id", camid)
    .limit(1)
    .single();   // ensures you get an object instead of array

  const camname = data?.camname=="NULL"?"Campaign":data?.camname;

  return {
    title: camname,
    description: `All the QRs for ${camname}.`
  };
}

export default async function CamQR({ params }) {
  
  const { camid } = params;

 

  const s = supabaseServer();
  const { data: qrs, error } = await s
    .from("qranalytics")
    .select(
      "id, url, qr_id, total_scans, expire_at, campaign_id, target_url, title, user_id, max_scans"
    )
    .eq("campaign_id", camid);

  if (error) return <div>Error fetching data from Supabase</div>;
  // console.log(qrs);
  return (
    <div className="min-h-screen bg-[#E5E5CB] p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl text-center font-bold text-[#1A120B] mb-6">
        QR Codes for Campaign
      </h1>
      <QRList camid={camid} initialData={qrs} />
    </div>
  );
}
