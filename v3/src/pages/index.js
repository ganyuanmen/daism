
import { useTranslations } from 'next-intl'
import PageLayout from '../components/PageLayout';
import {getEnv} from '../lib/utils/getEnv'
import Head from 'next/head';
import { useRef, useEffect } from 'react';
export default function Home({locale,env}) {
  
    const t = useTranslations('iadd')

    const objectRef1 = useRef(null);
    const objectRef2 = useRef(null);

  useEffect(() => {
    const handleObjectLoad1 = () => {
      const svgDoc = objectRef1.current.contentDocument;
      if (svgDoc) {
        const links = svgDoc.querySelectorAll('.daism-svg');

        links.forEach(link => {
          link.addEventListener('click', (event) => {
            event.preventDefault();
            const url = link.getAttribute('data-href');
            if (url) {
              window.open(url, '_blank');
            }
          });
        });
      }
    };
    const handleObjectLoad2 = () => {
        const svgDoc = objectRef2.current.contentDocument;
        if (svgDoc) {
          const links = svgDoc.querySelectorAll('.daism-svg');
  
          links.forEach(link => {
            link.addEventListener('click', (event) => {
              event.preventDefault();
              const url = link.getAttribute('data-href');
              if (url) {
                window.open(url, '_blank');
              }
            });
          });
        }
      };

    const currentObject1 = objectRef1.current;
    currentObject1.addEventListener('load', handleObjectLoad1);

    const currentObject2 = objectRef2.current;
    currentObject2.addEventListener('load', handleObjectLoad2);

    return () => {
      currentObject1.removeEventListener('load', handleObjectLoad1);
      currentObject2.removeEventListener('load', handleObjectLoad2);
    };
  }, []);

    return (<>
         <Head>
         <meta charSet="utf-8"/>
		 <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        <meta name="robots" content="index, follow, noodp" />
        <title>Satoshi UTO Fund, 50Satoshis Bounty, SufAIthon - All about Satoshi UTO Fund</title>
        <meta name="keywords" lang="en" content="Satoshi UTO Fund, SUF, 50Satoshis Bounty, SufAIthon" />
        <meta name="keywords" lang="zh-cmn-Hans" content="中本聪UTO基金,Satoshi UTO Fund,SUF,五十个中本聪赏金,速发赛,SufAItho" />
        <meta name="description" lang="en" content="Brief Introduction of Satoshi UTO Fund, including total amount of UTO, address of its smart contract, forged time. Introduction of 50Satoshis Bounty. Introduction of SUF Development Event 'SufAIthon'" />
        <meta name="description" lang="zh-cmn-Hans" content="Satoshi UTO Fund的简介,包括其UTO代币总量、智能合约查询地址、锻造时间。五十个中本聪 赏金活动的简介。ETH锻造奖励。中本聪UTO基金速发赛邀请函。"/>

        </Head>

        <PageLayout env={env} >
       
        <div className="desktop-only"><object ref={objectRef1} type="image/svg+xml" style={{width:'100%'}} data={`/topsvg_${locale==='en'?'en':'zh'}.svg`}></object> </div>
        <div className="mobile-only"><object ref={objectRef2} type="image/svg+xml" style={{width:'100%'}} data={`/s1_${locale==='en'?'en':'zh'}.svg`}></object></div>
		
        

        <div style={{fontSize:'1rem'}}  >
            <h2>💓 Breakthroughs of PoV 1.0</h2>
                <p>{t('top1')} <a href={`https://daism.io/${locale==='zh'?'zh/':''}deval`}  target="_blank">IADD {t('networkName')}</a>. {t('top2')}</p>
                <ul>
                    <li>
                        <a href="https://learn.daism.io/docs/whitepaper.html#scc0-license" fill="#F2A438" target="_blank">
                        Smart Creative Commons 0 (SCC0)
                        </a>
                    </li>
                    <p>{t('top3')}</p>
                    <li><a href="https://daism.io/deval"  target="_blank">Incentive: ETH forging</a></li>
                    <p>
                        {t('top4')}
                        <a href={`https://daism.io/${locale==='zh'?'zh/':''}deval`}  target="_blank">{t('top5')}</a>
                        {t('top6')}
                        <a href="https://learn.daism.io/docs/whitepaper.html#ethforging" target="_blank">DAism Whitepaper</a>.
                     </p>
                    <li><a href="https://50satoshis.com/"  target="_blank">Incentive: 50 Satoshis</a></li>

                    <p>{t('top7')} </p>
                    <li>{t('top8')}</li>
                </ul>
                <h2>💓 Ongoing of PoV 2.0</h2>
                <ul>
                    <li>SCAI</li>
                    <p>{t('top9')}</p>
                    <li>Ethereumai</li>
                    <p>{t('top10')}</p>
                    <li>{t('top8')}</li>
                </ul>				
	    </div>


        </PageLayout>
        </>
    )
    }
   
    export const getServerSideProps  = async ({locale }) => {
    
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
      
    