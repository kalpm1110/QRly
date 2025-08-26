import { supabaseServer } from "@/lib/supabase"; // server-only client
import { currentUser } from "@clerk/nextjs/server";
import CampaignList from "@/components/campaign/CampaignList";

export default async function DashBoard() {
  const user = await currentUser();
  if (!user) return <div>Please sign in</div>;

  // Check if Supabase is properly configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Configuration Required</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">Supabase Setup Required</h2>
          <p className="text-yellow-700 mb-4">
            To use the dashboard, you need to configure your Supabase credentials.
          </p>
          <div className="bg-white p-4 rounded border">
            <h3 className="font-semibold mb-2">Steps to fix:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Create a <code className="bg-gray-100 px-1 rounded">.env.local</code> file in your project root</li>
              <li>Add your Supabase credentials:</li>
            </ol>
            <pre className="bg-gray-100 p-3 rounded mt-2 text-xs overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key`}
            </pre>
            <p className="text-sm text-gray-600 mt-2">
              You can find these values in your Supabase project dashboard under Settings → API.
            </p>
          </div>
        </div>
      </div>
    );
  }

  try {
    const { data: cam, error } = await supabaseServer
      .from("campaigns")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Welcome, {user.firstName}!</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">Error fetching campaigns: {error.message}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Welcome, {user.firstName}!</h1>
        <CampaignList cam={cam || []} />
      </div>
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user.firstName}!</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">An unexpected error occurred. Please try again later.</p>
        </div>
      </div>
    );
  }
}
