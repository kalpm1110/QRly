
import redis from "@/lib/redis";
import { genslug } from "@/lib/slug";
import { supabaseServer } from "@/lib/supabase";

export async function POST(req) {
  try {
    const body = await req.json();
    const s = supabaseServer();
    let slug = genslug(7);
    for (let i = 0; i < 5; i++) {
      const { data: existing } = await s.from("qrs").select("id").eq("slug", slug).maybeSingle();
      if (!existing) break;
      slug = genslug(7);
    }

    const insertLoad = {
      title: body.title,
      owner_id: body.owner_id,
      slug,
      campaign_id: body.campaign_id || null,
      url: body.url,
      max_scans: body.max_scans,
      expires_at: body.expires_at,
    };


    const { data, error } = await s.from("qrs").insert(insertLoad).select("*").single();
    if (error) return Response.json({ error: error.message }, { status: 400 });
    const shortUrl = `${process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? ""}/r/${slug}`;
    const { data: d, error: err } = await s.from("qranalytics").insert([
      {
        qr_id: data.id,
        total_scans: 0,
        user_id: data.owner_id,
        title: data.title,
        campaign_id: data.campaign_id ?? null,
        url: shortUrl,
        target_url: data.url,
        expire_at: data.expires_at,
      },
    ]);
    if (err) return Response.json({ msg: err.message });
    const ttlSec = data.expires_at
      ? Math.floor((new Date(data.expires_at).getTime() - Date.now()) / 1000)
      : null;
    console.log(ttlSec);
    if (ttlSec && ttlSec > 0) {
      await redis.set(`qr:${data.slug}:aval`, 1, { ex: ttlSec });
      await redis.set(`qr:${data.slug}:scans`, 0, { ex: ttlSec });
      await redis.set(`qr:${data.slug}:url`, data.url, { ex: ttlSec });
      await redis.set(`qr:${data.slug}:max_scans`, Number(data.max_scans), { ex: ttlSec });
      await redis.set(`qr:${data.slug}:id`, data.id, { ex: ttlSec });
    } else {
      await redis.set(`qr:${data.slug}:aval`, 1);
      await redis.set(`qr:${data.slug}:scans`, 0);
      await redis.set(`qr:${data.slug}:url`, data.url);
      await redis.set(`qr:${data.slug}:max_scans`, Number(data.max_scans));
      await redis.set(`qr:${data.slug}:id`, data.id);
    }


    return Response.json({ qr: data, short_url: shortUrl });
  } catch (err) {
    console.error("Error creating QR:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const body = await req.json();
    const s = supabaseServer();
    const { data: qr, error: findErr } = await s
      .from("qrs")
      .select("id, slug")
      .eq("id", body.qrId)
      .maybeSingle();

    if (findErr) {
      return Response.json({ error: findErr.message }, { status: 400 });
    }
    if (!qr) {
      return Response.json({ error: "QR not found" }, { status: 404 });
    }

    const { error: delErr } = await s.from("qrs").delete().eq("id", qr.id);
    if (delErr) {
      return Response.json({ error: delErr.message }, { status: 400 });
    }
    await redis.del(
      `qr:${qr.slug}:aval`,
      `qr:${qr.slug}:scans`,
      `qr:${qr.slug}:url`,
      `qr:${qr.slug}:max_scans`,
      `qr:${qr.slug}:id`
    );

    return Response.json({ msg: "QR deleted successfully" });
  } catch (err) {
    console.error("Error deleting QR:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}