import { Pagination } from "react-bootstrap";
import { useTranslations } from "next-intl";
import React from "react";

interface PageItemProps {
  records: number;  //记录数
  currentPageNum: number; //当前页
  pages: number; //总页数
  setCurrentPageNum: React.Dispatch<React.SetStateAction<number>>;
  postStatus: string; //远程下载数据状态
}

const PageItem: React.FC<PageItemProps> = ({
  records,
  currentPageNum,
  pages,
  setCurrentPageNum,
  postStatus,
}) => {
  const t = useTranslations("Common");
  const tStyle: React.CSSProperties = {
    color: "blueviolet",
    fontWeight: "bold",
    padding: "0 4px",
  };

  const isLoading = postStatus !== "succeeded";

  return (
    <>
      {pages > 1 && (
        <div>
          <div className="d-flex align-items-center justify-content-between p-2">
            <div>{t("totalRecordText")}：<span style={tStyle}>{records}</span></div>
            <div>{t("currentPageText")}：<span style={tStyle}>{currentPageNum}</span></div>
            <div>{t("totalPageText")}：<span style={tStyle}>{pages}</span></div>
          </div>
          <div className="d-flex align-item-center justify-content-center">
            <Pagination size="lg">
              {pages > 2 && (
                <Pagination.First
                  disabled={isLoading || currentPageNum === 1}
                  onClick={() => setCurrentPageNum(1)}
                />
              )}
              <Pagination.Prev
                disabled={isLoading || currentPageNum === 1}
                onClick={() => setCurrentPageNum(currentPageNum - 1)}
              />
              <Pagination.Next
                disabled={isLoading || currentPageNum === pages}
                onClick={() => setCurrentPageNum(currentPageNum + 1)}
              />
              {pages > 2 && (
                <Pagination.Last
                  disabled={isLoading || currentPageNum === pages}
                  onClick={() => setCurrentPageNum(pages)}
                />
              )}
            </Pagination>
          </div>
        </div>
      )}
    </>
  );
};

export default PageItem;
