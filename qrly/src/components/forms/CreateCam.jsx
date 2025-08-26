"use client"
import React, { useState } from 'react'
import { Input } from '../ui/input'
import { useUser } from '@clerk/nextjs'
import { Button } from '../ui/button';
import { supabaseBrowser } from '@/lib/supabase';

function CreateCam() {
    const { user } = useUser();
    const [name, setname] = useState("")
    const [loading, setloading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!user) return;
        
        if (!name.trim()) {
            setError("Campaign name is required");
            return;
        }

        setloading(true);
        setError("");

        try {
            const {data, error: supabaseError} = await supabaseBrowser
                .from("campaigns")
                .insert({owner_id: user.id, name: name.trim()})
                .select()
                .single();
            
            if (supabaseError) {
                console.error("Supabase error:", supabaseError);
                setError(supabaseError.message || "Failed to create campaign");
            } else {
                console.log("Campaign created:", data);
                setname(""); // Clear form on success
                // You might want to trigger a refresh of the campaign list here
                window.location.reload(); // Simple refresh for now
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setloading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div>
                <Input 
                    placeholder="Campaign Name"
                    value={name}
                    onChange={(e) => setname(e.target.value)}
                    className={error ? "border-red-500" : ""}
                />
                {error && (
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                )}
            </div>
            <Button 
                type="submit" 
                disabled={loading}
                className="w-full"
            >
                {loading ? "Creating..." : "Create Campaign"}
            </Button>
        </form>
    )
}

export default CreateCam
