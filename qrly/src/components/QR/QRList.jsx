// "use client";
// import { supabaseBrowser } from "@/lib/supabase";
// import { useEffect, useState } from "react";
// import QRcard from "./QRcard";
// import CreateQrbtn from "../buttons/CreateQrbtn";
// import { Activity } from "lucide-react";
// import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
// import { Button } from "../ui/button";

// export function QRList({ userid, camid, initialData = null }) {
//   const [analytics, setAnalytics] = useState(initialData);
//   const [loading, setLoading] = useState(initialData ? false : true);
//   const [view, setView] = useState("active"); // "active" or "inactive"
//   const [animating, setAnimating] = useState(false);
//   const supabase = supabaseBrowser();

//   useEffect(() => {
//     if (!userid && !camid) {
//       setLoading(false);
//       return;
//     }

//     if (!initialData) {
//       const fetchInitial = async () => {
//         setLoading(true);
//         let query = supabase
//           .from("qranalytics")
//           .select("id, url, qr_id, total_scans, expire_at, campaign_id, target_url, title, user_id, max_scans");
//         if (camid) query = query.eq("campaign_id", camid);
//         else query = query.eq("user_id", userid);

//         const { data, error } = await query;
//         if (!error) setAnalytics(data);
//         setLoading(false);
//       };
//       fetchInitial();
//     }

//     const channel = supabase
//       .channel("realtime:analytics")
//       .on(
//         "postgres_changes",
//         {
//           event: "*",
//           schema: "public",
//           table: "qranalytics",
//           filter: camid ? `campaign_id=eq.${camid}` : `user_id=eq.${userid}`,
//         },
//         (payload) => {
//           setAnalytics((prev) => {
//             if (payload.eventType === "INSERT") return [...prev, payload.new];
//             if (payload.eventType === "UPDATE")
//               return prev.map((a) => (a.id === payload.new.id ? payload.new : a));
//             if (payload.eventType === "DELETE")
//               return prev.filter((a) => a.id !== payload.old.id);
//             return prev;
//           });
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [userid, camid, initialData]); // Added initialData to deps for safety

//   const filterData = (id) => {
//     setAnalytics(analytics.filter((q) => q.qr_id !== id));
//     console.log("filtered");
//   };

//   const handleUpdate = (updatedQR) => {
//     setAnalytics((prev) =>
//       prev.map((qr) =>
//         qr.qr_id === updatedQR.id
//           ? {
//               ...qr,
//               title: updatedQR.title,
//               target_url: updatedQR.url,
//               expire_at: updatedQR.expires_at,
//               campaign_id: updatedQR.campaign_id,
//             }
//           : qr
//       )
//     );
//   };

//   // Filtered data with logging for debugging
//   const filteredAnalytics = analytics.filter((a) => {
//     // Safer date check: Handle invalid dates as non-expired
//     const expireDate = a.expire_at ? new Date(a.expire_at) : null;
//     const isValidExpireDate = expireDate && !isNaN(expireDate.getTime());
//     const expired = isValidExpireDate && expireDate < new Date();

//     // Ensure max_scans is numeric
//     const maxScansNum = Number(a.max_scans) || 0;
//     const maxed = maxScansNum > 0 && a.total_scans >= maxScansNum;

//     // Log for debugging (remove after fixing)
//     console.log(`QR ${a.qr_id}: expired=${expired}, maxed=${maxed}, view=${view}, showing=${(view === "active" ? !expired && !maxed : expired || maxed)}`);

//     if (view === "active") {
//       return !expired && !maxed;
//     } else {
//       return expired || maxed;
//     }
//   });

//   return (
//     <Card className="mx-auto max-w-6xl mt-2 shadow-lg bg-transparent">
//       <CardHeader className="flex flex-col items-center justify-center gap-2 pb-2">
//         <CardTitle className="flex items-center gap-2 text-3xl font-bold text-[#1A120B]">
//           <Activity className="w-7 h-7 text-[#3C2A21]" />
//           Live QR Insights
//         </CardTitle>
//         {/* Stylish pill toggle group */}
//         <div className="flex justify-center w-full mt-6">
//           <div
//             className="flex bg-[transparent] rounded-full p-1 shadow-inner border border-[#e0e0e0] gap-0"
//             style={{ maxWidth: "340px" }}
//           >
//             <Button
//               variant="ghost"
//               size="lg"
//               className={`rounded-full px-8 py-2 font-semibold text-base transition-all duration-300 focus-visible:ring-0 focus-visible:outline-none ${
//                 view === "active"
//                   ? "bg-[#E5E5CB] shadow text-[#1A120B]"
//                   : "bg-transparent text-[#6B7280] hover:bg-[#E5E5CB] hover:text-[#1A120B]"
//               }`}
//               style={{ marginRight: "2px" }}
//               onClick={() => {
//                 if (view !== "active") {
//                   setAnimating(true);
//                   setTimeout(() => {
//                     setView("active");
//                     setAnimating(false);
//                   }, 200);
//                 }
//               }}
//             >
//               Active QRs
//             </Button>
//             <Button
//               variant="ghost"
//               size="lg"
//               className={`rounded-full px-8 py-2 font-semibold text-base transition-all duration-300 focus-visible:ring-0 focus-visible:outline-none ${
//                 view === "inactive"
//                   ? "bg-[#E5E5CB] shadow text-[#1A120B]"
//                   : "bg-transparent text-[#6B7280] hover:bg-[#E5E5CB]"
//               }`}
//               style={{ marginLeft: "2px" }}
//               onClick={() => {
//                 if (view !== "inactive") {
//                   setAnimating(true);
//                   setTimeout(() => {
//                     setView("inactive");
//                     setAnimating(false);
//                   }, 200);
//                 }
//               }}
//             >
//               Inactive QRs
//             </Button>
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent>
//         {loading ? (
//           <div className="flex justify-center items-center py-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#D5CEA3] border-t-[#1A120B]"></div>
//           </div>
//         ) : analytics.length === 0 ? (
//           <div className="bg-[#D5CEA3] border border-[#3C2A21]/20 rounded-xl p-6 text-center">
//             <p className="text-[#3C2A21] text-lg">
//               No QR codes found. Create a new QR code to start tracking analytics!
//               <CreateQrbtn defaultcamid={camid}></CreateQrbtn>
//             </p>
//           </div>
//         ) : (
//           <div
//             className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-300 ${
//               animating ? "opacity-0 scale-95" : "opacity-100 scale-100"
//             }`}
//           >
//             {filteredAnalytics.map((a) => (
//               <QRcard key={a.id} a={a} onDelete={filterData} onUpdate={handleUpdate} />
//             ))}
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }
"use client";
import { supabaseBrowser } from "@/lib/supabase";
import { useEffect, useState } from "react";
import QRcard from "./QRcard";
import CreateQrbtn from "../buttons/CreateQrbtn";
import { Activity } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export function QRList({ camid, initialData }) {
  const {user}=useUser();
  const userid=user?.id;
  const [analytics, setanalytics] = useState(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const supabase = supabaseBrowser();

  useEffect(() => {
    if (!userid && !camid) {
      setLoading(false);
      return;
    }

    if (!initialData) {
      console.log(initialData);
      const fetchInitial = async () => {
        setLoading(true);
        let query = supabase
          .from("qranalytics")
          .select("id, url, qr_id, total_scans, expire_at, campaign_id, target_url, title, user_id, max_scans");
        if (camid) query = query.eq("campaign_id", camid);
        else query = query.eq("user_id", userid);

        const { data, error } = await query;
        if (!error) setanalytics(data || []);
        setLoading(false);
      };
      fetchInitial();
    }

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

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userid, camid, initialData]);

  const filterdata = (id) => {
    setanalytics(analytics.filter((q) => q.qr_id !== id));
    console.log("filtered");
  };

  const handleUpdate = (updatedQR) => {
    setanalytics((prev) =>
      prev.map((qr) =>
        qr.qr_id === updatedQR.id
          ? {
              ...qr,
              title: updatedQR.title,
              target_url: updatedQR.url,
              expire_at: updatedQR.expires_at,
              campaign_id: updatedQR.campaign_id,
            }
          : qr
      )
    );
  };

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
            <CreateQrbtn defaultcamid={camid} />
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