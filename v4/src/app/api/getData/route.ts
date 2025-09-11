

import { NextRequest, NextResponse } from 'next/server';
import {
  getUser, getIsDaoMember, getEipTypes, getDividend, getDappOwner,
  getProsData, getMynft, getSelfAccount, getDaoVote, getLastPro, getDaosData,
  getPrice, getToken, getMyPros, getLogsData, getMyDaos, getMyTokens
} from '@/lib/mysql/daism';

import {
  getLastDonate, getEnkiTotal, messagePageData, replyPageData, getAllSmartCommon,
  getHeartAndBook, fromAccount, getReplyTotal, daoPageData, getUserFromUrl, getOne,
  getAnnoce, getNotice
} from '@/lib/mysql/message';

import {
  getFollowers, getFollowees, getFollow, getFollow0, getFollow1,
  getTipFrom, getTipToMe
} from '@/lib/mysql/folllow';

import { httpGet } from '@/lib/net';

// 定义 methods 类型
type MethodFn = (params: Record<string, any>) => Promise<any>;

const methods: Record<string, MethodFn> = {
  getDaosData,
  getPrice,
  getToken,
  getMyPros,
  getLogsData,
  getMyDaos,
  getMyTokens,
  getLastPro,
  getDaoVote,
  getSelfAccount,
  getMynft,
  getDappOwner,
  getProsData,
  getDividend,
  messagePageData,
  replyPageData,
  getFollowers,
  getFollowees,
  getEipTypes,
  getAllSmartCommon,
  getHeartAndBook,
  fromAccount,
  getFollow,
  getFollow0,
  getFollow1,
  getIsDaoMember,
  getUser,
  getReplyTotal,
  daoPageData,
  getUserFromUrl,
  getOne,
  getAnnoce,
  getEnkiTotal,
  getLastDonate,
  getTipFrom,
  getTipToMe,
  getNotice,
};

// ⚠️ 这里建议用 x-method 避免和 HTTP method 混淆
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = Object.fromEntries(searchParams.entries());
    const method = req.headers.get('x-method'); // 改成自定义 header


    if (!method || !(method in methods)) {
      console.info("not method:",method)
      return NextResponse.json({ errMsg: 'Invalid Method' }, { status: 400 });
    }


    // ------------------ messagePageData 跨域情况 ------------------
    if (method === 'messagePageData' && query.account && query.account.includes('@')) {
      const { account, pi, menutype, daoid, actorid, w, order, eventnum, v } = query;
      const [, domain] = (account as string).split('@');

      if (domain === process.env.NEXT_PUBLIC_DOMAIN) {
        return NextResponse.json(await methods[method](query));
      } else {
        const reData:any = await httpGet(
          `https://${domain}/api/getData?pi=${pi}&menutype=${menutype}&daoid=${daoid}&actorid=${actorid}&w=${w}&order=${order}&eventnum=${eventnum}&account=${account}&v=${v}`,
          { 'Content-Type': 'application/json', 'x-method': 'messagePageData' }
        );
        const response=typeof(reData)==='string'?JSON.parse(reData):reData;
        if (response) {
          response.forEach((obj: any) => { obj.httpNetWork = true; });
          return NextResponse.json(response);
        } else {
          return NextResponse.json({ errMsg: 'fail' }, { status: 500 });
        }
      }
    }

    // ------------------ replyPageData 跨域情况 ------------------
    if (method === 'replyPageData' && query.account && query.account.includes('@')) {
      const { account, pi, ppid, sctype } = query;
      const [, domain] = (account as string).split('@');

      if (domain === process.env.NEXT_PUBLIC_DOMAIN) {
        return NextResponse.json(await methods[method](query));
      } else {
        const reData = await httpGet(
          `https://${domain}/api/getData?pi=${pi}&ppid=${ppid}&sctype=${sctype}&account=`,
          { 'Content-Type': 'application/json', 'x-method': 'replyPageData' }
        );
        const response=typeof(reData)==='string'?JSON.parse(reData):reData;
        if (response) {
          response.forEach((obj: any) => { obj.httpNetWork = true; });
          return NextResponse.json(response);
        } else {
          return NextResponse.json({ errMsg: 'fail' }, { status: 500 });
        }
      }
    }

    // ------------------ 其它方法 ------------------
    return NextResponse.json(await methods[method](query));

  } catch (err) {
    console.error('get: /api/getData:', err);
    return NextResponse.json({ errMsg: 'fail' }, { status: 500 });
  }
}
