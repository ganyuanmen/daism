// app/nodeinfo/2.0/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    version: '2.0',
    software: {
      name: 'daism',
      version: '0.1.0'
    },
    protocols: ['activitypub'],
    services: {
      inbound: [],
      outbound: []
    },
    openRegistrations: false,
    usage: {
      users: {
        total: 1
      }
    },
    metadata: {
      nodeName: 'daism.io'
    }
  })
}
