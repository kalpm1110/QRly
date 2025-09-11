import { currentUser } from "@clerk/nextjs/server";
import CampaignList from "@/components/campaign/CampaignList";
import { supabaseServer } from "@/lib/supabase";

export default async function DashBoard() {
  const user = await currentUser();
  if (!user) {
    return (
      <div className="min-h-screen bg-[#E5E5CB] flex items-center justify-center">
        <div className="bg-[#1A120B] text-[#E5E5CB] p-6 rounded-lg shadow-lg">
          <p className="text-lg">Please sign in to access the dashboard</p>
        </div>
      </div>
    );
  }

  const supabase = supabaseServer();

  const { data: cam } = await supabase
    .from("campaigns")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  const { data: onlyqrs } = await supabase
    .from("qrs")
    .select("*")
    .eq("owner_id", user.id)
    .is("campaign_id", null)
    .order("created_at", { ascending: false });
  console.log(user.id);

  return (
    <div className="min-h-screen bg-[#E5E5CB] p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-[#1A120B] mb-6">
        Welcome, {user.firstName}!
      </h1>
      <CampaignList cam={cam || []} onlyqrs={onlyqrs || []} />
    </div>
  );
}
