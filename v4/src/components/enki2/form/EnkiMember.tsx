import { User1Svg } from "@/lib/jssvg/SvgCollection";
import ShowAddress from "../../ShowAddress";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// export interface MemberObjType {
//   actor_account: string;
//   actor_url: string;
//   avatar: string;
//   dao_id:number;
//   send_type?: number;
//   receive_account?: string;
//   manager?:string;
//   // [key: string]: any; // 允许额外属性
// }

interface EnkiMemberProps {
  account:string;
  url: string;
  avatar: string; 
  REaccount?:string; //接收推送帐号
  isForward?:boolean; //转发 
  manager?:string; //钱包地址
  hw?: number; //头像宽高
  isLocal?:boolean;
}


export default function EnkiMember({url,account,avatar,isForward=false,REaccount='',manager='',isLocal=true, hw = 48,}: EnkiMemberProps) {
  const t = useTranslations("ff");


  const geneHref = (): string => {
      const [enkiName, domain] = account.split("@");
      return `https://${domain}/${enkiName}`;
  };

  return (
  <> {account && account.includes('@') &&
    <div style={{ width: "90%" }} className="d-inline-flex align-items-center">
    
        <Link href={(url && url.startsWith('http'))?url:geneHref()} {...(!isLocal && { target: "_blank", rel: "noopener noreferrer" })}  className="daism-a"  >
          <GeneImg avatar={avatar} hw={hw} />
        </Link>
      
        <div style={{paddingLeft:'2px',width:'100%'}} >
                {/* 第一行显示帐号 */}
                <div  className="daism-account" >{isForward?t('amouseText'):''} {account}</div>
                {/* 第二行显示 */}
                { REaccount?<div className="daism-account" >to: {REaccount} </div>:(manager.startsWith('0x') &&<ShowAddress address={manager} />)}
          </div>
    </div>}
    </>
  );
}

interface GeneImageProps {
  avatar: string;
  hw?: number; //头像宽高
}

function GeneImg({ avatar, hw=48 }: GeneImageProps) {
  const [imgError, setImgError] = useState(false);

  if (!avatar || imgError) {
    return <User1Svg size={hw} />;
  }

  return (
    <Image
      src={avatar}
      alt="avatar"
      width={hw}
      height={hw}
      style={{ borderRadius: '10px' }}
      onError={() => setImgError(true)} // 加载失败时切换到占位图
    />
  );
}