import { Button, Modal, Overlay, Tooltip } from "react-bootstrap";
import { useState, useRef, useEffect } from "react";
import { LocationSvg } from '@/lib/jssvg/SvgCollection';
import { useTranslations } from 'next-intl'


// 定义组件 props 类型
interface EnkiShareProps {
  content: string;
  currentObj: EnkiMessType;
}

export default function EnkiShare({ content, currentObj }: EnkiShareProps) {
  const t = useTranslations('ff');
  const tc = useTranslations('Common');
  const [show, setShow] = useState(false);
  const [showOver1, setShowOver1] = useState(false);
  const [showOver2, setShowOver2] = useState(false);

  const target1 = useRef<HTMLButtonElement>(null);
  const target2 = useRef<HTMLButtonElement>(null);
  const delayTimeoutRef = useRef<NodeJS.Timeout | null>(null); // 使用 ref 存储超时

  // 生成 URL
  let url: string;
  if (currentObj.message_id.startsWith('http')) {
    url = `https://${process.env.NEXT_PUBLIC_DOMAIN}/communities/enkier/${currentObj.id}`;
  } else {
    url = currentObj.link_url || '#';
  }

  // 生成 HTML 卡片
  const uc = `
    <a href="${url}" target="_blank" style="width:100%; align-items:center;border:1px solid #ccc;font-size:1rem; color: currentColor;border-radius:8px;display:flex;text-decoration:none">
      <div style="aspect-ratio:1;flex:0 0 auto;position:relative;width:120px;border-radius:8px 0 0 8px;">
        <img src='${currentObj.top_img || currentObj.avatar}' alt="" style="background-position:50%;background-size:cover;display:block;height:100%;margin:0;object-fit:cover;width:100%;border-radius:8px 0 0 8px;">
      </div>
      <div style="width:100%">
        <div style="padding:2px 8px 2px 8px">${currentObj.actor_account.split('@')[1] || ''}</div>
        <div style="padding:2px 8px 2px 8px">${currentObj.actor_name || ''} (${currentObj.actor_account})</div>
        <div style="width:100%;padding:2px 8px 2px 8px;display:-webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden;">${content}</div>	
      </div>
    </a>
  `;

  // 复制 HTML 到剪贴板
  const getHtml = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(uc);
        setShowOver2(true);
        
        // 清除之前的超时
        if (delayTimeoutRef.current) {
          clearTimeout(delayTimeoutRef.current);
        }
        
        // 设置新的超时
        delayTimeoutRef.current = setTimeout(() => {
          setShowOver2(false);
          delayTimeoutRef.current = null;
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // 复制 URL 到剪贴板
  const copyUrl = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setShowOver1(true);
        
        if (delayTimeoutRef.current) {
          clearTimeout(delayTimeoutRef.current);
        }
        
        delayTimeoutRef.current = setTimeout(() => {
          setShowOver1(false);
          delayTimeoutRef.current = null;
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  // 组件卸载时清除超时
  useEffect(() => {
    return () => {
      if (delayTimeoutRef.current) {
        clearTimeout(delayTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <button 
        type="button" 
        onClick={() => setShow(true)} 
        className="btn btn-light" 
        data-bs-toggle="tooltip" 
        data-bs-html="true" 
        title={t('shareText')}
      >  
        <LocationSvg size={18} />
      </button>

      <Modal 
        size="lg" 
        className='daism-title' 
        show={show} 
        onHide={() => setShow(false)}
      >
        <Modal.Header closeButton>
          {t('shareText')}
        </Modal.Header>
        <Modal.Body>
          <div>{t('linkText')}：</div>
          <div className="d-flex align-items-center flex-wrap mb-3">
            <div style={{ wordWrap: 'break-word', wordBreak: 'break-all', flex: 1 }}>
              {url}
            </div>
            <div>
              <Button 
                variant="light" 
                size="sm" 
                onClick={copyUrl}
                ref={target1}
              >
                <img src='/clipboard.svg' alt="clipboard" width={16} height={16} /> 
                {t('copyText')}
              </Button> 
            </div>
          </div>
          
          <div dangerouslySetInnerHTML={{ __html: uc }} />
          
          <div style={{ textAlign: 'right', padding: '16px' }}>
            <Button 
              variant="light" 
              size="sm" 
              onClick={getHtml}
              ref={target2}
            >
              <img src='/clipboard.svg' alt="clipboard" width={16} height={16} /> 
              {t('copyLinkText')}
            </Button>
          </div>

          <Overlay target={target1.current} show={showOver1} placement="bottom">
            {(props) => (
              <Tooltip id="url-copy-tooltip" {...props}>
                {tc('copyText')}
              </Tooltip>
            )}
          </Overlay>
          
          <Overlay target={target2.current} show={showOver2} placement="bottom">
            {(props) => (
              <Tooltip id="html-copy-tooltip" {...props}>
                {tc('copyText')}
              </Tooltip>
            )}
          </Overlay>
        </Modal.Body>
      </Modal>
    </>
  );
}