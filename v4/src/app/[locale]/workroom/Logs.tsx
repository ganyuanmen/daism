"use client";
import { useState } from "react";
import ShowErrorBar from "@/components/ShowErrorBar";
import Loadding from "@/components/Loadding";
import { Card } from "react-bootstrap";
import PageItem from "@/components/PageItem";
import { useTranslations } from "next-intl";
import { usePageFetch } from "@/hooks/usePageFetch";
import {type PageDataType} from '@/hooks/usePageFetch'


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
  const logsData = useLogs( currentPageNum, user.account );
  const tc = useTranslations('Common')

  
  return (
    <>
      {logsData?.rows?.length ? (
        <>
          <LogsPage logsData={logsData} />
          <PageItem
            records={logsData.total}
            pages={logsData.pages}
            currentPageNum={currentPageNum}
            setCurrentPageNum={setCurrentPageNum}
            postStatus={logsData.status}
          />
        </>
      ) : logsData.status === "failed" ? (
        <ShowErrorBar errStr={logsData.error ?? ""} />
      ) : logsData.status === "succeeded" ? (
        <ShowErrorBar errStr={tc("noDataText")} />
      ) : (
        <Loadding />
      )}
    </>
  );
}

// ---- 子组件 ----
interface LogsPageProps {logsData: PageDataType<LogItem[]>;}

function LogsPage({logsData}: LogsPageProps) {
  const t = useTranslations("my");
  return (
    <>
      {logsData.rows.map((obj, idx) => (
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



export function useLogs(currentPageNum: number,did:string) {
  return usePageFetch<LogItem[]>(`/api/getData?ps=20&pi=${currentPageNum}&did=${did}` ,'getLogsData');
}
