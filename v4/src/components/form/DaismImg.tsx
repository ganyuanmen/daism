import React, {
    useImperativeHandle,
    useState,
    useRef,
    forwardRef,
    useEffect,
  } from 'react';
  import { Button } from 'react-bootstrap';
  import { useTranslations } from 'next-intl';
  import ErrorBar from './ErrorBar';
  
  // 组件外部通过 ref 可调用的方法类型
  export interface DaismImgHandle {
    getData: () => string;
    getFileType: () => string;
    getFile: () => File | null;
  }
  
  // Props 类型
  interface DaismImgProps {
    title: string;
    maxSize: number; // 单位：字节
    fileTypes: string[];
    defaultValue?: string;
  }
  
  const DaismImg = forwardRef<DaismImgHandle, DaismImgProps>(
    ({ title, maxSize, fileTypes, defaultValue }, ref) => {
      const [showError, setShowError] = useState(false);
      const [invalidText, setInvalidText] = useState('');
      const [fileStr, setFileStr] = useState('');
      const imgRef = useRef<HTMLButtonElement | null>(null);
      const fileInputRef = useRef<HTMLInputElement | null>(null);
      const fileTypeRef = useRef<string>('');
      const t = useTranslations('Common');
  
      useEffect(() => {
        if (defaultValue) {
          fileTypeRef.current =
            defaultValue.indexOf('.') > 0
              ? defaultValue.toLowerCase().split('.').splice(-1)[0]
              : '';
          setFileStr(defaultValue);
        }
      }, [defaultValue]);
  
      useImperativeHandle(ref, (): DaismImgHandle => ({
        getData: () => fileStr,
        getFileType: () => fileTypeRef.current,
        getFile: () =>
          fileTypeRef.current && fileInputRef.current?.files?.[0]
            ? fileInputRef.current.files[0]
            : null,
      }));
  
      // 选择图片后处理
      const fileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShowError(false);
        if (!event.currentTarget.files || !event.currentTarget.files[0]) {
          return;
        }
  
        const file = event.currentTarget.files[0];
        fileTypeRef.current =
          file.name.indexOf('.') > 0
            ? file.name.toLowerCase().split('.').splice(-1)[0]
            : '';
  
        // 检查后缀名
        if (!fileTypes.includes(fileTypeRef.current)) {
          setInvalidText(
            `${t('onlySuport')} ${fileTypes} ${t('ofImgText')} [${file.name}]`
          );
          setShowError(true);
          return;
        }
  
        // 检查文件大小
        if (file.size > maxSize) {
          setInvalidText(`${t('fileSizeMax')} ${maxSize / 1024} k `);
          setShowError(true);
          setFileStr('');
          fileTypeRef.current = '';
          return;
        }
  
        const reader = new FileReader();
        reader.addEventListener('loadend', (e) => {
          if (e.target?.result && typeof e.target.result === 'string') {
            setFileStr(e.target.result);
          }
        });
        reader.readAsDataURL(file);
      };
  
      const triggerClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        fileInputRef.current?.click();
      };
  
      return (
        <div
          className="mb-3 border"
          style={{ paddingLeft: '6px', borderRadius: '8px' }}
          onClick={() => setShowError(false)}
        >
          <Button
            onClick={triggerClick}
            ref={imgRef}
            style={{ border: 0, background: 'transparent' }}
          >
            <span style={{ color: 'black' }}>{title}</span>{' '}
            <img
              alt=""
              src="/add.svg"
              width={32}
              height={32}
              style={{ margin: '36px 0 36px 0' }}
            />
          </Button>
  
          {fileStr && (
            <>
              <img
                alt=""
                src={fileStr}
                width={110}
                height={90}
                style={{ maxHeight: '110px', marginLeft: '20px' }}
              />
              <button
                className="btn btn-light"
                onClick={() => {
                  setFileStr('');
                  fileTypeRef.current = '';
                }}
              >
                {t('clearText')}
              </button>
            </>
          )}
  
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={fileChange}
          />
  
          <ErrorBar
            show={showError}
            target={imgRef.current}
            placement="right"
            invalidText={invalidText}
          />
        </div>
      );
    }
  );
  
  export default React.memo(DaismImg);
  