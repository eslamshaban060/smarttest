// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {};

// export default nextConfig;
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ← ده بيخلي الـ build يكمل رغم أخطاء eslint
  },
};

export default nextConfig;
