import { Geist, Geist_Mono } from "next/font/google";
import '@/styles/globals.css'
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import Navbar from "@/components/Navbar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "QRly",
  description: "Create and track QR codes with real-time analytics",
};




export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} bg-[#E5E5CB] text-[#1A120B] antialiased`}
        >
          {/* <div class="absolute top-0 z-[-2] h-screen w-screen rotate-180 transform bg-[#E5E5CB] bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(252,205,238,.5)_100%)]"></div> */}
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <footer className="bg-[#1A120B] text-[#E5E5CB] py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p>&copy; {new Date().getFullYear()} QRly. All rights reserved.</p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}