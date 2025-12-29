'use client'

import {  useState } from "react"
import ShowErrorBar from "@/components/ShowErrorBar";
import Loadding from "@/components/Loadding";

import { usePageFetch } from '@/hooks/usePageFetch';

import PageItem from "@/components/PageItem";
import { Button, Card, Row } from "react-bootstrap";
import Item from "./Item";
import EnkiMember from "@/components/enki2/form/EnkiMember";
import { useDispatch } from "react-redux";
import { AppDispatch, setMessageText } from "@/store/store";


export default function MyLove() {
    // const [showToggle, setShowToggle] = useState(false);
    // const contentRef = useRef<HTMLDivElement>(null);
    
const dispatch = useDispatch<AppDispatch>();
  function showMessage(str:string){dispatch(setMessageText(str))}
  

  const [currentPageNum, setCurrentPageNum] = useState(1) //当前页
const[asc,setAsc]=useState(true);
  


const { rows, total, pages, status, error } = usePageFetch<LoveType[]>(
 `/api/getData?pi=${currentPageNum-1}&order=${asc?'desc':'asc'}`,
  'messagePageDataLove');


  const hz=()=>{
   showMessage("47条回复属同一帐号重复回复")
  }

  return (
  <>
  <div style={{width:'100%',marginBottom:'10px',marginTop:'10px', display:'flex',alignItems:'center',justifyContent:'space-between'}}  >
    <Button onClick={()=>{setAsc(prev=>!prev) }}  >{asc?'从高到低排序':'从低到高'}</Button> 
    <Button onClick={hz}  >汇总</Button> 
  </div>
     {status === 'loading'?<Loadding />
          :(status === 'failed')?<ShowErrorBar errStr={error || ''} />
          :rows.length===0?<div style={{width:'100%',height:'300px'}} ><ShowErrorBar errStr={'Non'} /> </div>
          :
          <>
            {rows.map((record, idx) =>
        <Card key={idx} className="mb-2 daism-title ">
          <Card.Header className="daism-title">

            <EnkiMember url={record.actor_url}  manager={record.manager}  account={record.actor_account}
                        avatar={record.avatar} 
                       isLocal={false} hw={42} />

          </Card.Header>
          <Card.Body >
            <div  style={{width:'100%',marginBottom:'10px',marginTop:'10px', display:'flex',alignItems:'center',justifyContent:'space-between'}} > 
                <Button onClick={()=>showMessage(record.result_text)} >查看AI评分</Button>
                 <div>总分：{record.total_score}</div>
            </div>
                      
            
                <Item record={record} />
          </Card.Body>
        </Card>
      )}      
            <PageItem
              records={total}
              pages={pages}
              currentPageNum={currentPageNum}
              setCurrentPageNum={setCurrentPageNum}
              postStatus={status}
            />
          </>
      }
           
          
   

  </>
  )
}


