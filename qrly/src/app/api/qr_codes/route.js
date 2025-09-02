import { hashpass } from "@/lib/hashpass";
import redis from "@/lib/redis";
import { genslug } from "@/lib/slug";
import { supabaseServer } from "@/lib/supabase";

export async function POST(req) {
    const body = await req.json();
    console.log(body);

    const s = supabaseServer();

    let slug = genslug(7);
    for (let i = 0; i < 5; i++) {
        const { data: existing } = await s.from("qrs").select("id").eq("slug", slug).maybeSingle();
        if (!existing) break;
        slug = genslug(7);
    }

    const hpass = body.reqpass ? hashpass(body.password) : null;
    const insertload = {
        title: body.title,
        owner_id: body.owner_id,
        slug,
        campaign_id: body.campaign_id || null,
        url: body.url,
        password: hpass,
        expires_at: body.expires_at ?? null,
    }

    const { data, error } = await s.from("qrs").insert(insertload).select("*").single();

    if (error) {
        console.error("Supabase insert error:", error);
        return Response.json({ "error": error.message });
    }

    const exp = data.expires_at || 0;

    try {
        const ttlsec = exp ? Math.floor((new Date(exp).getTime() - Date.now()) / 1000) : null;

        if (ttlsec && ttlsec > 0) {
            await redis.set(`qr:${data.slug}:aval`, 1, { EX: ttlsec });
        } else {
            await redis.set(`qr:${data.slug}:aval`, 1);
        }

    } catch (err) {
        return Response.json({"error":err.message});
    }
    const shorturl = `${process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? ""}/r/${slug}`;
    console.log(shorturl);
    return Response.json({ qr: data, short_url: shorturl });
}