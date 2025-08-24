import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 🚧 Temporário: não rodar ESLint durante o build de produção
  eslint: {
    ignoreDuringBuilds: true,
  },

  // (opcional – só se um dia aparecer erro de TypeScript no build)
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
};

export default nextConfig;
