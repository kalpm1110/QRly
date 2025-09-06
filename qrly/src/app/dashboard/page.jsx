import { currentUser } from "@clerk/nextjs/server";
import CampaignList from "@/components/campaign/CampaignList";
import { supabaseServer } from "@/lib/supabase";

export default async function DashBoard() {
  const user = await currentUser();
  if (!user) return (
    <div className="min-h-screen bg-[#E5E5CB] flex items-center justify-center">
      <div className="bg-[#1A120B] text-[#E5E5CB] p-6 rounded-lg shadow-lg">
        <p className="text-lg">Please sign in to access the dashboard</p>
      </div>
    </div>
  );

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return (
      <div className="min-h-screen bg-[#E5E5CB] p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1A120B] mb-6">Configuration Required</h1>
        <div className="bg-[#D5CEA3] border border-[#3C2A21] rounded-lg p-6 mb-6 shadow-md">
          <h2 className="text-xl font-semibold text-[#1A120B] mb-3">Supabase Setup Required</h2>
          <p className="text-[#3C2A21] mb-4">
            To use the dashboard, you need to configure your Supabase credentials.
          </p>
          <div className="bg-[#E5E5CB] p-4 rounded-lg border border-[#3C2A21]">
            <h3 className="font-semibold text-[#1A120B] mb-3">Steps to fix:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-[#3C2A21]">
              <li>Create a <code className="bg-[#3C2A21]/10 px-1 rounded">.env.local</code> file in your project root</li>
              <li>Add your Supabase credentials:</li>
            </ol>
            <pre className="bg-[#3C2A21]/10 p-3 rounded mt-3 text-sm text-[#1A120B] font-mono">
              {`NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key`}
            </pre>
            <p className="text-sm text-[#3C2A21] mt-3">
              You can find these values in your Supabase project dashboard under Settings → API.
            </p>
          </div>
        </div>
      </div>
    );
  }

  try {
    const supabase = supabaseServer();

    const { data: cam, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    const { data: onlyqrs, err } = await supabase
      .from("qrs")
      .select("*")
      .eq("owner_id", user.id)
      .is("campaign_id", null)
      .order("created_at", { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return (
        <div className="min-h-screen bg-[#E5E5CB] p-6 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-[#1A120B] mb-6">Welcome, {user.firstName}!</h1>
          <div className="bg-[#D5CEA3] border border-[#3C2A21] rounded-lg p-6 shadow-md">
            <p className="text-[#3C2A21]">Error fetching campaigns: {error.message}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#E5E5CB] p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1A120B] mb-6">Welcome, {user.firstName}!</h1>
        <CampaignList cam={cam || []} onlyqrs={onlyqrs || []} />
      </div>
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return (
      <div className="min-h-screen bg-[#E5E5CB] p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1A120B] mb-6">Welcome, {user.firstName}!</h1>
        <div className="bg-[#D5CEA3] border border-[#3C2A21] rounded-lg p-6 shadow-md">
          <p className="text-[#3C2A21]">An unexpected error occurred. Please try again later.</p>
        </div>
      </div>
    );
  }
}