import {GetStaticPropsContext} from 'next';
import {useTranslations} from 'next-intl';
import PageLayout from '@/components/PageLayout';
import 'bootstrap/dist/css/bootstrap.min.css'
import '../../styles/globals.css'
//'../styles/globals.css'
// import RichTextEditor from '@/components/RichTextEditor';
const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false });
import { useState } from 'react';
import dynamic from 'next/dynamic';

export default function About() {
  const t = useTranslations('dao');
  const [content, setContent] = useState<string>('');
  return (
    <PageLayout env={{version:'333'}}>
      <p>{t('noSelectImgText')}</p>
      <RichTextEditor content={content} setContent={setContent} />
    </PageLayout>
  );
}

export async function getStaticProps({params}: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`../../../messages/${params?.locale}.json`))
        .default
    }
  };
}

export async function getStaticPaths() {
  return {
    paths: [{params: {locale: 'zh'}}, {params: {locale: 'en'}}],
    fallback: false
  };
}
