"use client";

import { supabaseBrowser } from "@/lib/supabase";
import { useEffect, useState } from "react";

// import useSWR from "swr";
// import QRCode from "react-qr-code";

// const fetcher = (url) => fetch(url).then(res => res.json());

// export function QRList({ qrs, userId, campaignId }) {
//   // Decide query params dynamically
//   const queryParams = new URLSearchParams();
//   console.log(queryParams);
//   if (userId) queryParams.append("userId", userId);
//   if (campaignId) queryParams.append("campaignId", campaignId);

//   console.log(queryParams);

//   const { data, error } = useSWR(
//     `/api/analytics?${queryParams.toString()}`,
//     fetcher,
//     { refreshInterval: 3000 }
//   );

//   if (error) return <p>Error loading analytics</p>;
//   if (!data) return <p>Loading...</p>;

//   const analytics = data.analytics;

//   return (
//     <div className="grid grid-cols-3 gap-4">
//       {qrs.map(qr => (
//         <QRCard key={qr.id} qr={qr} analytics={analytics[qr.id]} />
//       ))}
//     </div>
//   );
// }


// export function QRCard({ qr, analytics }) {
//   return (
//     <div className="p-4 border rounded shadow hover:shadow-lg transition duration-200">
//       <p><b>Link:</b> {qr.url}</p>
//       <QRCode value={qr.url} size={40} />
//       <p><b>Scans:</b> {analytics?.scans ?? 0}</p>
//       <p><b>Status:</b> {analytics?.is_active ? "Active" : "Expired"}</p>
//     </div>
//   );
// }


// function QrCard({ qr }) {
//   const { data } = useSWR(`/api/analytics/${qr.slug}`, fetcher, {
//     refreshInterval: 3000,
//     revalidateOnFocus: true,
//   });

//   return (
//     <motion.div
//       whileHover={{ scale: 1.05 }}
//       className="relative p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 
//                  rounded-2xl shadow-lg border border-gray-700 text-white overflow-hidden"
//     >
//       {/* Glow effect on hover */}
//       <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-indigo-500 to-purple-500 blur-2xl rounded-2xl pointer-events-none" />

//       <div className="flex justify-center mb-4">
//         <motion.div whileHover={{ rotate: 3, scale: 1.1 }}>
//           <QRCode value={qr.url} size={120} fgColor="#fff" bgColor="transparent" />
//         </motion.div>
//       </div>

//       <div className="space-y-2">
//         <p className="text-sm text-gray-400 truncate">
//           <b className="text-gray-300">Link:</b> {qr.url}
//         </p>
//         <p>
//           <b className="text-indigo-400">Scans:</b>{" "}
//           <span className="text-xl font-bold">{data?.scans ?? 0}</span>
//         </p>
//         <p>
//           <b className="text-indigo-400">Status:</b>{" "}
//           <span
//             className={`font-semibold px-2 py-1 rounded-lg ${data?.is_active
//                 ? "bg-green-500/20 text-green-400"
//                 : "bg-red-500/20 text-red-400"
//               }`}
//           >
//             {data?.is_active ? "Active" : "Expired"}
//           </span>
//         </p>
//       </div>
//     </motion.div>
//   );
// }



export function QRList({ userid, camid }) {
  const [analytics, setanalytics] = useState([])
  const supabase = supabaseBrowser();
  useEffect(() => {
    if (!userid && !camid) return;

    const fetchInitail = async (params) => {
      let query=supabase.from("qranalytics").select("*");
      if(camid) query=query.eq("campaign_id",camid);
      else query=query.eq("user_id",userid);
      console.log(query);

      const { data, error } = await query;
      if (!error) setanalytics(data);

    }
    fetchInitail();

    const channel = supabase.channel("realtime:analytics").on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "qranalytics",
      filter: camid? `campaign_id=eq.${camid}`:`user_id=eq.${userid}`,
    },
      (payload) => {
        console.log("Realtime data", payload);
        setanalytics((prev) => {
          if (payload.eventType === "INSERT") return [...prev, payload.new];
          if (payload.eventType === "UPDATE") return prev.map((a) => a.id === payload.new.id ? payload.new : a);
          if (payload.eventType === "DELETE") return prev.filter((a) => a.id !== payload.old.id);
          return prev;
        })
      }
    ).subscribe();


    console.log(analytics);
    return () => {
      supabase.removeChannel(channel);

    }
  }, [userid]);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">📊 Live Analytics</h1>
      <ul>
        {analytics.map((a) => (
          <li key={a.id}>
            QR: {a.qr_id} | Scans: {a.total_scans} | Title:{a.title}
          </li>
        ))}
      </ul>

    </div>
  )
}

