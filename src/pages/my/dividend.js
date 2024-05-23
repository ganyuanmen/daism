import { useState } from "react";
import ShowErrorBar from "../../components/ShowErrorBar";
import Loadding from "../../components/Loadding";
import {Table} from "react-bootstrap";
import { useTranslations } from 'next-intl'
import PageItem from "../../components/PageItem";
import { useSelector } from 'react-redux';
import useGetDividend from "../../hooks/useGetDividend";
import PageLayout from '../../components/PageLayout';
import ShowAddress from '../../components/ShowAddress'

/**
 * 兑换记录
 */
export default function Dividend() {
    const t = useTranslations('my')
    const tc = useTranslations('Common')

    const user = useSelector((state) => state.valueData.user) //钱包用户信息
    
    const [currentPageNum, setCurrentPageNum] = useState(1); //当前页
    const dividendData = useGetDividend({currentPageNum,did:user.account})   

    return (
        <PageLayout>
        {user.connected<1?<ShowErrorBar errStr={tc('noConnectText')} />
        :<>
        {dividendData.rows.length?<>
                <DividendPage dividendData={dividendData}  t={t}/>
                <PageItem records={dividendData.total} pages={dividendData.pages} currentPageNum={currentPageNum} setCurrentPageNum={setCurrentPageNum} postStatus={dividendData.status} />
            </>
            :dividendData.status==='failed'?<ShowErrorBar errStr={dividendData.error} />
            :dividendData.status==='succeeded' ? <ShowErrorBar errStr={tc('noDataText')} />
            :<Loadding />
        }  
        </>
        }
        </PageLayout>
    );
    }

    function DividendPage({dividendData,t})
    {
    return  <Table striped bordered hover>
      <thead>
        <tr>
          <th style={{textAlign:'center'}} >dao info</th>
          <th style={{textAlign:'center'}}>{t('dividendAddress')}</th>
          <th style={{textAlign:'center'}}>{t('dividendAmount')}(UTO)</th>
          <th style={{textAlign:'center'}}>{t('dividendTime')}</th>
        </tr>
      </thead>
      <tbody>
      {dividendData.rows.map((obj, idx) => 
                      
            <tr key={idx}  >
            <td  >
                <img style={{borderRadius:'50%'}}  alt="" width={32} height={32} src={obj.dao_logo?obj.dao_logo:'/logo.svg'} />
                {'  '}<b>{obj.dao_name}(Valuation Token: {obj.dao_symbol})</b>
            </td>
            <td><ShowAddress address={obj.account}  /></td>
            <td style={{textAlign:'right'}}>{obj.utoken_amount} </td>
            <td>{obj._time} </td>
            </tr>
        )
        }   
      
      
      </tbody>
    </Table>

  
    }


    

export const getStaticProps = ({ req, res,locale }) => {  
    
  
    return {
      props: {
        messages: {
          ...require(`../../messages/shared/${locale}.json`),
          ...require(`../../messages/my/${locale}.json`),
        }
      }
    }
  }

    