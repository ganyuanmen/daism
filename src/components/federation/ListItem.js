import { Card } from "react-bootstrap";
import Link from "next/link";
import MemberItem from './MemberItem'
import TimesItem from "./TimesItem";


export default function ListItem({record,path,t}) {  
   
    return (
            
        <Link  style={{textDecoration:'none',color:'black'}} href={`/enki/${path}/message/[id]`} as={`/enki/${path}/message/${record.id}`} >
            <Card className="mb-2 mt-1 daism-title" >
            <Card.Body>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}} >
                    <MemberItem noLink={true} record={record} ><h3>{record.title}</h3></MemberItem>
                    <div>
                    <TimesItem  times={record.times} t={t} ></TimesItem>
                    </div>
                </div>
            </Card.Body>
            </Card>
        </Link>
    );
}




