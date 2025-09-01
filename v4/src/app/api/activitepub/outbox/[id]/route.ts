import { NextRequest, NextResponse } from 'next/server';

interface OutboxCollection {
  type: string;
  totalItems: number;
  id: string;
  first: {
    type: string;
    totalItems: number;
    partOf: string;
    orderedItems: any[];
    id: string;
  };
  "@context": string[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id: name } = params;

  if (!name) {
    return new NextResponse('Bad request.', { status: 400 });
  }

  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  if (!domain) {
    return new NextResponse('Server configuration error', { status: 500 });
  }

  const baseUrl = `https://${domain}/api/activitepub/outbox/${name}`;
  
  const outboxCollection: OutboxCollection = {
    type: "OrderedCollection",
    totalItems: 0,
    id: baseUrl,
    first: {
      type: "OrderedCollectionPage",
      totalItems: 0,
      partOf: baseUrl,
      orderedItems: [],
      id: `${baseUrl}?page=1`
    },
    "@context": ["https://www.w3.org/ns/activitystreams"]
  };

  return NextResponse.json(outboxCollection);
}
