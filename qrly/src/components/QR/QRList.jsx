"use client";

import QRCode from "react-qr-code";
import useSWR from "swr";
import { motion } from "framer-motion";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function QRList({ qrs }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {qrs.map((qr, i) => (
        <motion.div
          key={qr.id}
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
        >
          <QrCard qr={qr} />
        </motion.div>
      ))}
    </div>
  );
}

function QrCard({ qr }) {
  const { data } = useSWR(`/api/analytics/${qr.slug}`, fetcher, {
    refreshInterval: 3000,
    revalidateOnFocus: true,
  });

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="relative p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 
                 rounded-2xl shadow-lg border border-gray-700 text-white overflow-hidden"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-indigo-500 to-purple-500 blur-2xl rounded-2xl pointer-events-none" />

      <div className="flex justify-center mb-4">
        <motion.div whileHover={{ rotate: 3, scale: 1.1 }}>
          <QRCode value={qr.url} size={120} fgColor="#fff" bgColor="transparent" />
        </motion.div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-400 truncate">
          <b className="text-gray-300">Link:</b> {qr.url}
        </p>
        <p>
          <b className="text-indigo-400">Scans:</b>{" "}
          <span className="text-xl font-bold">{data?.scans ?? 0}</span>
        </p>
        <p>
          <b className="text-indigo-400">Status:</b>{" "}
          <span
            className={`font-semibold px-2 py-1 rounded-lg ${
              data?.is_active
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {data?.is_active ? "Active" : "Expired"}
          </span>
        </p>
      </div>
    </motion.div>
  );
}
