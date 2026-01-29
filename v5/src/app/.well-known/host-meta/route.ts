// app/.well-known/host-meta/route.ts
export async function GET() {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<XRD xmlns="http://docs.oasis-open.org/ns/xri/xrd-1.0">
  <Link
    rel="lrdd"
    type="application/json"
    template="https://daism.io/.well-known/webfinger?resource={uri}"
  />
</XRD>`,
    {
      headers: {
        'Content-Type': 'application/xml'
      }
    }
  )
}
