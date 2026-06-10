import { type NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  const secret = process.env.NUKIPA_REVALIDATE_SECRET;
  if (!secret || req.headers.get('x-nukipa-revalidate-secret') !== secret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const { paths } = await req.json() as { paths: string[] };
    if (!Array.isArray(paths) || paths.length === 0) {
      return NextResponse.json({ error: 'paths required' }, { status: 400 });
    }

    for (const p of paths) {
      revalidatePath(p);
    }
    // Always revalidate the homepage so the article list refreshes too
    revalidatePath('/');

    return NextResponse.json({ revalidated: true, paths });
  } catch {
    return NextResponse.json({ error: 'bad request' }, { status: 400 });
  }
}
