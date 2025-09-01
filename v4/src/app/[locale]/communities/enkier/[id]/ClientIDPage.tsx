"use client"
import { useTranslations } from "next-intl";
import MessagePage from "@/components/enki2/page/MessagePage";
import { useSelector } from "react-redux";
import { useState } from "react";
import EnkiAccount from "@/components/enki2/form/EnkiAccount";
import Loginsign from "@/components/Loginsign";
import CreateMess from "@/components/enki3/CreateMess";
import ShowErrorBar from "@/components/ShowErrorBar";
import { type RootState } from "@/store/store";

interface MessageProps {
  openObj: EnkiMessType|null;
  accountAr: AccountType[]; 
}

export default function ClientIDPage({ openObj, accountAr }: MessageProps) {
  
  const [activeTab, setActiveTab] = useState<number>(2);
  const [currentObj,setCurrentObj]=useState<EnkiMessType|null>(openObj)
  const loginsiwe = useSelector((state: RootState) => state.valueData.loginsiwe); 

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

  return (
    <>
      <div className="mb-3 mt-3 d-flex flex-row align-items-center ">
        <EnkiAccount isShow={false} />
        {!loginsiwe && <Loginsign />}
      </div>

      {currentObj?.message_id ? (
        <>
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
        </>
      ) : (
        <ShowErrorBar errStr={t("noPostingText")} />
      )}
    </>
  );
}
