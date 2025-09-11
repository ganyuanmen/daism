"use client";
import { Card, Tab, Tabs, Accordion } from "react-bootstrap";
import { useTranslations } from "next-intl";
import DaoItem from "../federation/DaoItem";
import EnkiMember from "../enki2/form/EnkiMember";
import MyFollow from "../enki2/form/MyFollow";
import FollowMe from "../enki2/form/FollowMe";
import TipToMe from "./TipToMe";
// import { useFollow, useTip } from "@/hooks/useMessageData";
import { useEffect, useState } from "react";
import { useFetch } from "@/hooks/useFetch";


interface MyInfomationProps {
  daoActor: DaismDao[];
  actor: DaismActor;
}

const MyInfomation: React.FC<MyInfomationProps> = ({ daoActor, actor }) => {
  const t = useTranslations("ff");

  // const follow0 = useFollow(actor?.actor_account, 'getFollow0');
  // const follow1 = useFollow(actor?.actor_account, 'getFollow1');
  
  const follow0 = useFetch<ActorInfo[]>(`/api/getData?account=${actor.actor_account??''}`,'getFollow0',[]);
  //useFollow(actor.actor_account!, 'getFollow0');
  const follow1 = useFetch<ActorInfo[]>(`/api/getData?account=${actor.actor_account??''}`,'getFollow1',[]);
  //useFollow(actor.actor_account!, 'getFollow1');

  const tipToMe = useFetch<DaismTipType[]>(`/api/getData?manager=${actor.manager??''}`,'getTipToMe',[]);
  // useTip(actor.manager!, 'getTipToMe');
  const tipFrom =  useFetch<DaismTipType[]>(`/api/getData?manager=${actor.manager??''}`,'getTipFrom',[]);

  
  // const tipToMe = useTip(actor?.manager, 'getTipToMe');
  // const tipFrom = useTip(actor?.manager, 'getTipFrom');
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (actor && actor.actor_account) {
      const [enkiName, domain] = actor.actor_account.split("@");
      setUrl(`https://${domain}/${enkiName}`);
    }
  }, [actor]);

  return (
    <Card className="daism-title mt-3">
      <Card.Header>
        {t("myAccount")}{" "}
        (<a className="daism-a" href={url} rel="noreferrer" target="_blank">
          {url}
        </a>)
      </Card.Header>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
        <EnkiMember url={actor.actor_url??''} account={actor.actor_account??''} manager={actor.manager} avatar={actor.avatar??''} isLocal={true} />
          {actor.dao_id??0 > 0 ? t("groupAccount") : t("selfAccount")}
        </div>

        <hr />
        <div>
          <div className="mb-2">
            <b>{t("persionInfomation")}</b>
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: actor?.actor_desc ?? "" }}
          ></div>
        </div>
        <hr />

        {actor?.dao_id === 0 && (
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <b>{t("daoGroupText")}:</b>
              </Accordion.Header>
              <Accordion.Body>
                {daoActor.map((obj) => (
                  <DaoItem key={obj.dao_id}  record={obj} />
                ))}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        )}

        <Tabs defaultActiveKey="follow0" className="mb-3 mt-3">
          <Tab
            eventKey="follow0"
            title={t("followingText", { num: follow0.data?.length??0 })}
          >
            <div>
              {follow0.data && follow0.data.map((obj) => (
                <MyFollow
                  key={obj.id}
                  followObj={obj}
                  isEdit={false}
                />
              ))}
            </div>
          </Tab>

          <Tab
            eventKey="follow1"
            title={t("followedText", { num: follow1.data?.length??0 })}
          >
            <div>
              {follow1.data && follow1.data.map((obj) => (
                <FollowMe
                  key={obj.id}
                  followObj={obj}
                  isEdit={false}
                />
              ))}
            </div>
          </Tab>

          <Tab
            eventKey="tipToMe"
            title={t("tipToMe", { num: tipToMe.data?.length??0 })}
          >
            <div>
              {tipToMe.data && tipToMe.data.map((obj) => (
                <TipToMe key={obj.id} tipObj={obj} />
              ))}
            </div>
          </Tab>

          <Tab
            eventKey="tipFrom"
            title={t("tipFrom", { num: tipFrom.data?.length??0 })}
          >
            <div>
              {tipFrom.data && tipFrom.data.map((obj) => (
                <TipToMe key={obj.id} tipObj={obj} />
              ))}
            </div>
          </Tab>
        </Tabs>
      </Card.Body>
    </Card>
  );
};

export default MyInfomation;
