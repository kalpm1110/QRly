
import { QRList } from "@/components/QR/QRList";
import { supabaseServer } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs/server";

export default async function AllQrs() {

  const user = await currentUser();
  // const supabase = supabaseServer();
  // const { data: qrs, error } = await supabase.from("qrs").select("*").eq("owner_id", user.id)

  // if (error) return <p>Error loading QRs</p>;

  return (
    <div>
      <QRList  userid={user.id} ></QRList>
    </div>
  )
}
