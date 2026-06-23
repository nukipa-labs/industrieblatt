/** @type {import('next').NextConfig} */
const nextConfig = {
  // NOTE: do NOT hard-code NUKIPA_* env here. A `next.config` `env` block is
  // inlined at build time and OVERRIDES the Vercel dashboard env, so baked
  // values (here: a stale staging gateway + a dead werksignal-*.kibert.de
  // tenant host) silently win forever — which dropped ALL of this site's
  // analytics for weeks. Let the platform-provided env (NUKIPA_GATEWAY_URL,
  // NUKIPA_TENANT_HOST) flow through from Vercel instead.
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ]
  }
};

export default nextConfig;
