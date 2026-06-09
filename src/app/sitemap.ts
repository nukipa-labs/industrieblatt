import type { MetadataRoute } from 'next';
import { getNukipaClient } from '@/lib/nukipa';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://industrieblatt.de';

  const client = await getNukipaClient();

  // Fetch up to 500 posts; paginate if the list grows beyond that
  const posts = await client.listPosts({ limit: 500 }).catch(() => [] as Awaited<ReturnType<typeof client.listPosts>>);

  const postEntries: MetadataRoute.Sitemap = (Array.isArray(posts) ? posts : []).map((p) => ({
    url: `${siteUrl}/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : undefined,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    { url: siteUrl, changeFrequency: 'daily', priority: 1.0 },
    ...postEntries,
  ];
}
