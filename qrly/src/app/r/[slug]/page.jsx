import redis from "@/lib/redis";
import { supabaseServer } from "@/lib/supabase";
import { redirect } from "next/navigation";

export default async function QRpage({ params }) {
    const { slug } = await params;
    console.log(slug);

    const key = `qr:${slug}:aval`;
    const isexp = await redis.get(key);
    if (isexp === null) return <div>Scanned QR is Expired!</div>

    const supabase = supabaseServer();
    let d;
    d = await redis.get(`qr:${slug}:url`);
    let m;
    m = Number(await redis.get(`qr:${slug}:max_scans`));
    let i;
    console.log(`qr:${slug}:id`)
    i = await redis.get(`qr:${slug}:id`)
    console.log(d,m,i);
    if (!d || !m || !i) {
        const { data: qr, error } = await supabase.from("qrs").select("*").eq("slug", slug).single();
        if (error || !qr) return new Response("QR not found", { status: 404 });
        d = qr.url;
        m = qr.max_scans;
        i = qr.id
        console.log("Using Supabase");
        // store in Redis for next requests
        await redis.set(`qr:${slug}:url`, d);
        await redis.set(`qr:${slug}:max_scans`, m);
        await redis.set(`qr:${slug}:id`, i);
    } else console.log("using redis")


    const key1 = `qr:${slug}:scans`;
    const hasreach = Number(await redis.get(key1));
    if (hasreach >= m) return <div>Max Scans has reached</div>


    await redis.incr(key1);
    await supabase.rpc("increment_scan", { qr_id: i });


    redirect(d);
}