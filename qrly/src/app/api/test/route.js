import redis from "@/lib/redis";

export async function GET() {
    await redis.set("hello","wORLD");
    const getval=await redis.get("hello");
    return Response.json({Value:getval});
}