import redis from "@/lib/redis";

// This runs for GET requests
export async function GET(req, { params }) {

  const { slug } = await params;
  const scans = await redis.get(`qr:${slug}:scans`) || 0;
  const isexp = await redis.get(`qr:${slug}:aval`)

  const x=isexp?true:false
  return Response.json({
    scans: scans ? Number(scans) : 0,
    is_active:x
  });
}
