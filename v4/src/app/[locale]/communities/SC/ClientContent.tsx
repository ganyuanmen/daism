import { useLocale, useTranslations } from 'next-intl'
import { useState, useEffect, useRef } from "react"
import { useSelector } from 'react-redux';
import EnkiMember from '@/components/enki2/form/EnkiMember';
import EnkiAccount from '@/components/enki2/form/EnkiAccount';
import Loginsign from '@/components/Loginsign';
import Loadding from '@/components/Loadding';
import { client } from '@/lib/api/client';
import EnkiCreateMessage from '@/components/enki2/page/EnkiCreateMessage';
import Mainself from '@/components/enki3/Mainself';
import MessagePage from '@/components/enki2/page/MessagePage';
import { NavDropdown, Button } from 'react-bootstrap';
import { BackSvg, TimeSvg, EventSvg } from '@/lib/jssvg/SvgCollection';
import { type RootState } from '@/store/store';


interface DaoWhere {
  currentPageNum: number;
  where: string;
}

interface DaoObject {
    dao_id?: number;
    actor_account?: string;
    avatar?: string;
    text?: string;
    isFilter?: boolean;
    svg?: React.ReactNode;
  }

interface ClientContentProps {
  accountAr: AccountType[];
  
}

/**
 * 我的社区
 */
export default function ClientContent({ accountAr }: ClientContentProps) {
  const [fetchWhere, setFetchWhere] = useState<FetchWhere>({
    currentPageNum: 0,
    daoid:0,
    actorid: 0,
    account: '',
    where: '',
    menutype: 2,
    v: 0,
    order: 'createtime',
    eventnum: 0
  });

  const [leftHidden, setLeftHidden] = useState<boolean>(false);
  const [rightHidden, setRightHidden] = useState<boolean>(false);
  const [currentObj, setCurrentObj] = useState<any>(null);
  const [daoWhere, setDaoWhere] = useState<DaoWhere>({ currentPageNum: 0, where: '' }); //dao列表
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<number>(0);

  const leftDivRef = useRef<HTMLDivElement>(null);
  const rightDivRef = useRef<HTMLDivElement>(null);
  const parentDivRef = useRef<HTMLDivElement>(null);
  
  // 使用 RootState 类型定义 useSelector
  const actor = useSelector((state: RootState) => state.valueData.actor);
  const loginsiwe = useSelector((state: RootState) => state.valueData.loginsiwe);
  const daoActor = useSelector((state: RootState) => state.valueData.daoActor) ;
  
  const locale = useLocale();
  const [daoData, setDaoData] = useState<DaoObject[]>([]);  //dao 列表数据
  const t = useTranslations('ff');
  
  const svgs:DaoObject[] = [{ svg: <TimeSvg size={24} />, text: 'latestText' }, { svg: <EventSvg size={24} />, text: 'eventText' }];
  const [navObj, setNavObj] = useState<DaoObject>(svgs[0]);

  function removeUrlParams(): void {
    setCurrentObj(null);
    window.history.replaceState({}, '', `${locale === 'en' ? '' : '/zh'}/communities/SC`);
  }

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const res = await client.get(`/api/getData?pi=${daoWhere.currentPageNum}&w=${daoWhere.where}`, 'daoPageData');
        setHasMore(res.data.length >= 10);
        if (daoWhere.currentPageNum === 0) setDaoData(res.data);
        else setDaoData([...daoData, ...res.data]);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData(); 
  }, [daoWhere]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (leftDivRef.current) {
        const style = window.getComputedStyle(leftDivRef.current);
        const display = style.getPropertyValue('display');
        setLeftHidden(display === 'none');
      }
      if (rightDivRef.current) {
        const style = window.getComputedStyle(rightDivRef.current);
        const display = style.getPropertyValue('display');
        setRightHidden(display === 'none');
      }
    });

    if (parentDivRef.current) {  
      resizeObserver.observe(parentDivRef.current);
    }
  
    return () => { 
      resizeObserver.disconnect();
    };
  }, []);


  
  const filterTag = (tag: string): void => {
    removeUrlParams();
    setFetchWhere({ ...fetchWhere, currentPageNum: 0, daoid: 0, order: 'reply_time', account: '', eventnum: 8, where: tag });
    setActiveTab(0);
    setNavObj({ isFilter: true, text: `# ${tag}`, dao_id: 0, actor_account: '' });
  };

  const latestHandle = (): void => {
    removeUrlParams();
    setFetchWhere({ ...fetchWhere, currentPageNum: 0, daoid: 0, order: 'reply_time', account: '', eventnum: 0, where: '' });
    setActiveTab(0);
    setNavObj(svgs[0]);
  };

  const eventHandle = (): void => {
    removeUrlParams();
    setFetchWhere({ ...fetchWhere, currentPageNum: 0, daoid: 0, order: 'createtime', account: '', eventnum: 1, where: '' });
    setActiveTab(0);
    setNavObj(svgs[1]);
  };

  const daoSelectHandle = (obj: DaoObject): void => {
    setFetchWhere({ ...fetchWhere, currentPageNum: 0, order: 'createtime', eventnum: 0, where: '', v: 0, daoid: obj?.dao_id??0, account: obj?.actor_account??'' });
    setActiveTab(0);
    setNavObj(obj);
    window.history.replaceState({}, '', `${locale === 'en' ? '' : '/zh'}/communities/SC?d=${obj.actor_account}`);
  };

  const callBack = (): void => {
    if (navObj?.text === 'latestText') latestHandle();
    else if (navObj?.text === 'eventText') eventHandle();
    else if (navObj) daoSelectHandle(navObj);
  };
  
  const afterEditCall = (messageObj: any): void => {
    setCurrentObj(messageObj);
    setActiveTab(2);
    sessionStorage.setItem("daism-list-id", messageObj.id);
    if (messageObj.actor_account.split('@')[1] === process.env.NEXT_PUBLIC_DOMAIN) {
      window.history.replaceState({}, '', `${locale === 'en' ? '' : '/zh'}/communities/enki/${messageObj.message_id}`);
    }
  };

  return (
    <>
      <div ref={parentDivRef} className='d-flex justify-content-center'>
        <div ref={leftDivRef} className='scsidebar scleft'>
          <div className='mb-3' style={{ overflow: 'hidden' }}>
            {actor?.actor_account ? <EnkiMember url={actor.actor_url} account={actor.actor_account} avatar={actor.avatar} isLocal={true} hw={64} /> : 
            <EnkiAccount  />}
            {!loginsiwe && <Loginsign />}
          </div>
          <ul>
            {rightHidden && <>
                <li className={navObj?.text === 'latestText' ? 'scli' : ''}>
                <span onClick={() => latestHandle()}>{svgs[0].svg} {t('latestText')}</span>
                </li>
                <li className={navObj?.text === 'eventText' ? 'scli' : ''}>
                    <span onClick={() => eventHandle()}>{svgs[1].svg} {t('eventText')}</span>
                </li>
            </>
            }
            {daoData.map((obj) => (
              <li key={obj.dao_id} className={navObj?.dao_id === obj.dao_id ? 'scli' : ''}>
                <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }} onClick={() => daoSelectHandle(obj)}>
                  <img src={obj.avatar} alt={obj.actor_account} height={24} width={24} />{' '}
                  {obj.actor_account}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 mb-3" style={{ textAlign: 'center' }}>
            {isLoading ? <Loadding /> : 
              hasMore && <Button onClick={() => setDaoWhere({ ...daoWhere, currentPageNum: daoWhere.currentPageNum + 1 })} variant='light'>fetch more ...</Button>
            }
          </div>
        </div>
        
        <div className='sccontent'>
          {Array.isArray(daoData) && daoData.length > 0 && (
            <>
              <div className='d-flex justify-content-between align-items-center secconddiv'>
                <div className='selectText' style={{ paddingLeft: '12px' }}>
                  {activeTab === 2 ? (
                    <span className='daism-a selectText' onClick={callBack}>
                      <BackSvg size={24} /> {t('esctext')}
                    </span>
                  ) : (
                    <>
                      {navObj?.isFilter ? '' : navObj?.svg ? navObj.svg : <img src={navObj?.avatar} alt={navObj?.actor_account} height={24} width={24} />}
                      {' '}
                      {navObj?.isFilter ? navObj.text : navObj?.text ? t(navObj.text) : navObj?.actor_account}
                    </>
                  )}
                </div>
                
                {leftHidden && (
                  <NavDropdown title="...">
                    <NavDropdown.Item className={navObj?.text === 'latestText' ? 'scli' : ''}>
                      <span onClick={() => latestHandle()}>{svgs[0].svg} {t('latestText')}</span>
                    </NavDropdown.Item>
                    <NavDropdown.Item className={navObj?.text === 'eventText' ? 'scli' : ''}>
                      <span onClick={() => eventHandle()}>{svgs[1].svg} {t('eventText')}</span>
                    </NavDropdown.Item>
                    {daoData.map((obj, idx) => (
                      <NavDropdown.Item key={`${obj.dao_id}_${idx}`} className={navObj?.dao_id === obj.dao_id ? 'scli' : ''}>
                        <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }} onClick={() => daoSelectHandle(obj)}>
                          <img src={obj.avatar} alt={obj.actor_account} height={24} width={24} />{' '}
                          {obj.actor_account}
                        </span>
                      </NavDropdown.Item>
                    ))}
                  </NavDropdown>
                )}
              </div>
           
              {activeTab === 0 ? (
                <Mainself 
                  setCurrentObj={setCurrentObj} 
                  setActiveTab={setActiveTab} 
                  fetchWhere={fetchWhere} 
                  filterTag={filterTag} 
                  tabIndex={1}
                  setFetchWhere={setFetchWhere} 
                  refreshPage={callBack} 
                  afterEditCall={afterEditCall} 
                  path='SC' 
                  daoData={daoActor}

                />
              ) : activeTab === 1 ? (
                <EnkiCreateMessage 
                  daoData={daoActor} 
                  callBack={callBack}
                  currentObj={currentObj} 
                  afterEditCall={afterEditCall} 
                  accountAr={accountAr}
                />
              ) : activeTab === 2 && (
                <MessagePage 
                  path="SC" 
                  enkiMessObj={currentObj} 
                  tabIndex={1}
                  refreshPage={callBack} 
                  setActiveTab={setActiveTab} 
                  daoData={daoActor} 
                  filterTag={filterTag} 
                />
              )}
            </>
          )}
        </div>
        
        <div ref={rightDivRef} className='scsidebar scright'>
          {Array.isArray(daoData) && daoData.length > 0 && (
            <ul>
                <li className={navObj?.text === 'latestText' ? 'scli' : ''}>
                <span onClick={() => latestHandle()}>{svgs[0].svg} {t('latestText')}</span>
                </li>
                <li className={navObj?.text === 'eventText' ? 'scli' : ''}>
                    <span onClick={() => eventHandle()}>{svgs[1].svg} {t('eventText')}</span>
                </li>
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
