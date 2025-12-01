"use client";

import { Alert } from "react-bootstrap";
import { useSelector } from "react-redux";
import ShowErrorBar from "@/components/ShowErrorBar";
import { type RootState } from "@/store/store";
import { useTranslations } from "next-intl";
import Wecome from "@/components/federation/Wecome";
import EnKiRigester from "@/components/enki2/form/EnKiRigester";
import EnkiView from "@/components/enki3/EnkiView";
import { useSearchParams } from "next/navigation";
import { useLayout } from "@/contexts/LayoutContext";
import Loading from "@/components/Loadding";


// ---- Props 类型 ----
interface ClientActorProps {
    accountAr: AccountType[];
}


export default function ClientActor({ accountAr }: ClientActorProps) {
  const searchParams = useSearchParams();
  const notice =Number(searchParams?.get("notice")??0);

  const {isShowBtn}=useLayout();
  
  const user = useSelector((state: RootState) => state.valueData.user);
  const loginsiwe = useSelector((state: RootState) => state.valueData.loginsiwe);
  const tc = useTranslations("Common");
  const t = useTranslations("ff");
  const actor = useSelector((state: RootState) => state.valueData.actor);
  const daoActor = useSelector((state: RootState) => state.valueData.daoActor);
 
  return (<>{ isShowBtn?
    <div>
      {user?.connected !== 1 ? (
        <ShowErrorBar errStr={tc("noConnectText")} />
      ) : !loginsiwe ? (
        <Wecome />
      ) : (
        <>
        {actor?.actor_account && daoActor ? (
          <EnkiView  daoActor={daoActor} actor={actor} accountAr={accountAr} notice={notice} openWhere="myActor" />
        ) : (
          <div>
            {/* 未注册帐号 */}
            <Alert>{t("noregisterText")}</Alert>
            <EnKiRigester />
          </div>
        )}
      </>
      )}
    </div>:<Loading />
 } </>
  );
}
