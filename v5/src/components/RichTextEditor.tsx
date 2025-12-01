

"use client";
import React, { useRef, useState, useMemo } from 'react';
import JoditEditor from 'jodit-react';
import Video from './enki3/Video';
import { useDispatch } from 'react-redux';
import { setTipText, setErrText } from '@/store/store';
import { useTranslations } from 'next-intl';



interface RichTextEditorProps {
  title?: string;
  content: string;
  setContent: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ title, content, setContent }) => {
  const [isPast,setIsPast]=useState(false);
  const t = useTranslations('ff');
  const contentRef = useRef(content); // 存储内容，而不是 state
  const dispatch = useDispatch();

  // 使用 any 避免 IJodit 类型错误
  const editorRef = useRef<any>(null);

  const [isFix, setIsFix] = useState(false);
  const [show, setShow] = useState(false);
  const [vedioUrl, setVedioUrl] = useState('');

  const insertVideo = (url: string) => {
    let html = '';
    if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) {
      html = `<video controls width="100%" style="max-width: 440px;">
                <source src="${url}" type="video/mp4" />
                ${t('noSupotVideo')}
              </video><br/>`;
    } else if (/(youtube\.com|youtu\.be|bilibili\.com|vimeo\.com)/i.test(url)) {
      html = `<iframe
                src="${url.replace('youtu.be','www.youtube.com/embed')}"
                height="560"
                frameborder="0"
                allowfullscreen
                style="width: 100%;"
              ></iframe><br/>`;
    } else {
      dispatch(setErrText(t('noSuportType')));
      return;
    }
    editorRef.current?.s.insertHTML(html);
  };

  const config = useMemo(() => ({
      // 粘贴相关
      askBeforePasteHTML: isPast,       // 粘贴 HTML 时不提示
      askBeforePasteFromWord: isPast,   // 从 Word 粘贴时不提示
      // pastePlain: true,                // 强制纯文本粘贴
     
  
      // 过滤相关
      cleanHTML: {
        replaceNBSP: true,             // 替换 &nbsp; 为普通空格
        fillEmptyParagraph: false,     // 空段落不自动补 <br>
        removeEmptyElements: true,     // 移除空标签
      },
  
      // 其他优化
      // enter: "br",                     // 换行时用 <br>（避免生成 <p> 标签）
      // enter: "br" as const,   // 👈 保证类型是 "br" 字面量
      
      iframe: false,                   // 不使用 iframe 隔离
      spellcheck: true,                // 保留拼写检查
      toolbarAdaptive: false,          // 粘贴时不会因工具栏切换
    toolbarSticky: isFix,
    height: isFix ? '500' : 'auto',
    buttons: [
      'image', 'insertCustomVideo', 'source', '|',
      'bold', 'italic', 'underline', '|',
      'ul', 'ol', 'brush', 'paragraph', '|',
      'outdent', 'indent', '|',
      'fontsize', 'link', '|',
      'table', 'superscript', 'subscript', '|',
      'left', 'center', 'right', 'justify', '|',
      'undo', 'redo', '|',
      'preview', 'fullsize', 'eraser', 'toggleHeight','pastTool'
    ],
    // toolbarAdaptive: false,
    readonly: false,
    uploader: {
      insertImageAsBase64URI: false,
      imagesExtensions: ['jpg', 'png', 'jpeg', 'gif', 'svg', 'webp'],
      withCredentials: true,
      format: 'json',
      method: 'POST',
      url: '/api/admin/upload',
      prepareData: () => dispatch(setTipText(t('uploadImg'))),
      isSuccess: (resp: any) => resp,
      getMsg: (resp: any) => resp,
      process: (resp: any) => resp,
      defaultHandlerSuccess: (resp: any) => {
        if (resp.success) {
          editorRef.current?.s.insertHTML(`<img src="${resp.imageUrl}" />`);
        } else {
          dispatch(setErrText(`${resp.error}`));
        }
        dispatch(setTipText(''));
      }
    },
    controls: {
      insertCustomVideo: {
        name: 'insertCustomVideo',
        icon: 'video',
        tooltip: t('vedioLinkText'),
        exec: (editor: any) => { 
          editorRef.current = editor; 
          setShow(true); 
        }
      },
      toggleHeight: {
        name: t('isFixButton'),
        tooltip: t('isFixButton'),
        exec: () => setIsFix(prev => !prev)
      },
      pastTool:{
        name: isPast?t("selectCopytext"):t("realyPastText"),
        tooltip: t('isFixButton'),
        exec: () => setIsPast(prev => !prev)
      }
    }
  }), [isFix,isPast]);

  return (
    <>
      {title && <label className="mb-0" style={{ marginLeft: '6px' }}><b>{title}</b></label>}
      <JoditEditor
        ref={editorRef}
        value={contentRef.current} // 初始值
        onBlur={(newContent) => {
          contentRef.current = newContent; // 失焦时更新
          setContent(contentRef.current)
        }}
        // value={content}
        config={config}
        // onChange={(newContent) => {
        //   if (newContent !== lastContent.current) {
        //     lastContent.current = newContent;
        //     // 用 requestAnimationFrame / debounce 来减少 setState 频率
        //     requestAnimationFrame(() => {
        //       setContent(newContent);
        //     });
        //   }
        // }}
        // onChange={(newContent: string) => setContent(newContent)}
      />
      <Video
        show={show}
        setShow={setShow}
        vedioUrl={vedioUrl}
        setVedioUrl={setVedioUrl}
        insertVideo={insertVideo}
      />
    </>
  );
};

export default React.memo(RichTextEditor);
