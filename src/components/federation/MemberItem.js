
import Link from 'next/link';
import ShowAddress from '../ShowAddress'
import React, {forwardRef } from "react";
import { User1Svg } from '../../lib/jssvg/SvgCollection';
import ShowImg from '../ShowImg';

const MemberItem = forwardRef((props,ref) => {//props.isrealyImg 真实照片，不是api 
    const{record}=props


    return (
      
    <div style={{display:'flex',alignItems:'center'}} >
        <LinkImg noLink={props.noLink} did={record.member_address}  >
            {record.member_icon?<>
                    {props.isrealyImg?<img src={record.member_icon} alt='' style={{width:"48px",height:"48px",borderRadius:'50%' }} />
                                     :<ShowImg path={record.member_icon} alt='' width="48px" height="48px" borderRadius='50%' /> 

                    }
                </>
            :<User1Svg size={48} />
            }
            
        </LinkImg>

    <div style={{paddingLeft:'10px'}} >
        {props.children?props.children:<div>{record.member_nick}</div>}
        {!props.isrealyImg && <ShowAddress address={record.member_address} ></ShowAddress>}
    </div>
    </div>
    );
});

export default MemberItem;

function LinkImg({noLink,did,locale, children})
{
    if(noLink) return children
    else 
    return  <Link className='daism-a' href={`/communities/actor/[id]`} as={`/communities/actor/${did}`} >
                    {children}
            </Link>
}