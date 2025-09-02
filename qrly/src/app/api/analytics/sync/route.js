import redis from "@/lib/redis";

export  async function POST() {
    try {
        const keys = await redis.get(`qr:*:scans`);
        const ex = await redis.get(`qr:*:aval`);

        for (const key of keys) {
            console.log(key);
        }
    } catch (error) {
        console.error(err);
        res.status(500).json({ error: "Failed to sync analytics" });
    }

}