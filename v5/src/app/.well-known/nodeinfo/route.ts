// app/.well-known/nodeinfo/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    links: [
      {
        rel: 'http://nodeinfo.diaspora.software/ns/schema/2.0',
        href: 'https://daism.io/nodeinfo/2.0'
      }
    ]
  })
}
