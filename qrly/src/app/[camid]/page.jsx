import { currentUser } from '@clerk/nextjs/server';
import { QRList } from '@/components/QR/QRList';

export default async function CamQR({ params }) {
  const user = await currentUser();
  const { camid } = await params;

  if (!user) {
    return (
      <div className="min-h-screen bg-[#E5E5CB] flex items-center justify-center">
        <div className="bg-[#1A120B] text-[#E5E5CB] p-6 rounded-lg shadow-lg">
          <p className="text-lg">Please sign in to view campaign QR codes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E5E5CB] p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-[#1A120B] mb-6">QR Codes for Campaign {camid}</h1>
      <QRList camid={camid} userid={user.id} />
    </div>
  );
}