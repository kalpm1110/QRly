
import { createQrRateLimiter } from "@/lib/rateLimit";
import redis from "@/lib/redis";
import { genslug } from "@/lib/slug";
import { supabaseServer } from "@/lib/supabase";

const BASE_URL = (process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "");

export async function POST(req) {
  try {
    const body = await req.json();
    const {success,limit,remaining,reset}=await createQrRateLimiter.limit(body.owner_id);
    console.log(success,limit,remaining,reset);
    if(!success){
      return Response.json({error:"Rate Limit Exceeded for Qr Creation"}, {status:429});
    }
    const s = supabaseServer();
    let slug = genslug(7);
    for (let i = 0; i < 5; i++) {
      const { data: existing } = await s.from("qrs").select("id").eq("slug", slug).maybeSingle();
      if (!existing) break;
      slug = genslug(7);
    }
    console.log(body.campaign_id);
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
    const shortUrl = `${BASE_URL?.replace(/\/$/, "") ?? ""}/r/${slug}`;
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
        max_scans:data.max_scans
      },
    ]);
    if (err) return Response.json({ msg: err.message });
    const ttlSec = data.expires_at
      ? Math.floor((new Date(data.expires_at).getTime() - Date.now()) / 1000)
      : null;
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

export async function PUT(req) {
  try {
    const body = await req.json();
    console.log(typeof (body.total_scans));
    const s = supabaseServer();
    const { data, error } = await s
      .from("qrs")
      .update({
        title: body.title,
        url: body.url,
        max_scans: body.max_scans,
        expires_at: body.expires_at,
        campaign_id: body.campaign_id ?? null,
      })
      .eq("id", body.qrId)
      .select("*")
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    await s
      .from("qranalytics")
      .update({
        title: data.title,
        campaign_id: data.campaign_id ?? null,
        target_url: data.url,
        expire_at: data.expires_at,
        max_scans: body.max_scans,
      })
      .eq("qr_id", data.id);
    const ttlSec = data.expires_at
      ? Math.floor((new Date(data.expires_at).getTime() - Date.now()) / 1000)
      : null;
    const avalKey = `qr:${data.slug}:aval`;
    const scansKey = `qr:${data.slug}:scans`;
    const urlKey = `qr:${data.slug}:url`;
    const maxScansKey = `qr:${data.slug}:max_scans`;
    const idKey = `qr:${data.slug}:id`;

    if (ttlSec && ttlSec > 0) {
      await redis.set(avalKey, 1, { ex: ttlSec });
      await redis.set(urlKey, data.url, { ex: ttlSec });
      await redis.set(maxScansKey, Number(data.max_scans), { ex: ttlSec });
      await redis.set(idKey, data.id, { ex: ttlSec });
      await redis.set(scansKey, Number(body.total_scans ?? 0), { ex: ttlSec });
    } else if (ttlSec === null) {
      await redis.set(avalKey, 1);
      await redis.set(urlKey, data.url);
      await redis.set(maxScansKey, Number(data.max_scans));
      await redis.set(idKey, data.id);
      await redis.set(scansKey, Number(body.total_scans ?? 0));
    } else {
      await redis.del(avalKey, urlKey, maxScansKey, idKey, scansKey);
    }

    return Response.json({ updatedQR: data });
  } catch (err) {
    console.error("Error updating QR:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
