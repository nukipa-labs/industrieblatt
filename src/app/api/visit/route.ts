import { type NextRequest, NextResponse } from 'next/server';
import { createNukipaClient } from '@nukipa/site-sdk';

export async function POST(req: NextRequest) {
  try {
    const { path } = await req.json();
    if (!path || typeof path !== 'string') {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const gatewayUrl = process.env.NUKIPA_GATEWAY_URL;
    const tenantHost = process.env.NUKIPA_TENANT_HOST?.trim() || null;
    if (!gatewayUrl) return NextResponse.json({ ok: true });

    const client = createNukipaClient({
      gatewayUrl,
      getHost:      () => tenantHost || req.headers.get('x-forwarded-host') || req.headers.get('host') || '',
      getIp:        () => req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null,
      getUserAgent: () => req.headers.get('user-agent'),
      getReferer:   () => req.headers.get('referer'),
    });

    await client.recordVisit({ path });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
