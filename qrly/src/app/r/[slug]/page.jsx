import redis from "@/lib/redis";
import { supabaseServer } from "@/lib/supabase";
import { redirect } from "next/navigation";

export default async function QRpage({params}) {
    const {slug}=await params;
    console.log(slug);

    const key=`qr:${slug}:aval`;
    const isexp=await redis.get(key);
    if(isexp===null) return <div>Scanned QR is Expired!</div>



    const supabase=supabaseServer();
    const {data:qr,error}=await supabase.from("qrs").select("*").eq("slug",slug).single();

    if (error || !qr) return new Response("QR not found", { status: 404 });
    console.log(qr);

    const key1=`qr:${slug}:scans`;
    const hasreach=await redis.get(key1);
    console.log(hasreach,qr.max_scans);
    if(hasreach>qr.max_scans) return <div>Max Scans has reached</div>


    await redis.incr(`qr:${slug}:scans`);

    redirect(qr.url);
}