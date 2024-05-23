
import Loadding from '../../components/Loadding';
import { Card, Col, Row } from 'react-bootstrap';
import ShowErrorBar from '../../components/ShowErrorBar';
import Link from 'next/link'
import useMyTokens from '../../hooks/useMyTokens';
import { useRouter } from "next/router";

/**
 * 我的token
 */
export default function Tokens({user,t,tc}) {
  
    const tokensData = useMyTokens(user.account)
    
    return ( <>
            {tokensData.data.length?<TokensPage tokensData={tokensData} t={t}  />
            :tokensData.status==='failed'?<ShowErrorBar errStr={tokensData.error} />
            :tokensData.status==='succeeded' ? <ShowErrorBar errStr={tc('noDataText')}  />
            :<Loadding />
            }  
        </>
    );
}

function TokensPage({tokensData,t})
{
    const { locale } = useRouter()
    return <Card className='daism-title mt-2' >
            <Card.Header>{t('myTokenText')}</Card.Header>
            <Card.Body>
                {tokensData.data.map((obj,idx)=>(
                    <Row key={idx} className='mb-3 p-1'  style={{borderBottom:'1px solid gray'}} >
                        <Col>
                        <Link className='daism-a' href={`/${locale}/my/[id]`} as={`/${locale}/my/${obj.dao_id}`}>
                            <img height={32} width={32} alt='' src={obj.dao_logo?obj.dao_logo:'/logo.svg'} style={{borderRadius:'50%'}} />{'  '}<b>{obj.dao_symbol}</b>
                            </Link>
                        </Col>
                        <Col>
                            {t('tokenText')}:<b>{obj.token_cost}</b>
                        </Col>
                    </Row>
                ))
                }
            </Card.Body>
           </Card>

}