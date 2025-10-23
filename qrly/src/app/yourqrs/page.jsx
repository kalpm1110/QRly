import { currentUser } from "@clerk/nextjs/server";
import { QRList } from "@/components/QR/QRList";
import { supabaseServer } from "@/lib/supabase";

export default async function AllQrs() {
  const user = await currentUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-[#E5E5CB] flex items-center justify-center">
        <div className="bg-[#1A120B] text-[#E5E5CB] p-6 rounded-lg shadow-lg">
          <p className="text-lg">Please sign in to view your QR codes</p>
        </div>
      </div>
    );
  }
  const s = supabaseServer();
  const { data: qrs, error } = await s
    .from("qranalytics")
    .select("id, url, qr_id, total_scans, expire_at, campaign_id, target_url, title, user_id, max_scans")
    .eq("user_id", user.id);

  if (error) return <div>Error in fetching from DB</div>
  return (
    <div className="min-h-screen  p-6 max-w-7xl mx-auto">
      {/* <h1 className="text-3xl text-center font-bold text-[#1A120B] mb-6">Your QR Codes</h1> */}
      <QRList userid={user.id} initailData={qrs} />
    </div>
  );
}