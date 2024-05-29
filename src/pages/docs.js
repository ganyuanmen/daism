

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl'
import PageLayout from '../components/PageLayout';

import IADDS1 from '../components/docs/iadd';
import Common1 from '../components/docs/common';
import My1 from '../components/docs/my';
import Commutis1 from '../components/docs/commutis1';




export default function Docs() {
    const [activeTab, setActiveTab] = useState(0);
    const t = useTranslations('Navigation')
    const ar=[t('iadd'),t('home'),t('my'),t('info'),t('nft'),t('profile'),]
    


    useEffect(()=>{
        let a=window.location.hash.substring(1)
        setActiveTab(parseInt(a?a:0))
    },[setActiveTab])

    return (
        <PageLayout>
            <div className="container" >
                <div className='row' >
            
                <div className="p-3 fs-5 col-md-3"  >
                {ar.map((placement, idx) => (
                            <div key={idx} >  
                                <a className={`daism-a ${activeTab===idx?'daism-mydao-menu-activedocs':''}`} href={`#${idx}`} onClick={()=>{setActiveTab(idx)}} >
                                <div className='p-2' > 
                                
                                {placement}</div>
                                </a>
                            </div>
                        ))}
                        
                </div>

                    <div className="p-5 col-md-9 " style={{borderLeft:'3px solid #AEAEAF'}} >
                    {activeTab === 0 && <IADDS1 t={t} />}
                    {activeTab === 1 && <Common1 t={t} />}
                    {activeTab === 2 && <My1 t={t} />}
                    {activeTab === 3 && <Commutis1 t={t} />}

                    </div>
               
                </div>
            </div>
         
        </PageLayout>
    )
    }

    
export const getStaticProps  = ({ req, res,locale }) => {
    return {
        props: {
            messages: {
            ...require(`../messages/shared/${locale}.json`),
            }
            }
        }
    }
  

  

  