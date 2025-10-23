"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen  flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl md:text-6xl font-bold text-[#1A120B] mb-6 tracking-tight">
        Welcome to QRly
      </h1>
      <p className="text-xl md:text-2xl text-[#3C2A21] mb-8 max-w-2xl">
        Create and manage QR codes with real-time analytics. Simple, fast, and powerful.
      </p>
      <Link href="/dashboard">
        <Button className="bg-[#1A120B] text-[#E5E5CB] hover:bg-[#3C2A21] transition-colors duration-300 text-lg py-6 px-8 rounded-lg">
          Get Started
        </Button>
      </Link>
    </div>
  );
}