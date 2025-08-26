import React, { useImperativeHandle, useRef, forwardRef, useState } from "react";
import Media, { type MediaRef } from "./Media";
import SCProperty, { type SCPropertyRef } from "./SCProperty";
import dynamic from 'next/dynamic';
import Loadding from '../Loadding';

const Richwet = dynamic(() => import('../RichTextEditor'), {
  ssr: false,
  loading: () => <Loadding />,
});


interface RichEditorProps {
  currentObj?: EnkiMessType|null;
  isSC?: boolean;
  accountAr?: AccountType[];
}

export interface RichEditorRef {
  getData: () => string;
  getImg: () => File | null|undefined;
  getFileType: () => string;
  getVedioUrl: () => string;
  getProperty: () => any;
  getAccount: () => string | undefined;
  getTextContent: () => string;
}

const RichEditor = forwardRef<RichEditorRef, RichEditorProps>(({ currentObj, isSC, accountAr }, ref) => {
  const mediaRef = useRef<MediaRef>(null);
  const propertyRef = useRef<SCPropertyRef>(null);
  const [content, setContent] = useState<string>(currentObj?.content ?? '');

  useImperativeHandle(ref, () => ({
    getData: () => content,
    getImg: () => mediaRef.current?.getImg(),
    getFileType: () => mediaRef.current?.getFileType() ?? '',
    getVedioUrl: () => mediaRef.current?.getVedioUrl() ?? '',
    getProperty: () => propertyRef.current?.getData(),
    getAccount: () => propertyRef.current?.getAccount(),
    getTextContent,
  }));

  const transformHTML = (html: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    let result = '';
    const allNodes = doc.body.childNodes;
    allNodes.forEach(node => {
      if (node.textContent?.trim()) result += `<p>${node.textContent.trim()}</p>`;
    });
    return result;
  };

  const getTextContent = (): string => {
    const elements5 = document.querySelectorAll<HTMLElement>('.jodit-wysiwyg');
    return elements5[0] ? transformHTML(elements5[0].innerHTML) : '';
  };

  return (
    <>
      <Richwet content={content} setContent={setContent} />
      <Media ref={mediaRef} currentObj={currentObj}>
        {accountAr && <SCProperty ref={propertyRef} currentObj={currentObj} accountAr={accountAr} isSC={isSC} />}
      </Media>
    </>
  );
});

export default React.memo(RichEditor);
