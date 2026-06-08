import { type NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const gateway = process.env.NUKIPA_GATEWAY_URL;
    const tenantHost = process.env.NUKIPA_TENANT_HOST;
    if (gateway && tenantHost) {
      await fetch(`${gateway}/public/v1/forms/feedback/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Forwarded-Host': tenantHost,
        },
        body: JSON.stringify({
          message: body.text,
          email: body.email || undefined,
          interest: body.interest || undefined,
        }),
      }).catch(() => {});
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
