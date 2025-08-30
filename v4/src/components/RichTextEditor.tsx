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
  const t = useTranslations('ff');
  const dispatch = useDispatch();

  const showError = (str: string) => dispatch(setErrText(str));
  const showTip = (str: string) => dispatch(setTipText(str));
  const closeTip = () => dispatch(setTipText(''));

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
      showError(t('noSuportType'));
      return;
    }
    editorRef.current?.s.insertHTML(html);
  };

  const config = useMemo(() => ({
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
      'preview', 'fullsize', 'eraser', 'toggleHeight'
    ],
    toolbarAdaptive: false,
    readonly: false,
    uploader: {
      insertImageAsBase64URI: false,
      imagesExtensions: ['jpg', 'png', 'jpeg', 'gif', 'svg', 'webp'],
      withCredentials: true,
      format: 'json',
      method: 'POST',
      url: '/api/admin/upload',
      prepareData: () => showTip(t('uploadImg')),
      isSuccess: (resp: any) => resp,
      getMsg: (resp: any) => resp,
      process: (resp: any) => resp,
      defaultHandlerSuccess: (resp: any) => {
        if (resp.success) {
          editorRef.current?.s.insertHTML(`<img src="${resp.imageUrl}" />`);
        } else {
          showError(`${resp.error}`);
        }
        closeTip();
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
      }
    }
  }), [isFix, t]);

  return (
    <>
      {title && <label className="mb-0" style={{ marginLeft: '6px' }}><b>{title}</b></label>}
      <JoditEditor
        ref={editorRef}
        value={content}
        config={config}
        onChange={(newContent: string) => setContent(newContent)}
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
