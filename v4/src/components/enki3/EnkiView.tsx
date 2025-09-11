"use client";
import { useState, useEffect, useRef, JSX } from "react";
import Mainself from "./Mainself";
import CreateMess from "./CreateMess";
import MessagePage from "@/components/enki2/page/MessagePage";
import EnkiCreateMessage from "../enki2/page/EnkiCreateMessage";
import { useTranslations } from "next-intl";
import ActorMember from "../enki2/form/ActorMember";
import EnkiMember from "../enki2/form/EnkiMember";
import { NavDropdown } from "react-bootstrap";
import {
  Home,
  BookSvg,
  BackSvg,
  MyPost,
  ReceiveSvg,
} from "../../lib/jssvg/SvgCollection";
import MyInfomation from "./MyInfomation";
import { fetchJson } from "@/lib/utils/fetcher";
import { EnkiTotal } from "@/lib/mysql/message";

interface EnkiViewProps {
  daoActor: DaismDao[];
  actor: DaismActor;
  accountAr: AccountType[];
  notice: number;
  openWhere?: "myActor" | string;
}

export default function EnkiView({
  daoActor,
  actor,
  accountAr,
  notice,
  openWhere
}: EnkiViewProps) {

  const [fetchWhere, setFetchWhere] = useState<FetchWhere>({
    currentPageNum: 0,
    daoid: 0,
    actorid: actor?.id??0,
    account: actor?.actor_account??'',
    where: "",
    menutype: 3,
    v: 9999,
    order: "createTime",
    eventnum: openWhere === "myActor" ? 2 : 9,
  });

  const [personNum, setPersonNum] = useState<number>(0);
  const [companyNum, setCompanyNum] = useState<number>(0);
  const [receiveNum, setReceiveNum] = useState<number>(0);

  const [leftHidden, setLeftHidden] = useState<boolean>(false);
  const [currentObj, setCurrentObj] = useState<EnkiMessType | null>(null);
  const [activeTab, setActiveTab] = useState<number>(notice > 0 ? 9 : 0);

  const leftDivRef = useRef<HTMLDivElement | null>(null);
  const parentDivRef = useRef<HTMLDivElement | null>(null);

  const t = useTranslations("ff");
  const [topText, setTopText] = useState<string>(
    t("myEnkiText", { num: personNum })
  );

  // const tc = useTranslations("Common");

  const paras = {
    home: "home",
    mypost: "mypost",
    myreceive: "myreceive",
    myCompanyPost: "myCompanyPost",
  } as const;

  const svgs: Record<string, JSX.Element> = {
    home: <Home size={24} />,
    mypost: <MyPost size={24} />,
    myreceive: <ReceiveSvg size={24} />,
    myCompanyPost: <BookSvg size={24} />,
  };

  const [navIndex, setNavIndex] = useState<string>(
    notice > 0 ? paras.home : paras.mypost
  );

  // --- 数据请求 ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchJson<EnkiTotal[]>(`/api/getData?account=${actor?.actor_account}&actorid=${actor?.id}&t=${openWhere === "myActor" ? "" : "1"}`,{headers:{'x-method':'getEnkiTotal'}});
        if(!res) return;
        if (res.length) {
          setPersonNum(res[0].total);
          setCompanyNum(res[1].total);
          setReceiveNum(res[2].total);
        }
      } catch (err: any) {
        console.error(err);
      }
    };

    fetchData();
  }, [actor, openWhere]);

  // --- 监控 sidebar 显示状态 ---
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (leftDivRef?.current) {
        const style = window.getComputedStyle(leftDivRef.current);
        const display = style.getPropertyValue("display");
        setLeftHidden(display === "none");
      }
    });

    if (parentDivRef?.current) {
      resizeObserver.observe(parentDivRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // --- tab 切换 ---
  const homeHandle = () => {
    setActiveTab(4);
    setTopText(t("accountInfoText"));
    setNavIndex(paras.home);
  };

  const myPostHandle = () => {
    if (openWhere === "myActor") {
      setFetchWhere({
        ...fetchWhere,
        currentPageNum: 0,
        eventnum: 2,
        menutype: 3,
      });
    } else {
      setFetchWhere({
        ...fetchWhere,
        currentPageNum: 0,
        eventnum: 9,
        menutype: 3,
      });
    }
    setActiveTab(0);
    setTopText(t("myEnkiText", { num: personNum }));
    setNavIndex(paras.mypost);
  };

  const companyHadler = () => {
    setFetchWhere({
      ...fetchWhere,
      currentPageNum: 0,
      eventnum: 9,
      menutype: 2,
    });
    setActiveTab(0);
    setTopText(t("myCompanyEnkiText", { num: companyNum }));
    setNavIndex(paras.myCompanyPost);
  };

  const recerveHadler = () => {
    setFetchWhere({
      ...fetchWhere,
      currentPageNum: 0,
      eventnum: 4,
      menutype: 3,
    });
    setActiveTab(0);
    setTopText(t("receiveEnkiText", { num: receiveNum }));
    setNavIndex(paras.myreceive);
  };

  const afterEditCall = (messageObj: EnkiMessType) => {
    setCurrentObj(messageObj);
    setActiveTab(2);
    sessionStorage.setItem("daism-list-id", String(messageObj.id));
  };

  const callBack = () => {
    if (navIndex === paras.home) homeHandle();
    else if (navIndex === paras.mypost) myPostHandle();
    else if (navIndex === paras.myreceive) recerveHadler();
    else if (navIndex === paras.myCompanyPost) companyHadler();
  };

  const delcallBack = () => {
    callBack();
    if (navIndex === paras.mypost) setPersonNum(personNum - 1);
    else if (navIndex === paras.myreceive) setReceiveNum(receiveNum - 1);
    else if (navIndex === paras.myCompanyPost) setCompanyNum(companyNum - 1);
  };

  return (
    <div ref={parentDivRef} className="d-flex justify-content-center">
      <div ref={leftDivRef} className="scsidebar scleft">
        <div className="mb-3" style={{ overflow: "hidden" }}>
        <EnkiMember url={actor.actor_url??''} account={actor?.actor_account??''} manager={actor.manager} avatar={actor.avatar??''} isLocal={true} hw={64} />
        </div>
        <ul>
          <li className={navIndex === paras.mypost ? "scli" : ""}>
            <span onClick={myPostHandle}>
              {svgs.mypost} {t("myEnkiText", { num: personNum })}
            </span>
          </li>
          <li className={navIndex === paras.myCompanyPost ? "scli" : ""}>
            <span onClick={companyHadler}>
              {svgs.myCompanyPost} {t("myCompanyEnkiText", { num: companyNum })}
            </span>
          </li>
          <li className={navIndex === paras.myreceive ? "scli" : ""}>
            <span onClick={recerveHadler}>
              {svgs.myreceive} {t("receiveEnkiText", { num: receiveNum })}
            </span>
          </li>
          <li className={navIndex === paras.home ? "scli" : ""}>
            <span onClick={homeHandle}>
              {svgs.home} {t("accountInfoText")}
            </span>
          </li>
        </ul>
      </div>

      <div className="sccontent">
        <div className="d-flex justify-content-between align-items-center secconddiv">
          <div className="selectText" style={{ paddingLeft: "12px" }}>
            {activeTab === 2 ? (
              <span className="daism-a selectText" onClick={callBack}>
                <BackSvg size={24} />
                {t("esctext")}
              </span>
            ) : (
              <>
                {svgs[navIndex]} {topText}
              </>
            )}
          </div>
          {leftHidden && (
            <NavDropdown className="daism-a" title="...">
              <NavDropdown.Item
                className={navIndex === paras.mypost ? "scli" : ""}
              >
                <span onClick={myPostHandle}>
                  {svgs.mypost} {t("myEnkiText", { num: personNum })}
                </span>
              </NavDropdown.Item>
              <NavDropdown.Item
                className={navIndex === paras.myCompanyPost ? "scli" : ""}
              >
                <span onClick={companyHadler}>
                  {svgs.myCompanyPost}{" "}
                  {t("myCompanyEnkiText", { num: companyNum })}
                </span>
              </NavDropdown.Item>
              <NavDropdown.Item
                className={navIndex === paras.myreceive ? "scli" : ""}
              >
                <span onClick={recerveHadler}>
                  {svgs.myreceive} {t("receiveEnkiText", { num: receiveNum })}
                </span>
              </NavDropdown.Item>
              <NavDropdown.Item
                className={navIndex === paras.home ? "scli" : ""}
              >
                <span onClick={homeHandle}>
                  {svgs.home} {t("accountInfoText")}
                </span>
              </NavDropdown.Item>
            </NavDropdown>
          )}
        </div>
    
        {activeTab === 0 ? (
          <Mainself
            setCurrentObj={setCurrentObj}
            setActiveTab={setActiveTab}
            fetchWhere={fetchWhere}
            setFetchWhere={setFetchWhere}
            refreshPage={delcallBack}
            afterEditCall={afterEditCall}
            tabIndex={fetchWhere.menutype === 3 ? 1 : 3}
            path={fetchWhere.menutype === 3 ? "enkier" : "enki"}
            daoData={daoActor}

          />
        ) : activeTab === 1 ? (
          <CreateMess
            addCallBack={homeHandle}
            currentObj={currentObj}
            afterEditCall={afterEditCall}
            accountAr={accountAr}
            refreshPage={callBack}
          />
        ) : activeTab === 2 ? (
          currentObj &&
          <MessagePage
            path={fetchWhere.menutype === 3 ? "enkier" : "enki"}
            daoData={daoActor}
            enkiMessObj={currentObj}
            refreshPage={delcallBack}
            tabIndex={fetchWhere.menutype === 3 ? 1 : 3}
            setActiveTab={setActiveTab}
          />
        ) : activeTab === 3 ? (
          <EnkiCreateMessage
            daoData={daoActor}
            callBack={callBack}
            currentObj={currentObj}
            afterEditCall={afterEditCall}
            accountAr={accountAr}
          />
        ) : (
          <>
            {openWhere === "myActor" ? (
              <ActorMember notice={notice} />
            ) : (
              <MyInfomation daoActor={daoActor} actor={actor} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
