import redis from "@/lib/redis";
import { supabaseServer } from "@/lib/supabase";
import { redirect } from "next/navigation";

// Helper function to fetch QR data from Redis or Supabase
async function getQR(slug, supabase) {
  let [url, maxScans, qrId] = await redis.mget(
    `qr:${slug}:url`,
    `qr:${slug}:max_scans`,
    `qr:${slug}:id`
  );

  if (!url || !maxScans || !qrId) {
    const { data: qr, error } = await supabase
      .from("qrs")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !qr) throw new Error("QR not found");

    url = qr.url;
    maxScans = qr.max_scans;
    qrId = qr.id;

    await redis.set(`qr:${slug}:url`, url);
    await redis.set(`qr:${slug}:max_scans`, maxScans);
    await redis.set(`qr:${slug}:id`, qrId);

    console.log("Fetched QR from Supabase");
  } else {
    console.log("Using Redis cache");
  }

  return {
    url,
    maxScans: Number(maxScans),
    qrId,
  };
}

export default async function QRpage({ params }) {
  const { slug } = await params;

  const keyActive = `qr:${slug}:aval`;
  const isActive = await redis.get(keyActive);
  if (isActive === null) return <div>Scanned QR is Expired!</div>;

  const supabase = supabaseServer();
  let qrData;
  try {
    qrData = await getQR(slug, supabase);
  } catch (err) {
    return new Response("QR not found", { status: 404 });
  }

  const keyScans = `qr:${slug}:scans`;
  const scansRaw = await redis.get(keyScans);
  const scans = scansRaw ? Number(scansRaw) : 0;
  const maxScans = Number(qrData.maxScans);

  if (maxScans !== -1 && scans >= maxScans) {
    return <div>Max Scans has reached</div>;
  }



  await redis.incr(keyScans);
  supabase.rpc("increment_scan", { qr_id: qrData.qrId })
    .then(() => console.log("Supabase scans updated"))
    .catch(err => console.error("Supabase RPC failed", err));

  redirect(qrData.url);
}
