// import { supabaseServer } from '@/lib/supabase';

// export default async function sitemap() {
//   const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://qrly.app'; // Replace with your actual domain
  
//   // Static routes
//   const staticRoutes = [
//     {
//       url: baseUrl,
//       lastModified: new Date(),
//       changeFrequency: 'daily',
//       priority: 1.0,
//     },
//     {
//       url: `${baseUrl}/about`,
//       lastModified: new Date(),
//       changeFrequency: 'monthly',
//       priority: 0.8,
//     },
//     {
//       url: `${baseUrl}/dashboard`,
//       lastModified: new Date(),
//       changeFrequency: 'daily',
//       priority: 0.9,
//     },
//     {
//       url: `${baseUrl}/yourqrs`,
//       lastModified: new Date(),
//       changeFrequency: 'daily',
//       priority: 0.9,
//     },
//   ];

//   // Dynamic routes - fetch campaigns
//   let campaignRoutes = [];
//   try {
//     const supabase = supabaseServer();
//     const { data: campaigns, error } = await supabase
//       .from('campaigns')
//       .select('id, updated_at')
//       .order('updated_at', { ascending: false });

//     if (!error && campaigns) {
//       campaignRoutes = campaigns.map((campaign) => ({
//         url: `${baseUrl}/${campaign.id}`,
//         lastModified: campaign.updated_at ? new Date(campaign.updated_at) : new Date(),
//         changeFrequency: 'weekly',
//         priority: 0.7,
//       }));
//     }
//   } catch (error) {
//     console.error('Error fetching campaigns for sitemap:', error);
//   }

//   return [...staticRoutes, ...campaignRoutes];
// }