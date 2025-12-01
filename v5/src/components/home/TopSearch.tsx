import { Row, Col, Container, Tooltip, OverlayTrigger } from "react-bootstrap";
import React, { useRef } from "react";
import { useTranslations } from "next-intl";
import cssStyle from "@/styles/topSearch.module.css";
import Loadding from "../Loadding";
import Image from "next/image";

interface TopSearchProps {
  orderType: boolean; //排序类型
  postStatus: string; //远程下载数据的状态
  orderIndex: number; //列举的三个， 默认按第几个排序
  setOrderType: React.Dispatch<React.SetStateAction<boolean>>;
  setOrderField: React.Dispatch<React.SetStateAction<string>>;
  setCurrentPageNum: React.Dispatch<React.SetStateAction<number>>;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  setOrderIndex: React.Dispatch<React.SetStateAction<number>>;

  
}

const TopSearch: React.FC<TopSearchProps> = React.memo((props) => {
  const {
    orderType,
    setOrderType,
    setOrderField,
    setCurrentPageNum,
    setSearchText,
    postStatus,
    orderIndex,
    setOrderIndex,
  } = props;

  const t = useTranslations("dao");
  const inputRef = useRef<HTMLInputElement>(null);

  const orderMenu = [
    { sortId: "dao_time", text: t("byTimeText") },
    { sortId: "dao_name", text: t("byNameText") },
    { sortId: "dao_ranking", text: t("byRankingtext") },
  ];

  return (
    <Container>
      <Row className="mb-1 mt-3 align-items-center">
        <Col className="Col-auto me-auto d-flex">
          <OverlayTrigger placement="bottom" overlay={<Tooltip>{t("tipText")}</Tooltip>}>
            <Image
              className={cssStyle.top_find_img}
              src="/find.svg"
              width={18}
              height={18}
              alt="find"
              onClick={() => {
                if (inputRef.current) {
                  setSearchText(inputRef.current.value.trim());
                  setCurrentPageNum(1);
                }
              }}
            />
          </OverlayTrigger>
          <input
            ref={inputRef}
            className={`form-control form-control-sm ${cssStyle.top_find_input}`}
            placeholder={t("seachText")}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearchText(e.currentTarget.value.trim());
                setCurrentPageNum(1);
              }
            }}
          />
        </Col>

        <Col className="col-auto">
          {postStatus !== "succeeded" ? (
            <Loadding containerSize="sm" />
          ) : (
            orderMenu.map((obj, idx) => (
              <span
                key={idx}
                className={
                  orderIndex === idx
                    ? `${cssStyle.top_item} ${cssStyle.top_order}`
                    : cssStyle.top_item
                }
                onClick={() => {
                  setOrderIndex(idx);
                  setOrderField(obj.sortId);
                  setOrderType(!orderType);
                }}
              >
                {obj.text} {orderIndex === idx && (orderType ? "↓" : "↑")}
              </span>
            ))
          )}
        </Col>
      </Row>
    </Container>
  );
});
TopSearch.displayName="TopSearch";
export default React.memo(TopSearch);
