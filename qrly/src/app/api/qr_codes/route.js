import { hashpass } from "@/lib/hashpass";
import redis from "@/lib/redis";
import { genslug } from "@/lib/slug";
import { supabaseServer } from "@/lib/supabase";

export async function POST(req) {
  try {
    const body = await req.json();
    const s = supabaseServer();

    // Generate unique slug
    let slug = genslug(7);
    for (let i = 0; i < 5; i++) {
      const { data: existing } = await s.from("qrs").select("id").eq("slug", slug).maybeSingle();
      if (!existing) break;
      slug = genslug(7);
    }


    const hpass = body.reqpass ? hashpass(body.password) : null;

    const insertLoad = {
      title: body.title,
      owner_id: body.owner_id,
      slug,
      campaign_id: body.campaign_id || null,
      url: body.url,
      max_scans: body.max_scans,
      password: hpass,
      expires_at: body.expires_at ?? null,
    };


    const { data, error } = await s.from("qrs").insert(insertLoad).select("*").single();
    if (error) return Response.json({ error: error.message }, { status: 400 });
    const shortUrl = `${process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? ""}/r/${slug}`;
    await s.from("qranalytics").insert([
      {
        qr_id: data.id,
        total_scans: 0,
        user_id: data.owner_id,
        title: data.title,
        campaign_id: data.campaign_id ?? null,
        url: shortUrl,
        expire_at: data.expires_at ?? null,
      },
    ]);
    const ttlSec = data.expires_at
      ? Math.floor((new Date(data.expires_at).getTime() - Date.now()) / 1000)
      : null;

    if (ttlSec && ttlSec > 0) {
      await redis.set(`qr:${data.slug}:aval`, 1, { EX: ttlSec });
    } else {
      await redis.set(`qr:${data.slug}:aval`, 1); // no expiry
    }
    await redis.set(`qr:${data.slug}:scans`, 0);

    await redis.set(`qr:${data.slug}:url`, data.url);
    await redis.set(`qr:${data.slug}:max_scans`, Number(data.max_scans));
    await redis.set(`qr:${data.slug}:id`, data.id);



    return Response.json({ qr: data, short_url: shortUrl });
  } catch (err) {
    console.error("Error creating QR:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}