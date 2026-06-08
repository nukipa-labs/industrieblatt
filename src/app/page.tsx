import type { Metadata } from 'next';
import { getNukipaClient } from '@/lib/nukipa';
import { NewsIndex } from '@/components/NewsIndex';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Industrieblatt - Nachrichten fur die deutsche Industrie',
  description: 'Nachrichten, Analysen und Hintergrunde fur Entscheider in der deutschen Industrie.',
};

export default async function HomePage() {
  const client = await getNukipaClient();
  const posts  = await client.listPosts({ limit: 50 });
  return <NewsIndex posts={posts} />;
}
