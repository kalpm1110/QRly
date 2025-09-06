"use client";
import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useUser } from '@clerk/nextjs';
import { supabaseBrowser } from '@/lib/supabase';

function CreateCam() {
  const { user } = useUser();
  const [name, setname] = useState("");
  const [loading, setloading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!name.trim()) {
      setError("Campaign name is required");
      return;
    }
    setloading(true);
    setError("");
    try {
      const supabase = supabaseBrowser();
      const { data, error: supabaseError } = await supabase
        .from("campaigns")
        .insert({ owner_id: user.id, name: name.trim() })
        .select()
        .single();
      if (supabaseError) {
        console.error("Supabase error:", supabaseError);
        setError(supabaseError.message || "Failed to create campaign");
      } else {
        console.log("Campaign created:", data);
        setname("");
        window.location.reload();
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setloading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Campaign Name"
          value={name}
          onChange={(e) => setname(e.target.value)}
          className={`bg-[#E5E5CB] border-[#3C2A21]/20 focus:border-[#3C2A21] focus:ring-[#D5CEA3] ${error ? "border-[#3C2A21] border-2" : ""}`}
        />
        {error && (
          <p className="text-[#3C2A21] text-sm mt-1">{error}</p>
        )}
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-[#1A120B] text-[#E5E5CB] hover:bg-[#3C2A21] transition-colors duration-300"
      >
        {loading ? "Creating..." : "Create Campaign"}
      </Button>
    </form>
  );
}

export default CreateCam;