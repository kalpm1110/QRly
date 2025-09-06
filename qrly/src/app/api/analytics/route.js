
import { supabaseServer } from "@/lib/supabase";
import redis from "@/lib/redis";

export async function GET(req) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");      // optional
  const campaignId = url.searchParams.get("campaignId"); // optional
  const supabase = supabaseServer();

  let query = supabase.from("qrs").select("id, slug, url, campaign_id");

  if (userId) query = query.eq("owner_id", userId);
  if (campaignId) query = query.eq("campaign_id", campaignId);

  const { data: qrs, error } = await query;

  if (error) return Response.json({ error: error.message }, { status: 500 });

  const analytics = {};
  for (const qr of qrs) {
    const scans = await redis.get(`qr:${qr.slug}:scans`);
    const isActive = await redis.get(`qr:${qr.slug}:aval`);
    analytics[qr.id] = {
      scans: scans ? Number(scans) : 0,
      is_active: Boolean(isActive),
      url: qr.url,
      slug: qr.slug,
      campaign_id: qr.campaign_id,
    };
  }

  return Response.json({ analytics });
}