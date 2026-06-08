/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NUKIPA_GATEWAY_URL:             'https://nukipa-staging-gateway.fly.dev',
    NUKIPA_TENANT_HOST:             'werksignal-f40fcd10.kibert.de',
    NEXT_PUBLIC_NUKIPA_GATEWAY_URL: 'https://nukipa-staging-gateway.fly.dev',
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ]
  }
};

export default nextConfig;
