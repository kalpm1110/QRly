// components/Navbar.js
"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // install lucide-react for icons
import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 text-2xl font-bold tracking-wide">
                        <Link href="/">QRly</Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8 text-lg">
                        <Link href="/" className="hover:text-blue-400 transition-colors">
                            Home
                        </Link>
                        <Link href="/about" className="hover:text-blue-400 transition-colors">
                            About
                        </Link>
                        <Link href="/services" className="hover:text-blue-400 transition-colors">
                            Services
                        </Link>
                        <Link href="/contact" className="hover:text-blue-400 transition-colors">
                            Contact
                        </Link>
                        <UserButton></UserButton>
                    </div>

                    {/* Mobile Hamburger */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="focus:outline-none"
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-gray-800 px-4 py-3 space-y-2">
                    <Link
                        href="/"
                        className="block hover:text-blue-400 transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                        href="/about"
                        className="block hover:text-blue-400 transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        About
                    </Link>
                    <Link
                        href="/services"
                        className="block hover:text-blue-400 transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        Services
                    </Link>
                    <Link
                        href="/contact"
                        className="block hover:text-blue-400 transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        Contact
                    </Link>
                    <UserButton></UserButton>

                </div>
            )}
        </nav>
    );
}
