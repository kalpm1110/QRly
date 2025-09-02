import QRList from "@/components/QR/QRList";
import { supabaseServer } from "@/lib/supabase";
// import { currentUser } from "@clerk/nextjs/dist/types/server"
import { currentUser } from "@clerk/nextjs/server";

export default async function AllQrs() {

    const user=await currentUser();
    const supabase=supabaseServer();
    const {data:qrs,error}=await supabase.from("qrs").select("*").eq("owner_id",user.id)

  return (
    <div>
        <QRList qrs={qrs}></QRList>
    </div>
  )
}
