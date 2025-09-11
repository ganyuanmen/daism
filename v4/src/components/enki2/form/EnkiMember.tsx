import { User1Svg } from "@/lib/jssvg/SvgCollection";
import ShowAddress from "../../ShowAddress";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { Overlay, Tooltip } from "react-bootstrap";

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
  const tc = useTranslations("Common");
  const [show, setShow] = useState(false); // 显示提示状态
  const timerRef = useRef<NodeJS.Timeout | null>(null); // 定时器引用
  const target = useRef<HTMLImageElement>(null); // 引用图片元素

  const geneHref = (): string => {
      const [enkiName, domain] = account.split("@");
      return `https://${domain}/${enkiName}`;
  };
    // 复制地址到剪贴板
    const handleCopy = (e: React.MouseEvent<HTMLImageElement>) => {
      const dataAddress = e.currentTarget.dataset.address;
      if (!dataAddress) return;
      
      navigator.clipboard?.writeText(dataAddress)
        .then(() => {
          setShow(true);
          if (timerRef.current) return; // 如果已有定时器则跳过
          
          timerRef.current = setTimeout(() => {
            setShow(false);
            timerRef.current = null;
          }, 1000);
        })
        .catch(err => {
          console.error('复制失败:', err);
        });
    };

  return (
  <> {account && account.includes('@') &&
    <div style={{ width: "90%" }} className="d-inline-flex align-items-center">
    
        <Link href={(url && url.startsWith('http'))?url:geneHref()} {...(!isLocal && { target: "_blank", rel: "noopener noreferrer" })}  className="daism-a"  >
          <GeneImg avatar={avatar} hw={hw} />
        </Link>
      
        <div style={{paddingLeft:'2px',width:'100%'}} >
                {/* 第一行显示帐号 */}
                <div  className="daism-account" >
                <span>
                
                <Image
                  alt="复制地址"
                  width={20}
                  height={20}
                  data-address={account}
                  src="/clipboard.svg"
                  ref={target}
                  onClick={handleCopy}
                  style={{ cursor: 'pointer' }}
                />
                
                <Overlay target={target.current} show={show} placement="bottom">
                  {(props) => (
                    <Tooltip id="copy-tooltip" {...props}>
                      {tc('copyText')}
                    </Tooltip>
                  )}
                </Overlay>
              </span>
                  {isForward?t('amouseText'):''} {account}
                  
                  </div>
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