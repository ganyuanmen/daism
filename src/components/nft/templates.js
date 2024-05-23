import { useState } from "react";
import ShowErrorBar from "../../components/ShowErrorBar";
import Loadding from "../../components/Loadding";
import PageItem from "../../components/PageItem";
import TempList from "./tempList";
import useTemplate from "../../hooks/useTemplate";


export default function Templates({user,t,tc,showError,closeTip,showTip}) {
    const [currentPageNum, setCurrentPageNum] = useState(1); //当前页
    const templateData = useTemplate({currentPageNum})
    
    return (
        <>
        {templateData.rows.length?<>
                <TempList tempData={templateData.rows} user={user} showError={showError} closeTip={closeTip} showTip={showTip} t={t} tc={tc} />
                <PageItem records={templateData.total} pages={templateData.pages} currentPageNum={currentPageNum} setCurrentPageNum={setCurrentPageNum} postStatus={templateData.status} />
            </>
            :templateData.status==='failed'?<ShowErrorBar errStr={templateData.error} />
            :templateData.status==='succeeded' ? <ShowErrorBar errStr={tc('noDataText')} />
            :<Loadding />
        }  
        </>
    );
    }
