
import { useTranslations } from 'next-intl'
import PageLayout from '../components/PageLayout';
import {getEnv} from '../lib/utils/getEnv'
import Head from 'next/head';
// import { useRef, useEffect } from 'react';
export default function Home({locale,env}) {
  
    const t = useTranslations('iadd')


    return (<>
         <Head>
            <meta charSet="utf-8"/>
		    <link rel="dns-prefetch" href="//www.google-analytics.com" />
            <meta httpEquiv="x-dns-prefetch-control" content="on" />
            <meta name="robots" content="index, follow, noodp" />
            <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
            <title>{t('indexTitleText')}</title>
            {locale==='en'?<meta name="keywords" lang="en" content="Proof-of-Love Civilization, Proof of Love, PoL Civ, Satoshi UTO Fund, SUF, Universal Value, SufAIthon, DAism"/>
            :<meta name="keywords" lang="zh-cmn-Hans" content="爱的证明, Proof of Love, 富爱文明, 中本聪UTO基金, Satoshi UTO Fund, SUF, 普世价值, 速发赛, 道易程"/>} Leading to PoL Civ
            {locale==='en'?<meta name="description" lang="en" content="Leading to Proof-of-Love Civilization by Joining Blockchain & AI Together - DAism"/>
            :<meta name="description" lang="zh-cmn-Hans" content="道易程的爱的证明（Proof of Love）治理共识，将区块链与人工智能融合在一起，引领人类奔赴以爱为核心伦理的新文明。"/>}
        </Head>

        <PageLayout env={env} >
            {/* 顶部svg desktop:PC端，mobile是手机端 */}
            <div className="desktop-only"><object type="image/svg+xml" style={{width:'100%'}} data={`/topsvg_${locale==='en'?'en':'zh'}.svg`}></object> </div>
            <div className="mobile-only"><object type="image/svg+xml" style={{width:'100%'}} data={`/s1_${locale==='en'?'en':'zh'}.svg`}></object></div>
		
            <div style={{fontSize:'1rem'}}  >
			    <h2>💓 {t('xuanyan-01')} </h2>
				<p>{t('xuanyan-02')}</p>
				<p>{t('xuanyan-03')}</p>
				<p>{t('xuanyan-04')}</p>
				<p>{t('xuanyan-05')}</p>
				<p>{t('xuanyan-06')}</p>				
                <h2>💓 Breakthroughs of PoL 1.0</h2>
                    <p>{t('pol-01')} <a href={`https://daism.io/${locale==='zh'?'zh/':''}deval`}  target="_blank">IADD {t('networkName')}</a>{t('pol-02')}</p>
                    <ul>
                        <li>
                            <a href={`https://daism.io/${locale==='zh'?'zh/':''}deval`}  target="_blank">Smart Creative Commons 0 License(SCC0 License)</a>
                        </li>
                        <p>{t('pol-03')}</p>
                        <li><a href="https://daism.io/deval"  target="_blank">Incentive: ETH forging</a></li>
                        <p>
                            {t('pol-04')}
                            <a href={`https://daism.io/${locale==='zh'?'zh/':''}deval`}  target="_blank">{t('pol-05')}</a>
                            {t('pol-06')}
                            <a href="https://learn.daism.io/docs/whitepaper.html#ethforging" target="_blank">DAism Whitepaper</a>.
                        </p>
                        <li><a href="https://50satoshis.com/"  target="_blank">Incentive: 50 Satoshis</a></li>
                        <p>{t('pol-07')} </p>
                        <li><a href={`https://daism.io/${locale==='zh'?'zh/':''}communities/enki/456f17cea59f48b1a7bcd322592c73a3`}  target="_blank">{t('pol-08')}</a></li>
						<p>{t('pol-09')} </p>
                    </ul>
                <h2>💓 Ongoing of PoL 2.0</h2>
                    <ul>
                        <li>SCAI</li>
                        <p>{t('pol2-01')}</p>
                        <li>Ethereumai</li>
                        <p>{t('pol2-02')}</p>
                        <li>{t('pol2-03')}</li>
                    </ul>				
            </div>
        </PageLayout>
        </>
    )
    }
   
    export const getStaticProps  = async ({locale }) => {
    // export const getServerSideProps  = async ({locale }) => {
    
        return {
            props: {
                messages: {
                ...require(`../messages/shared/${locale}.json`),
                ...require(`../messages/iadd/${locale}.json`),
                },locale
                ,env:getEnv()
                }
            }
        }
      
    