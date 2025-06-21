/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
   images: {
    domains: ['tondomaine.com', 'autredomaine.com', 'ncqeaqymxdktlrdxxjlv.supabase.co'], // ajoute les domaines de tes images
  },
}

export default nextConfig
