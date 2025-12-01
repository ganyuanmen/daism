"use client";

import { useState } from "react";
import RowItem from "./RowItem";
import {type SummaryItem} from './page'
import { useTranslations } from "next-intl";

interface Props {
  summaryList: SummaryItem[];
  total: number;
}

export default function TableClient({ summaryList,total }: Props) {
  const tc = useTranslations('Common');
  const [openRowId, setOpenRowId] = useState<string | null>(null);

  return (
<>
<h3 className="mt-3 mb-2" style={{textAlign:'center'}} > {tc('allRegisterText')}：  {total}</h3>
      <div style={{display:'flex',justifyContent:'center',alignItems:'center'}} >
      <div  >
        {summaryList.map((item) => (
          <RowItem
            key={item.id}
            item={item}
            openRowId={openRowId}
            setOpenRowId={setOpenRowId}
          />
        ))}
      </div>
  </div>
</>
  );
}
