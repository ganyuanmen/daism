'use client';

import React, { useState, useRef, useEffect } from 'react';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface ShowAddressProps {
  address: string;
  isb?: boolean; // 字体是否加粗（可选）
}

const ShowAddress: React.FC<ShowAddressProps> = ({ address, isb = false }) => {
  const t = useTranslations('Common');
  const [show, setShow] = useState(false); // 显示提示状态
  const target = useRef<HTMLImageElement>(null); // 引用图片元素
  const timerRef = useRef<NodeJS.Timeout | null>(null); // 定时器引用

  // 组件卸载时清除定时器
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // 生成格式化地址
  const getAccount = (): string => {
    if (address && address.length === 42) {
      return `${address.slice(0, 6)}......${address.slice(38, 42)}`;
    }
    return address;
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
    <span style={{ whiteSpace: 'nowrap' }}>
      <span>{isb ? <b>{getAccount()}</b> : getAccount()}</span>{' '}
      
      <Image
        alt="复制地址"
        width={20}
        height={20}
        data-address={address}
        src="/clipboard.svg"
        ref={target}
        onClick={handleCopy}
        style={{ cursor: 'pointer' }}
      />
      
      <Overlay target={target.current} show={show} placement="bottom">
        {(props) => (
          <Tooltip id="copy-tooltip" {...props}>
            {t('copyText')}
          </Tooltip>
        )}
      </Overlay>
    </span>
  );
};

export default ShowAddress;