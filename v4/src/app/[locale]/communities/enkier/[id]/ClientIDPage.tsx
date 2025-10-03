"use client"
import { useTranslations } from "next-intl";
import MessagePage from "@/components/enki2/page/MessagePage";
import { useSelector } from "react-redux";
import {  useState } from "react";
import EnkiAccount from "@/components/enki2/form/EnkiAccount";
import Loginsign from "@/components/Loginsign";
import CreateMess from "@/components/enki3/CreateMess";
import ShowErrorBar from "@/components/ShowErrorBar";
import { type RootState } from "@/store/store";
import { useLayout } from '@/contexts/LayoutContext';
import Loading from "@/components/Loadding";

interface MessageProps {
  openObj: EnkiMessType|null;
  accountAr: AccountType[]; 
}

export default function ClientIDPage({ openObj, accountAr }: MessageProps) {
  
  const [activeTab, setActiveTab] = useState<number>(2);
  const [currentObj,setCurrentObj]=useState<EnkiMessType|null>(openObj)
  const loginsiwe = useSelector((state: RootState) => state.valueData.loginsiwe); 
  const actor = useSelector((state: RootState) => state.valueData.actor)
  const {isShowBtn}=useLayout();
  const t = useTranslations("ff");

  const afterEditCall = (obj: EnkiMessType) => {
    setCurrentObj(obj);
    setActiveTab(2);
  };

  const refreshPage = (flag?: string) => {
    if (flag === "del") {
      setActiveTab(2);
      setCurrentObj(null);
    }
  };


  const geneDom=()=>{
    if(!currentObj?.message_id) return (<ShowErrorBar errStr={t("noPostingText")} />);
    if(currentObj.account_at){
      if(!loginsiwe)  return (<ShowErrorBar errStr={t("noAuthText")} />); //权限不够
      if(!actor?.actor_account) return (<ShowErrorBar errStr={t("noAuthText")} />); //权限不够
      if(currentObj.actor_account!==actor.actor_account){ //不是作者，查看是否@ 对象
        const ar=JSON.parse(currentObj.account_at);
        if(!ar.includes(actor.actor_name)) return (<ShowErrorBar errStr={t("noAuthText")} />); //权限不够
      }
    
    }

    return (<>
      {activeTab === 2 ? (
        <MessagePage
          path="enkier"
          enkiMessObj={currentObj}
          refreshPage={refreshPage}
          setActiveTab={setActiveTab}
          tabIndex={3}
        />
      ) : (
        <CreateMess
          accountAr={accountAr}
          currentObj={currentObj}
          afterEditCall={afterEditCall}
          refreshPage={() => setActiveTab(2)}
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
    </>
    :<Loading />
}</>
  );
}
