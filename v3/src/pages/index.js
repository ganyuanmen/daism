
import { useTranslations } from 'next-intl'
import PageLayout from '../components/PageLayout';
import {getEnv} from '../lib/utils/getEnv'
import Head from 'next/head';

export default function Home({locale,env}) {
  
    const t = useTranslations('iadd')

    const xy={en:{x1:"41%",x2:"22%",x3:"42%",x4:"32%",x5:"38%",x6:"23%",x7:"32%",y1:"30%",y2:"35%",y3:"42%",y4:"46%",y5:"50%",y6:"54%",y7:"62%"}
    ,zh:{x1:"35%",x2:"30.5%",x3:"42%",x4:"32%",x5:"38%",x6:"34%",x7:"38%",y1:"30%",y2:"35%",y3:"42%",y4:"46%",y5:"50%",y6:"54%",y7:"62%"}}
   
    return (<>
         <Head>
         <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
        <meta http-equiv="x-dns-prefetch-control" content="on" />
        <meta name="robots" content="index, follow, noodp" />
        <title>Satoshi UTO Fund, 50Satoshis Bounty, SufAIthon - All about Satoshi UTO Fund</title>
        <meta name="keywords" lang="en" content="Satoshi UTO Fund, SUF, 50Satoshis Bounty, SufAIthon" />
        <meta name="keywords" lang="zh-cmn-Hans" content="中本聪UTO基金,Satoshi UTO Fund,SUF,五十个中本聪赏金,速发赛,SufAItho" />
        <meta name="description" lang="en" content="Brief Introduction of Satoshi UTO Fund, including total amount of UTO, address of its smart contract, forged time. Introduction of 50Satoshis Bounty. Introduction of SUF Development Event 'SufAIthon'" />
        <meta name="description" lang="zh-cmn-Hans" content="Satoshi UTO Fund的简介,包括其UTO代币总量、智能合约查询地址、锻造时间。五十个中本聪 赏金活动的简介。ETH锻造奖励。中本聪UTO基金速发赛邀请函。"/>

        </Head>

        <PageLayout env={env} >
           
	<div className="topsvg" >
		<svg version="1.1" id="50smemo" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1851 1668" style={{enableBackground:'new'}} xmlSpace="preserve">
			<g id="250s">
				<use href="#50s" x="-3" y="0" className="st1" />
					<g id="50s">
						<ellipse cx="892" cy="273" rx="24" ry="21" />
						<path d="m842.623,341.692l9.293,-0.866c2.271,-48.358 77.098,-47.683 78.402,1.042c4.025,0.418 2.359,0.228 9.314,1.088c0.852,-61.579 -96.926,-63.751 -97.009,-1.264z" />
						<ellipse cx="891" cy="330" rx="28" ry="38" />
						<rect x="876" y="350" width="9" height="63.5" />
						<rect x="896" y="350" width="9" height="63.5" />
					</g>
			</g>
			<use href="#50s" className="st2" />
			<use href="#250s" x="70" y="0" className="st2" />
			<use href="#250s" x="-150" y="-760" transform="rotate(45)" className="st5" />
			<use href="#250s" x="-154" y="-540" transform="rotate(28)" className="st3" />
			<use href="#250s" x="-222" y="-368" transform="rotate(14)" className="st4" />
			<use href="#250s" x="-328" y="-236" transform="rotate(2)" className="st5" />
			<use href="#250s" x="-466" y="-124" transform="rotate(-11)" className="st2" />
			<use href="#250s" x="-625" y="-40" transform="rotate(-25)" className="st3" />
			<use href="#250s" x="-794" y="0" transform="rotate(-38)" className="st4" />
			<use href="#250s" x="-976" y="-1" transform="rotate(-52)" className="st5" />
			<use href="#250s" x="-1175" y="-60" transform="rotate(-70)" className="st2" />
			<use href="#250s" x="-1314" y="-130" transform="rotate(-80)" className="st3" />
			<use href="#250s" x="-1446" y="-216" transform="rotate(-90)" className="st4" />
			<use href="#250s" x="-1554" y="-318" transform="rotate(-100)" className="st5" />
			<use href="#250s" x="-1642" y="-464" transform="rotate(-112)" className="st2" />
			<use href="#250s" x="-1726" y="-550" transform="rotate(-118)" className="st3" />
			<use href="#250s" x="-1790" y="-654" transform="rotate(-125)" className="st4" />
			<use href="#250s" x="-1854" y="-740" transform="rotate(-130)" className="st5" />
			<use href="#250s" x="-1916" y="-831" transform="rotate(-135)" className="st2" />
			<use href="#250s" x="-2014" y="-837" transform="rotate(-135)" className="st3" />
			<use href="#250s" x="-2107" y="-858" transform="rotate(-136)" className="st4" />
			<use href="#250s" x="-2174" y="-924" transform="rotate(-139)" className="st5" />
			<use href="#250s" x="-2253" y="-975" transform="rotate(-141)" className="st2" />
			<use href="#250s" x="-2340" y="-1002" transform="rotate(-142)" className="st3" />
			<use href="#250s" x="-2414" y="-1058" transform="rotate(-144)" className="st4" />
			<use href="#250s" x="-896" y="-2148" transform="rotate(148)" className="st2" />
			<use href="#250s" x="-2427" y="-1220" transform="rotate(-150)" className="st5" />
			<use href="#250s" x="-732" y="-2144" transform="rotate(140)" className="st3" />
			<use href="#250s" x="-830" y="-2144" transform="rotate(140)" className="st4" />
			<use href="#250s" x="-866" y="-2144" transform="rotate(138)" className="st5" />
			<use href="#250s" x="-970" y="-2144" transform="rotate(138)" className="st2" />
			<use href="#250s" x="-1068" y="-2144" transform="rotate(138)" className="st3" />
			<use href="#250s" x="-1038" y="-2152" transform="rotate(134)" className="st4" />
			<use href="#250s" x="-1072" y="-2154" transform="rotate(132)" className="st5" />
			<use href="#250s" x="-1050" y="-2164" transform="rotate(128)" className="st2" />
			<use href="#250s" x="-988" y="-2176" transform="rotate(123)" className="st3" />
			<use href="#250s" x="-990" y="-2178" transform="rotate(120)" className="st4" />
			<use href="#250s" x="-862" y="-2182" transform="rotate(113)" className="st5" />
			<use href="#250s" x="-610" y="-2150" transform="rotate(102)" className="st2" />
			<use href="#250s" x="-400" y="-2084" transform="rotate(92)" className="st3" />
			<use href="#250s" x="-90" y="-1926" transform="rotate(78)" className="st4" />
			<use href="#250s" x="128" y="-1734" transform="rotate(66)" className="st5" />
			<use href="#250s" x="374" y="-1416" transform="rotate(50)" className="st2" />
			<use href="#250s" x="528" y="-1040" transform="rotate(34)" className="st3" />
			<use href="#250s" x="546" y="-746" transform="rotate(22)" className="st4" />
			<use href="#250s" x="494" y="-524" transform="rotate(13)" className="st5" />
			<use href="#250s" x="404" y="-262" transform="rotate(2)" className="st2" />
			<use href="#250s" x="236" y="78" transform="rotate(-14)" className="st3" />
			<use href="#250s" x="8" y="325" transform="rotate(-28)" className="st4" />
			<use href="#250s" x="-292" y="524" transform="rotate(-43)" className="st5" />
			<text x={xy[locale].x1} y={xy[locale].y1} className="sufb"><a href="https://learn.daism.io/docs/pov.html" fill="#D44117" target="_blank">{t('pov')}</a></text>
			<text x={xy[locale].x2} y={xy[locale].y2} className="suft">{t('suf')}</text>
			<text x={xy[locale].x3} y={xy[locale].y3} className="suft"><a href="https://etherscan.io/token/0xe40b05570d2760102c59bf4ffc9b47f921b67a1f" fill="#F2A438" target="_blank">Satoshi UTO Fund</a></text>
			<text x={xy[locale].x4} y={xy[locale].y4} className="suft">{t('utoValue')}</text>
			<text x={xy[locale].x5} y={xy[locale].y5} className="suft4"><a href="https://learn.daism.io/docs/whitepaper.html#scc0-license" fill="#F2A438" target="_blank">Smart Creative Commons 0</a></text>
			<text x={xy[locale].x6} y={xy[locale].y6} className="suft2">{t('scc0')}</text>
			<text x={xy[locale].x7} y={xy[locale].y7} className="suft4"><a href="https://daism.io/communities/enkier" fill="green">{t('enkier')}</a></text>
		</svg>
        </div>
        <div style={{fontSize:'1.2rem'}}  >
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
      
    