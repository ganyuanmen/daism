import { NextRequest, NextResponse } from 'next/server';
import { getCachedActor } from '@/lib/cache';
import { type ActivityPubBody } from '@/lib/activity/createMessage';
import { accept, createMess, follow, handle_announce, handle_delete, handle_update, undo, verifySignature } from '@/lib/activity/activityHandler';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const { id: name } = params;

  try {
    const bodyText = await request.text();
    // const postbody: ActivityPubBody = JSON.parse(bodyText);
    let postbody: ActivityPubBody;
    try {
      postbody = JSON.parse(bodyText);
    } catch (e) {
      return NextResponse.json(
        { errMsg: 'Invalid JSON in request body' },
        { status: 400, headers: corsHeaders }
      );
    }


    if (typeof postbody !== 'object' || !postbody.type || !postbody.actor) {
      return NextResponse.json({ errMsg: 'Invalid request body' }, {status: 400, headers: corsHeaders});
    }

    const _type = postbody.type.toLowerCase();
    if (_type === 'delete' && !(postbody.object as any)?.id) {
      return new NextResponse('Accepted',  {status: 202, headers: corsHeaders});
    }

    console.info(`${new Date().toLocaleString()}:inbox-----${name}-${_type}-${postbody.actor}`);
    if (process.env.IS_DEBUGGER === '1') console.info(postbody);

    const validTypes = ['follow', 'accept', 'undo', 'create', 'update', 'delete', 'announce'];
    if (!validTypes.includes(_type)) {
      return NextResponse.json({ errMsg: 'No need to handle' },  {status: 200, headers: corsHeaders});
    }

    const actor = await getCachedActor(postbody.actor);
    if (!actor?.pubkey || !actor.account) {
      return NextResponse.json({ errMsg: 'actor not found' },  {status: 404, headers: corsHeaders});
    }

    if (!await verifySignature(request, actor, `/api/activitepub/inbox/${name}`)) {
      return NextResponse.json({ error: 'Invalid signature' },  {status: 401, headers: corsHeaders});
    }

    console.info("Signature verified successfully!");
    
    const domain = process.env.NEXT_PUBLIC_DOMAIN!;
    const handlers = {
      accept: () => accept(postbody, domain, actor),
      undo: () => undo(postbody),
      delete: () => handle_delete((postbody.object as any)?.id),
      update: () => handle_update(postbody),
      create: () => createMess(postbody, name, actor),
      announce: () => handle_announce(postbody, name, actor),
      follow: () => follow(postbody, name, domain, actor)
    };

    // if (handlers[_type as keyof typeof handlers]) {
    //   await handlers[_type as keyof typeof handlers]();
    // }
    const handler = handlers[_type as keyof typeof handlers];
    if (handler) {
      await handler();
    } else {
      console.warn(`No handler for type: ${_type}`);
    }

    return new NextResponse('Accepted', {status: 202, headers: corsHeaders});

  } catch (error) {
    console.error("Error in inbox handler:", error);
    return NextResponse.json({ error: 'Internal server error' },  {status: 500, headers: corsHeaders});
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}