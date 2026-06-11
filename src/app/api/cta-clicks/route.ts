// CTA-click tracking proxy. The <PostBody> CTA island (from
// @nukipa/post-renderer-react) POSTs here same-origin so the tenant host can be
// resolved server-side via X-Forwarded-Host, then we relay to the gateway.
// Mirrors /api/lead. Analytics only — must never surface an error to the click.

export async function POST(req: Request) {
  let payload: Record<string, unknown> = {};
  try {
    payload = await req.json();
  } catch {
    // sendBeacon / keepalive fetch may deliver an empty or odd body — ignore.
    return new Response(null, { status: 204 });
  }

  try {
    await fetch(`${process.env.NUKIPA_GATEWAY_URL}/public/v1/cta-clicks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-Host': process.env.NUKIPA_TENANT_HOST ?? ''
      },
      body: JSON.stringify(payload)
    });
  } catch {
    // Tracking failures degrade to gaps in analytics; never block the click.
  }
  return new Response(null, { status: 204 });
}
