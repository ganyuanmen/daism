
import ShowAddress from "../ShowAddress"
import Link from 'next/link'
import { Card } from "react-bootstrap"
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/router'

export default function DaoItem({record,user,isVist,noLink=false}){
    const t = useTranslations('ff')
    return  <Card className="mb-1 daism-title" ><div className='row p-2' >
                    <div className='col-md-6 col-sm-12 d-flex align-items-center ' >
                        <LinkImg noLink={noLink} daoid={record.dao_id}>
                            <img alt={record.dao_name} width={48} height={48} style={{borderRadius:'50%'}}   
                            src={!record.dao_logo || record.dao_logo.length<12?'/logo.svg':record.dao_logo}/>
                        </LinkImg>
                        <div style={{paddingLeft:'10px'}} >
                            <span className='daism-span'>{t('daoNameText')}:</span><span>{record.dao_name}</span><br/>
                            <span className='daism-span'>{t('daoManagerText')}:</span><ShowAddress address={record.dao_manager} ></ShowAddress>
                        </div>
                    </div>
                    <div className='col-md-6 col-sm-12 d-flex align-items-center ' >
                       
                        <div style={{paddingLeft:'10px'}} >
                            <span className='daism-span'>{t('groupAccountText')}:</span><span>{record.account}</span><br/>
                            <span className='daism-span'>{t('selfText')}:</span> 
                            {!isVist?<span>{t('daoManagerText')}</span>
                            :<span>{t('invitMember')}</span>
                            }
                        </div>


                    </div>
                </div>
            </Card>
}

function LinkImg({noLink,daoid, children})
{
    const { locale } = useRouter()

    if(noLink) return children
    else 
    return  <Link className='daism-a' href={`/${locale}/enki/daoinfo/[id]`} as={`/${locale}/enki/daoinfo/${daoid}`}>
                    {children}
            </Link>
}

