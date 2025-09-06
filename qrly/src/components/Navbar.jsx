"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-[#1A120B] text-[#E5E5CB] shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-3xl font-bold tracking-tight hover:text-[#D5CEA3] transition-colors">
                            QRly
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8 text-lg">
                        <Link href="/dashboard" className="hover:text-[#D5CEA3] transition-colors duration-200">
                            Home
                        </Link>
                        <Link href="/yourqrs" className="hover:text-[#D5CEA3] transition-colors duration-200">
                            YourQrs
                        </Link>
                        <UserButton />
                    </div>

                    {/* Mobile Hamburger */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="focus:outline-none text-[#E5E5CB] hover:text-[#D5CEA3] transition-colors"
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-[#3C2A21] px-4 py-4 space-y-4">
                    <Link
                        href="/dashboard"
                        className="block text-[#E5E5CB] hover:text-[#D5CEA3] transition-colors text-lg"
                        onClick={() => setIsOpen(false)}
                    >
                        Home
                    </Link>
                    <Link href="/yourqrs" className="hover:text-[#D5CEA3] transition-colors duration-200">
                        YourQrs
                    </Link>
                    <div className="flex justify-start">
                        <UserButton />
                    </div>
                </div>
            )}
        </nav>
    );
}