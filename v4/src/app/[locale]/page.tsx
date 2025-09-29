
import { useTranslations } from 'next-intl'
// import Head from 'next/head';
import { useLocale } from 'next-intl';
import Image from 'next/image';

export default function Home() {
  
  const t = useTranslations('iadd');
  const locale: string = useLocale();

    return (<>
       
            {/* 桌面端 */}
            <div className="desktop-only">
            <Image
                src={`/topsvg_${locale === 'en' ? 'en' : 'zh'}.svg`}
                alt="PoL Civ desktop"
                width={1200} // 实际宽度
                height={400} // 实际高度
                style={{ width: '100%', height: 'auto' }}
                priority
            />
            </div>
            
             {/* 移动端 */}
            <div className="mobile-only">
            <Image
                src={`/s1_${locale === 'en' ? 'en' : 'zh'}.svg`}
                alt="PoL Civ mobile"
                width={600}
                height={300}
                style={{ width: '100%', height: 'auto' }}
            />
            </div>

            <div style={{fontSize:'1rem'}}  >
			    <h2>💓 {t('xuanyan-01')} </h2>
				<p>{t('xuanyan-02')}</p>
				<p>{t('xuanyan-025')}</p>
				<p>{t('xuanyan-03')}</p>
				<p>{t('xuanyan-04')}</p>
				<p>{t('xuanyan-05')}</p>
				<p>{t('xuanyan-06')}</p>				
				<p>{t('xuanyan-07')}</p>				
                <h2>💓 Breakthroughs of PoL 1.0</h2>
                    <p>{t('pol-01')} <a href={`https://daism.io/${locale==='zh'?'zh/':''}forge`} rel="noreferrer" target="_blank">IADD {t('networkName')}</a>{t('pol-02')}</p>
                    <ul>
                        <li>
                            <a href={`https://daism.io/${locale==='zh'?'zh/':''}forge`} rel="noreferrer" target="_blank">Smart Creative Commons 0 License(SCC0 License)</a>
                        </li>
                        <p>{t('pol-03')}</p>
                        <li><a href="https://daism.io/forge" rel="noreferrer" target="_blank">Incentive: ETH forging</a></li>
                        <p>
                            {t('pol-04')}
                            <a href={`https://daism.io/${locale==='zh'?'zh/':''}forge`} rel="noreferrer" target="_blank">{t('pol-05')}</a>
                            {t('pol-06')}
                            <a href="https://learn.daism.io/docs/whitepaper.html#ethforging" rel="noreferrer" target="_blank">DAism Whitepaper</a>.
                        </p>
                        <li><a href="https://50satoshis.com/" rel="noreferrer"  target="_blank">Incentive: 50 Satoshis</a></li>
                        <p>{t('pol-07')} </p>
                        <li><a href={`https://daism.io/${locale==='zh'?'zh/':''}communities/enki/456f17cea59f48b1a7bcd322592c73a3`} rel="noreferrer"  target="_blank">{t('pol-08')}</a></li>
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

        </>
    )
    }
   
