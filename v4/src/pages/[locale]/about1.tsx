import {GetStaticPropsContext} from 'next';
import {useTranslations} from 'next-intl';
import PageLayout from '@/components/PageLayout';
import 'bootstrap/dist/css/bootstrap.min.css'
import '../../styles/globals.css'
//'../styles/globals.css'

export default function About() {
  const t = useTranslations('dao');

  return (
    <PageLayout env={{version:'333'}}>
      <p>{t('noSelectImgText')}</p>
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
