'use client';
import { useTranslations } from 'next-intl'
import MessagePage from '@/components/enki2/page/MessagePage'
import { useSelector } from 'react-redux'
import { type RootState } from '@/store/store'
import {  useState } from 'react'
import EnkiAccount from '@/components/enki2/form/EnkiAccount'
import Loginsign from '@/components/Loginsign'
import EnkiCreateMessage from '@/components/enki2/page/EnkiCreateMessage'
import ShowErrorBar from '@/components/ShowErrorBar'
import { useLayout } from '@/contexts/LayoutContext';
import Loading from '@/components/Loadding';

interface ClientEnkiProps {
  openObj: EnkiMessType | null
  accountAr: AccountType[]
}

export default function ClientEnki({ openObj, accountAr }: ClientEnkiProps) {
  const [activeTab, setActiveTab] = useState<number>(2)
  const [currentObj, setCurrentObj] = useState<EnkiMessType | null>(openObj)
  const actor = useSelector((state: RootState) => state.valueData.actor)
  const loginsiwe = useSelector((state: RootState) => state.valueData.loginsiwe) ;
  const daoActor = useSelector((state: RootState) => state.valueData.daoActor ) as DaismDao[];
  const t = useTranslations('ff')
  const {isShowBtn}=useLayout();

  const callBack = () => {
    setActiveTab(2)
  }

  const afterEditCall = (obj: EnkiMessType) => {
    setCurrentObj(obj)
    setActiveTab(2)
  }

  const delCallBack = async (flag: string|undefined) => {
    if (flag === 'del') {
      setActiveTab(2)
      setCurrentObj(null)
    }
  }
 
  
  const geneDom=()=>{
    if(!currentObj?.message_id) return (<ShowErrorBar errStr={t("noPostingText")} />);
    if(currentObj.account_at){
      if(!loginsiwe)  return (<ShowErrorBar errStr={t("noAuthText")} />); //权限不够
      if(!actor?.actor_account) return (<ShowErrorBar errStr={t("noAuthText")} />); //权限不够
      if(currentObj.self_account!==actor.actor_account){ //不是作者，查看是否@ 对象
        const ar=JSON.parse(currentObj.account_at);
        if(!ar.includes(actor.actor_name)) return (<ShowErrorBar errStr={t("noAuthText")} />); //权限不够
      }
    
    }

    return ( <>
      {activeTab === 2 ? (
        <MessagePage
          path="enki"
          enkiMessObj={currentObj}
          tabIndex={3}
          refreshPage={delCallBack}
          setActiveTab={setActiveTab}
          daoData={daoActor}
        />
      ) : (
        <EnkiCreateMessage
          daoData={daoActor}
          callBack={callBack}
          currentObj={currentObj}
          afterEditCall={afterEditCall}
          accountAr={accountAr}
        />
      )}
    </>);
    

  }


  return (<>{isShowBtn?
    <>
      <div className="mb-3 mt-3 d-flex flex-row align-items-center ">
        <EnkiAccount isShow={false} />
        {!loginsiwe && <Loginsign />}
      </div>

      {geneDom()}
    </>:<Loading />
  }</>
  )
}
