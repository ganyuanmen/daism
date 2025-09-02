
import { NextRequest } from 'next/server';
import { getUser } from '@/lib/mysql/user';
import { createActor } from '@/lib/activity';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
  

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const name = params.id.toLowerCase();
    if (!name) {
      return new Response('Bad request.', {status: 400, headers: corsHeaders});
    }

    const localUser = await getUser(
      'actor_account',
      `${name}@${process.env.NEXT_PUBLIC_DOMAIN}`,
      'actor_account,pubkey,avatar,dao_id,id,actor_desc,manager'
    );

    if (!localUser?.actor_account) {
      return new Response(`No record found for ${name}.`, {status: 404, headers: corsHeaders});
    }

    let rejson = createActor(name, process.env.NEXT_PUBLIC_DOMAIN!, localUser);
    
    // 修复 mediaType
    if (rejson.icon?.mediaType === 'image/svg') {
      rejson.icon.mediaType = 'image/svg+xml';
    }

    // 返回 JSON 响应
    return new Response(JSON.stringify(rejson), {status: 200, headers:{
        'Content-Type': 'application/activity+json; charset=utf-8',
        'Connection': 'close',...corsHeaders}}
    // {
    //   status: 200,
    //   headers: {
    //     'Content-Type': 'application/activity+json; charset=utf-8',
    //     'Connection': 'close',
    //   },
    // }
);
  } catch (error) {
    console.error('Error in API route:', error);
    return new Response('Internal Server Error', {status: 500, headers: corsHeaders});
  }
}

export async function OPTIONS() {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }