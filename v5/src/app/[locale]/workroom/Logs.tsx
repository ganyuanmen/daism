"use client";
import { useState } from "react";
import ShowErrorBar from "@/components/ShowErrorBar";
import Loadding from "@/components/Loadding";
import { Card } from "react-bootstrap";
import PageItem from "@/components/PageItem";
import { useTranslations } from "next-intl";
import { usePageFetch } from "@/hooks/usePageFetch";
// import {type PageDataType} from '@/hooks/usePageFetch'


 interface LogItem {
  tran_hash: string;
  title: string;
  in_str: string;
  out_str: string;
  swap_time: string;
  tipAmount: number;
  tip_str: string;
  // [key:string]:any;
}


interface LogsProps {
  user: DaismUserInfo;
}

// ---- 组件 ----
export default function Logs({ user }: LogsProps) {

  const [currentPageNum, setCurrentPageNum] = useState<number>(1); // 当前页
  // useLogs 返回的数据
  // const logsData = useLogs( currentPageNum, user.account );

  const { rows, total, pages, status, error } = usePageFetch<LogItem[]>(
    `/api/getData?ps=20&pi=${currentPageNum}&did=${user.account}`,
     'getLogsData');

  // export function useLogs(currentPageNum: number,did:string) {
  //   return usePageFetch<LogItem[]>(`/api/getData?ps=20&pi=${currentPageNum}&did=${did}` ,'getLogsData');
  // }

  

  const tc = useTranslations('Common')

  
  return (<>
          {status === 'loading'?<Loadding />
          :(status === 'failed')?<ShowErrorBar errStr={error || ''} />
          :rows.length===0?<ShowErrorBar errStr={tc('noDataText')} />
          :<>
                <LogsPage logsData={rows} />
                <PageItem 
                records={total} 
                pages={pages} 
                currentPageNum={currentPageNum} 
                setCurrentPageNum={setCurrentPageNum} 
                postStatus={status} 
                />
            </>
          }
    </>);
}

// ---- 子组件 ----
interface LogsPageProps {logsData: LogItem[];}

function LogsPage({logsData}: LogsPageProps) {
  const t = useTranslations("my");
  return (
    <>
      {logsData.map((obj, idx) => (
        <Card className="mb-2" key={idx}>
          <Card.Body>
            <div>
              Transaction Hash:
              <a
                href={`${process.env.NEXT_PUBLIC_ETHERSCAN_URL}${obj.tran_hash}`}
                rel="noreferrer"
                target="_blank"
              >
                {obj.tran_hash}
              </a>
            </div>
            <div className="d-flex flex-row flex-wrap justify-content-between mt-1">
              <div>{obj.title}</div>
              <div>
                {t("inputText")}:{obj.in_str}
              </div>
              <div>
                {t("outputText")}:{obj.out_str}
              </div>
              <div>{obj.swap_time}(UTC+8)</div>
              {obj.tipAmount > 0 && (
                <div>
                  tip: {parseFloat(String(obj.tipAmount))} UTO to {obj.tip_str}
                </div>
              )}
            </div>
          </Card.Body>
        </Card>
      ))}
    </>
  );
}

