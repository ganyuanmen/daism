"use client";
import { useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import ProDetail from "./ProDetail";
import PageItem from "@/components/PageItem";
import ShowErrorBar from "@/components/ShowErrorBar";
import Loadding from "@/components/Loadding";
import {type RootState} from "@/store/store";
import { usePageFetch } from "@/hooks/usePageFetch";

// ----------------- 数据类型 -----------------
export interface ProItem {
  dao_id: number;
  delegator: string;
  createTime?: number;
  dao_logo?: string;
  dao_name?: string;
  dao_symbol?: string;
  daodesc?: string;
  pro_type: number;
  total_vote: number;
  rights: number;
  antirights: number;
  lifetime: number;
  strategy?: number;
  account?: string;
  dao_desc?: string;
  imgstr?: string;
  dividendRights?: number;

}


// ----------------- 主组件 -----------------
export default function ProHistory({ st }: { st: number }) {
  const t = useTranslations("my");
  const tc = useTranslations("Common");
  const user = useSelector((state: RootState) => state.valueData.user);

  const [currentPageNum, setCurrentPageNum] = useState<number>(1); //当前页
  const prosData = useProData(currentPageNum,user.account,st);

  return (
    <>
      {prosData.rows.length ? (
        <>
          <ProPage prosData={prosData.rows}  />
          <PageItem
            records={prosData.total}
            pages={prosData.pages}
            currentPageNum={currentPageNum}
            setCurrentPageNum={setCurrentPageNum}
            postStatus={prosData.status}
          />
        </>
      ) : prosData.status === "failed" ? (
        <ShowErrorBar errStr={prosData.error ?? "get data fail"} />
      ) : prosData.status === "succeeded" ? (
        <ShowErrorBar errStr={tc("noDataText")} />
      ) : (
        <Loadding />
      )}
    </>
  );
}

// ----------------- 子组件 -----------------
function ProPage({prosData}: {prosData: ProItem[];}) {
  const cssType: React.CSSProperties = {
    display: "inline-block",
    padding: "4px",
  };

  const t = useTranslations("my");
  return (
    <Card className="mt-1 daism-title ">
      <Card.Header>{t("myProText")}</Card.Header>
      <Card.Body>
        {prosData.map((obj, idx) => (
          <Row
            key={idx}
            className="mb-3 p-1"
            style={{ borderBottom: "1px solid gray" }}
          >
            <Col>
              <span style={cssType}>{t("proText")}</span>:
              <b style={cssType}>
                {t("proNameText").split(",")[obj.pro_type]}
              </b>
            </Col>
            <Col>
              <span style={cssType}>{t("totalText")}</span>:
              <b> {obj.total_vote} </b> ({t("rights")}:<b>{obj.rights}</b>{" "}
              {t("antirights")}:<b>{obj.antirights}</b>)
            </Col>
            <Col>
              <ProDetail obj={obj}  />
            </Col>
          </Row>
        ))}
      </Card.Body>
    </Card>
  );
}



// st 1 已完成 2 过期
export function useProData(currentPageNum: number,did:string,st:number) {
  return usePageFetch<ProItem[]>(`/api/getData?ps=25&pi=${currentPageNum}&did=${did}&st=${st}&t=${new Date().getTime()}` ,'getProsData');
}
