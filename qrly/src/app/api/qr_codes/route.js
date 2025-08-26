import { hashpass } from "@/lib/hashpass";
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

    // try {
    //     const qid=data.id;

    // } catch (err) {
        
    // }

    console.log(process.env.NEXT_PUBLIC_APP_URL);

    const shorturl=`${process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/,"") ?? ""}/r/${slug}`;
    console.log(shorturl);
    return Response.json({qr:data,short_url:shorturl});

}