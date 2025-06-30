/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");

    // Add a rule to handle .sql files
    config.module.rules.push({
      test: /\.sql$/,
      use: 'raw-loader',
    });

    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
