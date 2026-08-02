import { Card } from "react-bootstrap";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import EnkiMemberItem from "../form/EnkiMemberItem";
import EventItem from "../form/EventItem";
import MessageReply, { type MessageReplyRef } from "../form/MessageReply";
import ReplyItem from "../form/ReplyItem";
import ShowErrorBar from "../../ShowErrorBar";
import EnKiHeart from "../form/EnKiHeart";
import EnKiBookmark from "../form/EnKiBookmark";
import EnkiShare from "../form/EnkiShare";
import ImageWithFallback from "@/components/ImageWithFallback";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import ShowVedio from "../form/ShowVedio";
import EnkiEditItem from "../form/EnkiEditItem";
import { useTranslations } from "next-intl";
import Loadding from "../../Loadding";
import ShowAddress from "../../ShowAddress";

import { fetchJson } from "@/lib/utils/fetcher";
import { type RootState, setTipText, setErrText, type AppDispatch } from "@/store/store";
import { Noreplay } from "@/lib/jssvg/SvgCollection";
import { wrapLinksWithATag } from "@/lib/utils/windowjs";

// 将正则表达式移到组件外部作为常量，避免每次渲染重新创建
const HASHTAG_REGEX = /#([\p{L}\p{N}]+)(?=[^\p{L}\p{N}]|$)/gu;

interface MessagePageProps {
  tabIndex: number;
  path: string;
  enkiMessObj: EnkiMessType;
  refreshPage: (flag?: string) => void;
  setActiveTab?: (index: number) => void;
  daoData?: DaismDao[] | null;
  filterTag?: (tag: string) => void;
}

interface WhereType {
  currentPageNum: number;
  sctype: string;
  pid: string;
}

/**
 * 检查是否允许编辑嗯文
 */
function checkIsEdit(
  actor: RootState["valueData"]["actor"],
  enkiMessObj: EnkiMessType,
  loginsiwe: boolean,
  daoData: DaismDao[] | null | undefined,
  path: string
): boolean {
  if (!loginsiwe || !actor?.actor_account) return false;
  if (enkiMessObj?.httpNetWork) return false;
  if (actor?.domain !== process.env.NEXT_PUBLIC_DOMAIN) return false;
  if (process.env.NEXT_PUBLIC_DOMAIN !== enkiMessObj?.actor_account?.split('@')[1]) return false;

  const adminActor = (process.env.NEXT_PUBLIC_ADMI_ACTOR as string).toLowerCase();
  if (actor?.manager?.toLowerCase() === adminActor) return true;

  if (path === 'enki') {
    if (daoData) {
      const _member = daoData.find((obj) => obj.dao_id === enkiMessObj.dao_id);
      return !!_member;
    }
  } else if (path === 'enkier') {
    if (!enkiMessObj.receive_account && 
        actor?.actor_account === enkiMessObj.actor_account && 
        enkiMessObj.dao_id === 0) {
      return true;
    }
  }
  return false;
}

/**
 * 检查是否允许回复、点赞、书签
 */
function checkAbleReply(
  actor: RootState["valueData"]["actor"],
  enkiMessObj: EnkiMessType,
  loginsiwe: boolean
): boolean {
  if (!loginsiwe || !actor?.actor_account) return false;
  if (enkiMessObj?.httpNetWork) return false;
  return true;
}

/**
 * 单个发文信息界面
 * @path enki/enkier 能修改，其它不能修改
 * @locale zh/cn
 * @env 环境变量
 * @currentObj 嗯文对象
 * @delCallBack 删除嗯文后回调
 * @setActiveTab 设置主页上的模块
 * @accountAr 本域名的所有帐号，用于发布嗯文时选择指定某人
 * @daoData 个人所属的smart common 集合
 * @fromPerson 是否从 个人帐户 中打开
 */
export default function MessagePage({
  tabIndex,
  path,
  enkiMessObj,
  refreshPage,
  setActiveTab,
  daoData,
  filterTag,
}: MessagePageProps) {
  const [fetchWhere, setFetchWhere] = useState<WhereType>({
    currentPageNum: 0,
    sctype: enkiMessObj.dao_id > 0 ? "sc" : "",
    pid: enkiMessObj.message_id,
  });
  const [data, setData] = useState<DaismReplyType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [err, setErr] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [replyIndex, setReplyIndex] = useState(-1);
  const [totalReplies, setTotalReplies] = useState(enkiMessObj.total);

  const repluBtn = useRef<MessageReplyRef>(null);
  const [divContent, setDivContent] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const actor = useSelector((state: RootState) => state.valueData.actor);
  const loginsiwe = useSelector((state: RootState) => state.valueData.loginsiwe);
  const t = useTranslations("ff");
  const tc = useTranslations("Common");

  // 使用 useCallback 包装 dispatch actions
  const showTip = useCallback((str: string) => dispatch(setTipText(str)), [dispatch]);
  const closeTip = useCallback(() => dispatch(setTipText("")), [dispatch]);
  const showClipError = useCallback((str: string) => dispatch(setErrText(str)), [dispatch]);

  // 加载完成后，把 div 内容赋值
  const handleDivRef = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      setDivContent(node?.textContent?.slice(0, 120).replaceAll("\n", "") ?? "");
    }
  }, []);

  // 检查是否允许回复
  const ableReply = useMemo(
    () => checkAbleReply(actor, enkiMessObj, loginsiwe),
    [actor, enkiMessObj, loginsiwe]
  );

  // 使用 useMemo 缓存替换后的文本
  const replacedText = useMemo(() => {
    return enkiMessObj?.content.replace(HASHTAG_REGEX, (match, p1) => {
      const escapedParam = p1.replace(/"/g, '"');
      return `<span class="tagclass daism-a" data-param="${escapedParam}">#${p1}</span>`;
    });
  }, [enkiMessObj?.content]);

  useEffect(() => {
    if (fetchWhere.currentPageNum === 0) {
      setData([]);
      setHasMore(true);
    }
  }, [fetchWhere.currentPageNum]);

  useEffect(() => {
    setIsEdit(checkIsEdit(actor, enkiMessObj, loginsiwe, daoData, path));
  }, [actor, enkiMessObj, loginsiwe, daoData, path]);

  // 删除回复 - 使用 useCallback 优化
  const replyDelCallBack = useCallback((index: number, mid: string) => {
    const upData = {
      mid,
      account: actor?.actor_account ?? '',
      type: 1,
      sctype: (enkiMessObj.dao_id as number) > 0 ? "sc" : '',
      path,
      pid: enkiMessObj.message_id,
      rAccount: enkiMessObj?.receive_account ?? ''
    };

    showTip(t("submittingText"));

    fetch("/api/postwithsession", {
      method: 'POST',
      headers: { 'x-method': 'messageDel' },
      body: JSON.stringify(upData)
    })
      .then(re => {
        closeTip();
        if (re.ok) {
          setTotalReplies(prev => prev - 1);
          setData(prev => {
            const newData = [...prev];
            newData.splice(index, 1);
            return newData;
          });
        } else {
          return re.json().then(reData => {
            showClipError(`${tc("dataHandleErrorText")}!\n ${reData?.errMsg}`);
          });
        }
      })
      .catch((error: Error) => {
        closeTip();
        showClipError(`${tc("dataHandleErrorText")}!\n ${error.message}`);
      });
  }, [actor?.actor_account, enkiMessObj.dao_id, enkiMessObj.message_id, enkiMessObj?.receive_account, path, showTip, closeTip, showClipError, t, tc]);

  // 对 replyItem 回复 - 使用 useCallback 优化
  const replyCallBack = useCallback((reply_index: number, _bid: string) => {
    setReplyIndex(reply_index);
    repluBtn.current?.show(_bid);
  }, []);

  // 新增加回复 - 使用 useCallback 优化
  const addReplyCallBack = useCallback((obj?: DaismReplyType, isNew?: boolean) => {
    setTotalReplies(prev => prev + 1);
    if (obj) {
      setData(prev => {
        const newData = [...prev];
        if (isNew) {
          newData.splice(replyIndex + 1, 0, obj);
        } else {
          newData.unshift(obj);
        }
        return newData;
      });
    }
  }, [replyIndex]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const resData = await fetchJson<DaismReplyType[]>(
          `/api/getData?pi=${fetchWhere.currentPageNum}&sctype=${fetchWhere.sctype}&pid=${fetchWhere.pid}`,
          { headers: { 'x-method': 'replyPageData' } }
        );

        if (resData) {
          setHasMore(resData.length > 0);
          if (fetchWhere.currentPageNum === 0) {
            setData(resData);
          } else {
            setData(prev => [...prev, ...resData]);
          }
          setErr('');
        } else {
          setHasMore(false);
          setErr('Failed to read data from the server');
        }
      } catch (error: unknown) {
        console.error(error);
        setHasMore(false);
        const errorMessage = error instanceof Error ? error.message : 'handle data error';
        setErr(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [fetchWhere]);

  const fetchMoreData = useCallback(() => {
    setFetchWhere(prev => ({
      ...prev,
      currentPageNum: prev.currentPageNum + 1
    }));
  }, []);

  // 点击 tag 事件处理 - 使用 useCallback 优化
  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains("tagclass")) {
      const param = target.dataset.param;
      if (param && typeof filterTag === 'function') {
        filterTag(param);
      }
    }
  }, [filterTag]);

  // 使用 useMemo 缓存渲染的回复列表
  const renderedArrays = useMemo(() => {
    let lastBid: string | undefined;
    return data.map((obj: DaismReplyType, idx: number) => {
      const isSameAsLast = obj.bid.toString() === lastBid;
      lastBid = obj.bid.toString();
      return (
        <ReplyItem
          replyObj={obj}
          delCallBack={replyDelCallBack}
          replyCallBack={replyCallBack}
          pleft={isSameAsLast ? 40 : 10}
          key={idx}
          reply_index={idx}
        />
      );
    });
  }, [data, replyDelCallBack, replyCallBack]);

  // 使用 useMemo 缓存 footer 内容
  const footerContent = useMemo(() => {
    if (isLoading) return <Loadding isImg={true} spinnerSize="sm" />;
    if (err) return <ShowErrorBar errStr={err} />;
    if (!hasMore && data.length > 0) {
      return <div style={{ width: '100%', textAlign: 'center' }}>{t('footText')}</div>;
    }
    return null;
  }, [isLoading, err, hasMore, data.length, t]);

  // 使用 useMemo 缓存条件判断结果
  const showOriginalLink = useMemo(() => {
    return !enkiMessObj.httpNetWork && 
           !enkiMessObj.actor_account.endsWith(process.env.NEXT_PUBLIC_DOMAIN as string);
  }, [enkiMessObj.httpNetWork, enkiMessObj.actor_account]);

  const showEditItem = useMemo(() => {
    return path !== 'SC' && actor?.domain === process.env.NEXT_PUBLIC_DOMAIN;
  }, [path, actor?.domain]);

  const canHeartBookmark = useMemo(() => {
    return ableReply && actor?.domain === process.env.NEXT_PUBLIC_DOMAIN;
  }, [ableReply, actor?.domain]);

  return (
    <Card className="mt-2 mb-3">
      <Card.Header>
        <EnkiMemberItem messageObj={enkiMessObj} />
        {enkiMessObj?._type === 1 && <EventItem currentObj={enkiMessObj} />}
      </Card.Header>
      <Card.Body>
        {/* 嗯文内容 */}
        <div
          className="daismCard"
          onClick={handleClick}
          ref={handleDivRef}
          dangerouslySetInnerHTML={{ __html: wrapLinksWithATag(replacedText) }}
        />
        {/* 链接条 */}
        {enkiMessObj?.content_link && (
          <div dangerouslySetInnerHTML={{ __html: enkiMessObj.content_link }} />
        )}
        {/* 首页图片 */}
        {enkiMessObj?.top_img && ( <div className="image-container">
          <ImageWithFallback
            src={enkiMessObj?.top_img}
            alt=""
            className="daism-a mt-2 mb-2"
            style={{ maxWidth: "100%" }}
          /></div>
        )}
        {/* 首页视频 */}
        {enkiMessObj?.vedio_url && <ShowVedio videoUrl={enkiMessObj.vedio_url} />}
      </Card.Body>
      <Card.Footer style={{ padding: 0 }}>
        {/* 发起者 */}
        {enkiMessObj?.self_account && (
          <div className="d-flex align-items-center mt-1">
            <div style={{ paddingLeft: '10px' }} className="d-inline-flex align-items-center">
              <span style={{ display: 'inline-block', paddingRight: '4px' }}>
                {t('proposedText')}:
              </span>{' '}
              <ImageWithFallback
                alt=""
                width={32}
                height={32}
                src={enkiMessObj?.self_avatar}
                fallback="/user.svg"
              />
            </div>
            <div style={{ flex: 1 }} className="d-flex flex-column flex-md-row justify-content-between">
              <span> {enkiMessObj?.self_account} </span>
              <ShowAddress address={enkiMessObj?.manager} />
            </div>
          </div>
        )}

        <div
          className="d-flex justify-content-between align-items-center"
          style={{ borderBottom: "1px solid #D2D2D2", padding: '4px 8px' }}
        >
          {/* 回复按钮 */}
          {enkiMessObj.is_discussion === 1 ? (
            <MessageReply
              ref={repluBtn}
              currentObj={enkiMessObj}
              isEdit={ableReply}
              addReplyCallBack={addReplyCallBack}
            />
          ) : (
            <span style={{ color: 'red' }}>
              <Noreplay size={20} />
            </span>
          )}
          {/* 点赞按钮 */}
          <EnKiHeart
            isEdit={canHeartBookmark}
            currentObj={{ ...enkiMessObj, total: totalReplies }}
            path={path}
          />
          {/* 书签按钮 */}
          <EnKiBookmark
            isEdit={canHeartBookmark}
            currentObj={{ ...enkiMessObj, total: totalReplies }}
            path={path}
          />
          {/* 分享按钮 */}
          {divContent ? (
            <EnkiShare content={divContent} currentObj={enkiMessObj} />
          ) : (
            <Loadding isImg={true} spinnerSize="sm" />
          )}
          {/* 修改/删除/转发/置顶上拉框 */}
          {showEditItem && (
            <EnkiEditItem
              path={path}
              isEdit={isEdit}
              messageObj={enkiMessObj}
              refreshPage={refreshPage}
              preEditCall={() => {
                if (setActiveTab) setActiveTab(tabIndex);
              }}
            />
          )}
        </div>

        {/* 其它服务器推送的回复显示原文链接 */}
        {showOriginalLink && (
          <div className="mt-2 mb-2" style={{ textAlign: 'center' }}>
            <a target="_blank" rel="noopener noreferrer" href={enkiMessObj?.link_url}>
              {t('origlText')}......
            </a>
          </div>
        )}

        {/* 回复列表 */}
        <InfiniteScroll
          dataLength={data.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<Loadding />}
        >
          {renderedArrays}
        </InfiniteScroll>

        {footerContent}
      </Card.Footer>
    </Card>
  );
}
