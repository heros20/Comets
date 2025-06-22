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
    domains: ['tondomaine.com', 'autredomaine.com', 'ncqeaqymxdktlrdxxjlv.supabase.co'], // ajoute ici tous tes domaines d'images
  },
};

export default nextConfig;
