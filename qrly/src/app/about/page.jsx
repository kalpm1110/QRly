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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <QrCode className="h-12 w-12 text-[#1A120B]" />
            <h1 className="text-4xl font-bold text-[#1A120B]">QRly</h1>
          </div>
          <p className="text-xl text-[#3C2A21] max-w-3xl mx-auto">
            A powerful QR code generator and analytics platform that helps you create, 
            track, and manage dynamic QR codes with real-time insights.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="bg-[#D5CEA3] border-[#3C2A21]/20 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <BarChart3 className="h-12 w-12 text-[#1A120B] mx-auto mb-2" />
              <CardTitle className="text-[#1A120B]">Real-time Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#3C2A21] text-center">
                Track QR code scans with live analytics, view scan counts, and monitor performance in real-time.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#D5CEA3] border-[#3C2A21]/20 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Clock className="h-12 w-12 text-[#1A120B] mx-auto mb-2" />
              <CardTitle className="text-[#1A120B]">Expiration Control</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#3C2A21] text-center">
                Set expiration dates and scan limits to control when and how many times your QR codes can be used.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#D5CEA3] border-[#3C2A21]/20 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-[#1A120B] mx-auto mb-2" />
              <CardTitle className="text-[#1A120B]">Secure & Reliable</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#3C2A21] text-center">
                Built with security in mind, using modern authentication and data protection practices.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#D5CEA3] border-[#3C2A21]/20 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Zap className="h-12 w-12 text-[#1A120B] mx-auto mb-2" />
              <CardTitle className="text-[#1A120B]">Lightning Fast</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#3C2A21] text-center">
                Optimized for speed with instant QR code generation and real-time updates.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#D5CEA3] border-[#3C2A21]/20 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-[#1A120B] mx-auto mb-2" />
              <CardTitle className="text-[#1A120B]">Campaign Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#3C2A21] text-center">
                Organize your QR codes into campaigns for better management and tracking.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#D5CEA3] border-[#3C2A21]/20 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <QrCode className="h-12 w-12 text-[#1A120B] mx-auto mb-2" />
              <CardTitle className="text-[#1A120B]">Easy Download</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#3C2A21] text-center">
                Download your QR codes in high-quality PNG format for any use case.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tech Stack */}
        <Card className="bg-[#D5CEA3] border-[#3C2A21]/20 mb-12">
          <CardHeader>
            <CardTitle className="text-[#1A120B] text-center text-2xl">Built With Modern Technology</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Badge className="bg-[#1A120B] text-[#E5E5CB] mb-2">Next.js</Badge>
                <p className="text-sm text-[#3C2A21]">React Framework</p>
              </div>
              <div className="text-center">
                <Badge className="bg-[#1A120B] text-[#E5E5CB] mb-2">Supabase</Badge>
                <p className="text-sm text-[#3C2A21]">Database & Auth</p>
              </div>
              <div className="text-center">
                <Badge className="bg-[#1A120B] text-[#E5E5CB] mb-2">Redis</Badge>
                <p className="text-sm text-[#3C2A21]">Caching</p>
              </div>
              <div className="text-center">
                <Badge className="bg-[#1A120B] text-[#E5E5CB] mb-2">Clerk</Badge>
                <p className="text-sm text-[#3C2A21]">Authentication</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GitHub Section */}
        <Card className="bg-[#1A120B] text-[#E5E5CB] border-[#3C2A21]/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Github className="h-8 w-8" />
              Open Source Project
            </CardTitle>
            <p className="text-[#D5CEA3]">
              QRly is an open-source project. View the source code, contribute, or fork the repository.
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
                className="border-[#3C2A21] text-[#E5E5CB] hover:bg-[#3C2A21] transition-colors duration-300"
                onClick={() => window.open('https://github.com/yourusername/qrly/stargazers', '_blank')}
              >
                <Star className="h-4 w-4 mr-2" />
                Star Project
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-[#D5CEA3]">
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
                <span>Documentation Available</span>
              </div>
            </div>
          </CardContent>
        </Card>

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
