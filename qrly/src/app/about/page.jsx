"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  QrCode, 
  BarChart3, 
  Clock, 
  Shield, 
  Zap, 
  Users, 
  Github, 
  ExternalLink,
  CheckCircle,
  Star
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#E5E5CB] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <QrCode className="h-14 w-14 text-[#1A120B] mx-auto mb-4" />
          <h1 className="text-5xl font-extrabold text-[#1A120B] mb-4">QRly</h1>
          <p className="text-xl text-[#3C2A21] max-w-2xl mx-auto mb-6">
            Create, track, and manage dynamic QR codes with real-time analytics. Simple, secure, and lightning fast.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-6">
            <div className="flex flex-col items-center">
              <BarChart3 className="h-8 w-8 text-[#3C2A21] mb-2" />
              <span className="font-medium text-[#1A120B]">Analytics</span>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="h-8 w-8 text-[#3C2A21] mb-2" />
              <span className="font-medium text-[#1A120B]">Expiration</span>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="h-8 w-8 text-[#3C2A21] mb-2" />
              <span className="font-medium text-[#1A120B]">Security</span>
            </div>
            <div className="flex flex-col items-center">
              <Zap className="h-8 w-8 text-[#3C2A21] mb-2" />
              <span className="font-medium text-[#1A120B]">Speed</span>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-[#D5CEA3] rounded-xl py-6 px-4 mb-10 shadow-sm">
          <h2 className="text-[#1A120B] text-center text-2xl font-bold mb-4">Built With</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <Badge className="bg-[#1A120B] text-[#E5E5CB]">Next.js</Badge>
            <Badge className="bg-[#1A120B] text-[#E5E5CB]">Supabase</Badge>
            <Badge className="bg-[#1A120B] text-[#E5E5CB]">Redis</Badge>
            <Badge className="bg-[#1A120B] text-[#E5E5CB]">Clerk</Badge>
          </div>
        </div>

        {/* GitHub Section */}
        <div className="bg-[#1A120B] text-[#E5E5CB] rounded-xl py-8 px-4 shadow-sm mb-10">
          <div className="text-center mb-4">
            <Github className="h-8 w-8 mx-auto mb-2" />
            <h2 className="text-2xl font-bold mb-2">Open Source Project</h2>
            <p className="text-[#D5CEA3]">QRly is open-source. View, contribute, or fork the repository.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <Button 
              className="bg-[#E5E5CB] text-[#1A120B] hover:bg-[#D5CEA3] transition-colors duration-300"
              onClick={() => window.open('https://github.com/kalpm1110/qrly', '_blank')}
            >
              <Github className="h-4 w-4 mr-2" />
              View on GitHub
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              className="border-[#3C2A21] text-[#1A120B] hover:bg-[#3C2A21] hover:text-[#E5E5CB] transition-colors duration-300"
              onClick={() => window.open('https://github.com/kalpm1110/qrly/stargazers', '_blank')}
            >
              <Star className="h-4 w-4 mr-2" />
              Star Project
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-[#D5CEA3]">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              <span>MIT License</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              <span>Contributions Welcome</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              <span>Docs Available</span>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-12 text-[#3C2A21]">
          <p className="text-lg mb-2">Ready to create your first QR code?</p>
          <Button 
            className="bg-[#1A120B] text-[#E5E5CB] hover:bg-[#3C2A21] transition-colors duration-300"
            onClick={() => window.location.href = '/dashboard'}
          >
            Get Started Now
          </Button>
        </div>
      </div>
    </div>
  );
}
