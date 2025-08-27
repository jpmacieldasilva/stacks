import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuração simplificada para Next.js 15
  
  // Desabilitar warnings de ESLint durante o desenvolvimento
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Configuração experimental para React 19
  experimental: {
    reactCompiler: false,
  },
};

export default nextConfig;
