import React from 'react';
import { Plus, QrCode, BarChart3, Calendar, Trash2 } from 'lucide-react';
import Link from 'next/link';

const Dashboard = ({ user, campaigns = [], individualQRs = [] }) => {
  // Calculate totals
  const totalCampaigns = campaigns.length;
  const totalIndividualQRs = individualQRs.length;
  const totalQRs = totalCampaigns + totalIndividualQRs;

  const QuickActionCard = ({ icon: Icon, title, subtitle, href, primary = false }) => (
    <Link href={href || '#'}>
      <div className={`p-6 rounded-xl border hover:shadow-lg transition-all duration-200 text-left w-full cursor-pointer ${
        primary 
          ? 'bg-[#1A120B] text-[#E5E5CB] hover:bg-[#3C2A21]' 
          : 'bg-white border-[#3C2A21]/20 hover:bg-gray-50'
      }`}>
        <Icon className={`w-8 h-8 mb-3 ${primary ? 'text-[#E5E5CB]' : 'text-[#1A120B]'}`} />
        <h3 className={`font-semibold text-lg mb-1 ${primary ? 'text-[#E5E5CB]' : 'text-[#1A120B]'}`}>
          {title}
        </h3>
        <p className={`text-sm ${primary ? 'text-[#E5E5CB]/80' : 'text-[#3C2A21]'}`}>
          {subtitle}
        </p>
      </div>
    </Link>
  );

  const StatItem = ({ label, value }) => (
    <div className="text-center">
      <p className="text-3xl font-bold text-[#1A120B] mb-1">{value}</p>
      <p className="text-[#3C2A21] text-sm">{label}</p>
    </div>
  );

  const CampaignCard = ({ campaign, onDelete }) => (
    <div className="relative bg-white border border-[#3C2A21]/20 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
      <button
        onClick={() => onDelete?.(campaign.id)}
        className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-red-100 transition-colors duration-200"
        aria-label="Delete Campaign"
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </button>
      
      <h3 className="text-xl font-semibold text-[#1A120B] mb-3 pr-8">
        {campaign.name}
      </h3>
      
      <p className="text-sm text-[#3C2A21] mb-4 flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        Created {campaign?.created_at
          ? new Date(campaign.created_at).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "N/A"}
      </p>
      
      <div className="flex gap-3">
        <Link href={`/${campaign.id}`}>
          <button className="bg-[#1A120B] text-[#E5E5CB] hover:bg-[#3C2A21] transition-colors duration-300 rounded-lg px-4 py-2 text-sm font-medium">
            View QRs
          </button>
        </Link>
        <button className="border border-[#3C2A21]/30 text-[#1A120B] hover:bg-[#1A120B] hover:text-[#E5E5CB] transition-colors duration-300 rounded-lg px-4 py-2 text-sm font-medium">
          Add QR
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#E5E5CB]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#1A120B] mb-4">
            Welcome back, {user?.firstName || 'User'}
          </h1>
          <p className="text-xl text-[#3C2A21] mb-8">
            Manage your QR campaigns and track performance
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mb-12">
            <StatItem label="Campaigns" value={totalCampaigns} />
            <StatItem label="Individual QRs" value={totalIndividualQRs} />
            <StatItem label="Total QR Codes" value={totalQRs} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <QuickActionCard
            icon={Plus}
            title="Create QR Code"
            subtitle="Generate a new QR code instantly"
            href="/create-qr"
            primary={true}
          />
          <QuickActionCard
            icon={QrCode}
            title="New Campaign"
            subtitle="Organize multiple QR codes"
            href="/create-campaign"
          />
          <QuickActionCard
            icon={BarChart3}
            title="View All QRs"
            subtitle="See your individual QR codes"
            href="/yourqrs"
          />
        </div>

        {/* Campaigns Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-[#1A120B]">
              Your Campaigns
            </h2>
            {campaigns.length > 6 && (
              <Link href="/campaigns" className="text-[#1A120B] hover:underline font-medium">
                View all →
              </Link>
            )}
          </div>

          {campaigns.length === 0 ? (
            // Empty State for Campaigns
            <div className="text-center py-16 bg-white/50 rounded-xl border border-[#3C2A21]/20">
              <QrCode className="w-16 h-16 text-[#3C2A21]/50 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-[#1A120B] mb-3">
                No campaigns yet
              </h3>
              <p className="text-[#3C2A21] mb-6 max-w-md mx-auto">
                Create your first campaign to organize and manage multiple QR codes together.
              </p>
              <button className="px-8 py-3 bg-[#1A120B] text-[#E5E5CB] rounded-xl hover:bg-[#3C2A21] transition-colors font-medium">
                Create Your First Campaign
              </button>
            </div>
          ) : (
            // Campaigns Grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.slice(0, 6).map((campaign) => (
                <CampaignCard 
                  key={campaign.id} 
                  campaign={campaign}
                  onDelete={(id) => {
                    // Handle delete - you'll need to implement this
                    console.log('Delete campaign:', id);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick Summary for Individual QRs */}
        {individualQRs.length > 0 && (
          <div className="bg-white/50 rounded-xl border border-[#3C2A21]/20 p-6 text-center">
            <h3 className="text-lg font-semibold text-[#1A120B] mb-2">
              Individual QR Codes
            </h3>
            <p className="text-[#3C2A21] mb-4">
              You have {individualQRs.length} individual QR codes outside of campaigns
            </p>
            <Link href="/yourqrs">
              <button className="px-6 py-2 bg-[#1A120B] text-[#E5E5CB] rounded-lg hover:bg-[#3C2A21] transition-colors font-medium">
                View All QRs
              </button>
            </Link>
          </div>
        )}

        {/* Complete Empty State */}
        {campaigns.length === 0 && individualQRs.length === 0 && (
          <div className="text-center py-16">
            <QrCode className="w-20 h-20 text-[#3C2A21]/40 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-[#1A120B] mb-4">
              Ready to get started?
            </h2>
            <p className="text-[#3C2A21] mb-8 max-w-md mx-auto">
              Create your first QR code or campaign to begin tracking and managing your digital presence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-[#1A120B] text-[#E5E5CB] rounded-xl hover:bg-[#3C2A21] transition-colors font-medium">
                Create QR Code
              </button>
              <button className="px-8 py-3 border border-[#1A120B] text-[#1A120B] rounded-xl hover:bg-[#1A120B] hover:text-[#E5E5CB] transition-colors font-medium">
                Create Campaign
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;