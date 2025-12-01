"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {type SummaryItem} from './page'
import { Button, Card } from "react-bootstrap";
import Loading from "@/components/Loadding";
import ShowAddress from "@/components/ShowAddress";
import Image from "next/image";
import AutoShrinkScale from "./AutoShrinkScale";
import Link from "next/link";

export interface DetailItem {

  manager: string;
  actor_account: string;
  actor_name:string;
  avatar:string;

}

interface Props {
  item: SummaryItem;
  openRowId: string | null;
  setOpenRowId: (id: string | null) => void;
}

export default function RowItem({ item, openRowId, setOpenRowId }: Props) {
  const [detail, setDetail] = useState<DetailItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const isOpen = openRowId === item.id;

  const toggle = async () => {
    if (isOpen) {
      setOpenRowId(null);
      return;
    }

    setOpenRowId(item.id);

    // 首次加载详情
    if (!detail) {
      setLoading(true);

      try {
          const res = await fetch(`/api/getData?id=${item.id}`,{headers:{'x-method':'getAccount'}});

          if(res.ok){
            const data=await res.json() as DetailItem[];
            setDetail(data);
          }       
      } finally {
        setLoading(false);
      }
    }
  };

  return (
      <>
      <div className="mt-1 mb-1" style={{display:'flex',justifyContent:'center'}} >
   
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'220px'}} ><div>{item.id} </div>
        <Button  variant="outline-primary" onClick={toggle} style={{width:'90px',textAlign:'right'}} >{item.count} ▼</Button>
        </div>
 </div>
        <div>
    
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                key="detail"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{ overflow: "hidden" }}
              >
                <div className="p-3 bg-gray-100 rounded" style={{display:'flex',flexDirection:'row',flexWrap:'wrap',gap:'20px'}} >
                  {loading && <Loading />}

                  {!loading && detail && <>
                     {detail.map((item,idx) => (
                             <Card key={idx}  >
                              <Card.Body style={{width:'180px',overflow:'hidden'}} >
                                <div style={{display:'flex',justifyContent:'center'}} >
                                  <Image alt="user avatar" src={item.avatar??'/user.svg'} width={48} height={48} style={{borderRadius:'50%'}} />
                             
                              </div>
                                <Card.Title>
                                    <Link href={`https://${process.env.NEXT_PUBLIC_DOMAIN}/${item.actor_name}`}> <AutoShrinkScale>{item.actor_account}</AutoShrinkScale> </Link>
                                  {/* {item.actor_account} */}
                                  </Card.Title>
                                <ShowAddress address={item.manager} />
                              </Card.Body>
                            </Card>               
                            ))                            
                            }
                  </>
                  }
                </div>
              </motion.div>
            )}
          </AnimatePresence>     
</div>
</>
  );
}
