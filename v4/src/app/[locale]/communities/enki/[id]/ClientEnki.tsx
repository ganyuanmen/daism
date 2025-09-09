'use client';
import { useTranslations } from 'next-intl'
import MessagePage from '@/components/enki2/page/MessagePage'
import { useSelector } from 'react-redux'
import { type RootState } from '@/store/store'
import { useEffect, useState } from 'react'
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

  const loginsiwe = useSelector((state: RootState) => state.valueData.loginsiwe) ;
  const daoActor = useSelector((state: RootState) => state.valueData.daoActor ) as DaismDao[];
  const t = useTranslations('ff')
  const {isShowBtn,setIsShowBtn}=useLayout();

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
  useEffect(() => {
    if (sessionStorage.getItem('langSwitch') === '1') {
      setIsShowBtn(true);
      sessionStorage.removeItem('langSwitch'); // 用一次后清掉
    }
  }, []);

  return (<>{isShowBtn?
    <>
      <div className="mb-3 mt-3 d-flex flex-row align-items-center ">
        <EnkiAccount isShow={false} />
        {!loginsiwe && <Loginsign />}
      </div>

      {currentObj?.message_id ? (
        <>
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
        </>
      ) : (
        <ShowErrorBar errStr={t('noPostingText')} />
      )}
    </>:<Loading />
  }</>
  )
}
