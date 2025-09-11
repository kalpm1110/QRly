"use client";
import { supabaseBrowser } from "@/lib/supabase";
import { useEffect, useState } from "react";
import QRcard from "./QRcard";
import CreateQrbtn from "../buttons/CreateQrbtn";
import { Activity } from "lucide-react";

export function QRList({ userid, camid, initaildata = null }) {
  const [analytics, setanalytics] = useState(initaildata);
  const [loading, setLoading] = useState(true);
  const supabase = supabaseBrowser();


  useEffect(() => {
    if (!userid && !camid) {
      setLoading(false);
      return;
    }

    const fetchInitial = async () => {
      setLoading(true);
      let query = supabase.from("qranalytics").select("id, url,qr_id, total_scans, expire_at, campaign_id,target_url,title,user_id,max_scans");
      if (camid) query = query.eq("campaign_id", camid);
      else query = query.eq("user_id", userid);

      const { data, error } = await query;
      if (!error) setanalytics(data);
      setLoading(false);
    };
    fetchInitial();

    const channel = supabase
      .channel("realtime:analytics")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "qranalytics",
          filter: camid ? `campaign_id=eq.${camid}` : `user_id=eq.${userid}`,
        },
        (payload) => {
          setanalytics((prev) => {
            if (payload.eventType === "INSERT") return [...prev, payload.new];
            if (payload.eventType === "UPDATE")
              return prev.map((a) => (a.id === payload.new.id ? payload.new : a));
            if (payload.eventType === "DELETE")
              return prev.filter((a) => a.id !== payload.old.id);
            return prev;
          });
        }
      )
      .subscribe();

    // const handleFocus=()=>{
    //   console.log("TabFocused");
    //   fetchInitial();
    // }
    // window.addEventListener("focus",handleFocus);

    return () => {
      supabase.removeChannel(channel);
      // window.removeEventListener("focus",handleFocus);
    };
  }, [userid, camid]);


  const filterdata = (id) => {
    setanalytics(analytics.filter((q) => q.qr_id !== id));
    console.log("filtered")
  }

  const handleUpdate = (updatedQR) => {
    setanalytics(prev =>
      prev.map(qr =>
        qr.qr_id === updatedQR.id
          ? {
            ...qr,
            title: updatedQR.title,
            target_url: updatedQR.url,
            expire_at: updatedQR.expires_at,
            campaign_id: updatedQR.campaign_id
          }
          : qr
      )
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1A120B] mb-6 flex items-center gap-2">
        <Activity className="w-6 h-6 text-[#3C2A21]" />
        Live QR Insights
      </h1>
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#D5CEA3] border-t-[#1A120B]"></div>
        </div>
      ) : analytics.length === 0 ? (
        <div className="bg-[#D5CEA3] border border-[#3C2A21]/20 rounded-xl p-6 text-center">
          <p className="text-[#3C2A21] text-lg">
            No QR codes found. Create a new QR code to start tracking analytics!
            <CreateQrbtn defaultcamid={camid}></CreateQrbtn>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {analytics.map((a) => (
            <QRcard key={a.id} a={a} onDelete={filterdata} onUpdate={handleUpdate} />
          ))}
        </div>
      )}
    </div>
  );
}