import { useState } from "react";
import ShowErrorBar from "../../components/ShowErrorBar";
import Loadding from "../../components/Loadding";
import {Card} from "react-bootstrap";

import PageItem from "../../components/PageItem";
import useLogs from "../../hooks/useLogs";

/**
 * 兑换记录
 */
export default function Logs({user,tx_url,t,tc}) {
    const [currentPageNum, setCurrentPageNum] = useState(1); //当前页
    const logsData = useLogs({currentPageNum,did:user.account})   

    return (
        <>
        {logsData.rows.length?<>
                <LogsPage logsData={logsData} tx_url={tx_url} t={t}/>
                <PageItem records={logsData.total} pages={logsData.pages} currentPageNum={currentPageNum} setCurrentPageNum={setCurrentPageNum} postStatus={logsData.status} />
            </>
            :logsData.status==='failed'?<ShowErrorBar errStr={logsData.error} />
            :logsData.status==='succeeded' ? <ShowErrorBar errStr={tc('noDataText')} />
            :<Loadding />
        }  
        </>
    );
    }

    function LogsPage({logsData,tx_url,t})
    {
    return <>
                {logsData.rows.map((obj, idx) => 
                        <Card className="mb-2" key={idx}>
                        <Card.Body>
                            <div>Transaction Hash:<a href={`${tx_url}${obj.tran_hash}`} rel="noreferrer" target="_blank" > {obj.tran_hash}</a></div>
                            <div className="d-flex flex-row flex-wrap justify-content-between mt-1" >
                                <div>{obj.title}</div>
                                <div>{t('inputText')}:{obj.in_str}</div>
                                <div>{t('outputText')}:{obj.out_str}</div>
                                <div>{obj.swap_time}(UTC+8)</div>
                                {obj.tipAmount>0 && <div> tip: {parseFloat(obj.tipAmount)} UTO to {obj.tip_str}</div>}
                            </div>
                           
                        </Card.Body> 
                        </Card>
                    )
                }   

            </>
    }