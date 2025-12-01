// app/stats/page.tsx

import { getData } from "@/lib/mysql/common";
import TableClient from "./TableClient";

export interface SummaryItem {
  id: string;
  count: number;
}

async function getSummaryList(): Promise<SummaryItem[]> {
 return await getData("SELECT register_time as id,COUNT(*) count FROM v_account GROUP BY register_time ORDER BY register_time DESC",[]);
}

export default async function Page() {
  const summaryList = await getSummaryList();
  const total = summaryList.reduce((sum, item) => sum + (item.count || 0), 0);

  return <TableClient summaryList={summaryList} total={total} />;
}
