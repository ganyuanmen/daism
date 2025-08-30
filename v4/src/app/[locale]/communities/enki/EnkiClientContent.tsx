'use client';
import { useLocale, useTranslations } from 'next-intl'
import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { NavDropdown } from 'react-bootstrap'

import EnkiMember from '@/components/enki2/form/EnkiMember'
import EnkiAccount from '@/components/enki2/form/EnkiAccount'
import Loginsign from '@/components/Loginsign'
import ShowErrorBar from '@/components/ShowErrorBar'
import Mainself from '@/components/enki3/Mainself'
import MessagePage from '@/components/enki2/page/MessagePage'
import EnkiCreateMessage from '@/components/enki2/page/EnkiCreateMessage'

import { type RootState } from '@/store/store'
import {BookSvg,Heart,BackSvg,EditSvg,TimeSvg,EventSvg,MyFollowSvg} from '@/lib/jssvg/SvgCollection'


interface DaoActor {
  dao_id: number
  dao_logo: string
  dao_symbol: string
  actor_account: string
}

interface NavObj {
  svg?: React.ReactNode
  text?: string
  dao_symbol?: string
  dao_logo?: string
  actor_account?: string
  isFilter?: boolean
}

interface ClientContentProps {
  accountAr: AccountType[]
}

/**
 * 我的社区
 */
export default function EnkiClientContent({ accountAr }: ClientContentProps) {
  const [fetchWhere, setFetchWhere] = useState<FetchWhere>({
    currentPageNum: -1,
    daoid: '',
    actorid: 0,
    account: '',
    where: '',
    menutype: 1,
    v: 0,
    order: 'createtime',
    eventnum: 0
  })

  const [leftHidden, setLeftHidden] = useState(false)
  const [rightHidden, setRightHidden] = useState(false)
  const [currentObj, setCurrentObj] = useState<EnkiMessType | null>(null)
  const [activeTab, setActiveTab] = useState<number>(0)

  const actor = useSelector((state: RootState) => state.valueData.actor)

  const loginsiwe = useSelector((state: RootState) => state.valueData.loginsiwe)
  const daoActor = useSelector((state: RootState) => state.valueData.daoActor) as DaismDao[];

  const leftDivRef = useRef<HTMLDivElement>(null)
  const rightDivRef = useRef<HTMLDivElement>(null)
  const parentDivRef = useRef<HTMLDivElement>(null)
  const actorRef = useRef<DaismActor>(null)

  const [daoData, setDaoData] = useState<DaismDao[]>([])

  const t = useTranslations('ff')
  const locale = useLocale()

  function removeUrlParams() {
    setCurrentObj(null)
    window.history.replaceState(
      {},
      '',
      `${locale === 'en' ? '' : '/zh'}/communities/enki`
    )
  }

  const svgs = [
    { svg: <TimeSvg size={24} />, text: 'latestText' },
    { svg: <EventSvg size={24} />, text: 'eventText' },
    { svg: <MyFollowSvg size={24} />, text: 'followCommunity' },
    { svg: <BookSvg size={24} />, text: 'bookTapText' },
    { svg: <Heart size={24} />, text: 'likeText' },
    { svg: <EditSvg size={24} />, text: 'publishText' }
  ]

  const [navObj, setNavObj] = useState<NavObj>(svgs[0])

  useEffect(() => {if (actor?.id) actorRef.current = actor}, [actor])

    //过滤已注册
  useEffect(() => {
    console.log("daoActor:",daoActor)
    if (Array.isArray(daoActor) && daoActor.length)
        setDaoData(daoActor.filter((obj) => obj.actor_account))
  }, [daoActor])

  useEffect(() => {latestHandle()}, [daoData])

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (leftDivRef.current) {
        const style = window.getComputedStyle(leftDivRef.current)
        const display = style.getPropertyValue('display')
        setLeftHidden(display === 'none')
      }
      if (rightDivRef.current) {
        const style = window.getComputedStyle(rightDivRef.current)
        const display = style.getPropertyValue('display')
        setRightHidden(display === 'none')
      }
    })

    if (parentDivRef.current) {
      resizeObserver.observe(parentDivRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  const filterTag = (tag: string) => {
    removeUrlParams()
    setFetchWhere({
      ...fetchWhere,
      currentPageNum: 0,
      order: 'reply_time',
      v: 0,
      account: '',
      eventnum: 8,
      where: tag,
      daoid: daoData.map((item) => item.dao_id).join(',')
    })
    setActiveTab(0)
    setNavObj({ isFilter: true, text: `# ${tag}` })
  }

  const latestHandle = () => {
    removeUrlParams()
    setFetchWhere({
      ...fetchWhere,
      currentPageNum: 0,
      order: 'reply_time',
      v: 0,
      account: '',
      eventnum: 0,
      where: '',
      daoid: daoData.map((item) => item.dao_id).join(',')
    })
    setActiveTab(0)
    setNavObj(svgs[0])
  }

  const eventHandle = () => {
    removeUrlParams()
    setFetchWhere({
      ...fetchWhere,
      currentPageNum: 0,
      account: '',
      v: 0,
      eventnum: 1,
      where: '',
      daoid: daoData.map((item) => item.dao_id).join(',')
    })
    setActiveTab(0)
    setNavObj(svgs[1])
  }

  const createHandle = () => {
    removeUrlParams()
    setCurrentObj(null)
    setActiveTab(1)
    setNavObj(svgs[5])
    sessionStorage.removeItem('daism-list-id')
  }

  const myFollowHandle = () => {
    removeUrlParams()
    setFetchWhere({
      ...fetchWhere,
      currentPageNum: 0,
      account: actorRef.current?.actor_account ?? '',
      eventnum: 0,
      daoid: 0,
      v: 1,
      where: ''
    })
    setNavObj(svgs[2])
    setActiveTab(0)
  }

  const myBookHandle = () => {
    removeUrlParams()
    setFetchWhere({
      ...fetchWhere,
      currentPageNum: 0,
      account: actorRef.current?.actor_account ?? '',
      eventnum: 0,
      daoid: 0,
      v: 3,
      where: ''
    })
    setActiveTab(0)
    setNavObj(svgs[3])
  }

  const myLikeHandle = () => {
    removeUrlParams()
    setFetchWhere({
      ...fetchWhere,
      currentPageNum: 0,
      account: actorRef.current?.actor_account ?? '',
      eventnum: 0,
      daoid: 0,
      v: 6,
      where: ''
    })
    setActiveTab(0)
    setNavObj(svgs[4])
  }

  const daoSelectHandle = (obj: DaoActor) => {
    removeUrlParams()
    setFetchWhere({
      ...fetchWhere,
      currentPageNum: 0,
      where: '',
      eventnum: 0,
      v: 0,
      daoid: obj.dao_id,
      account: obj.actor_account
    })
    setActiveTab(0)
    setNavObj(obj)
  }


  const afterEditCall = (messageObj: EnkiMessType) => {
    setCurrentObj(messageObj)
    setActiveTab(2)
    sessionStorage.setItem('daism-list-id', messageObj.message_id)
    if (
      messageObj.actor_account.split('@')[1] ===
      process.env.NEXT_PUBLIC_DOMAIN
    )
      window.history.replaceState(
        {},
        '',
        `${locale === 'en' ? '' : '/zh'}/communities/enki/${messageObj.message_id}`
      )
  }

  const callBack = () => {
    if (navObj?.text === 'latestText') latestHandle()
    else if (navObj?.text === 'eventText') eventHandle()
    else if (navObj?.text === 'followCommunity') myFollowHandle()
    else if (navObj?.text === 'bookTapText') myBookHandle()
    else if (navObj?.text === 'likeText') myLikeHandle()
    else daoSelectHandle(navObj as DaoActor)
  }

  return (
    <>
      <div ref={parentDivRef} className="d-flex justify-content-center">
        {/* 左侧 */}
        <div ref={leftDivRef} className="scsidebar scleft">
          <div className="mb-3" style={{ overflow: 'hidden' }}>
            {actor?.actor_account ? (
              <EnkiMember url={actor.actor_url} account={actor.actor_account} avatar={actor.avatar} isLocal={true} hw={64}/>
            ) : (
              <EnkiAccount />
            )}
            {!loginsiwe && <Loginsign />}
          </div>
          {Array.isArray(daoData) && daoData.length > 0 ? (
            <ul>
              {loginsiwe && actor?.actor_account && (
                <>
                  <li className={navObj?.text === 'publishText' ? 'scli' : ''}>
                    <span onClick={() => createHandle()}>
                      {svgs[5].svg} {t('publishText')}
                    </span>
                  </li>
                  {rightHidden && (
                    <NavItem
                      svgs={svgs}
                      navObj={navObj}
                      t={t}
                      latestHandle={latestHandle}
                      eventHandle={eventHandle}
                      myFollowHandle={myFollowHandle}
                      myBookHandle={myBookHandle}
                      myLikeHandle={myLikeHandle}
                    />
                  )}
                  {daoData.map((obj) => (
                    <li
                      key={obj.dao_id}
                      className={
                        navObj?.dao_symbol === obj.dao_symbol ? 'scli' : ''
                      }
                    >
                      <span
                        style={{
                          display: 'inline-block',
                          whiteSpace: 'nowrap'
                        }}
                        onClick={() => daoSelectHandle(obj)}
                      >
                        <img
                          src={obj.dao_logo}
                          alt={obj.actor_account}
                          height={24}
                          width={24}
                        />{' '}
                        {obj.actor_account}
                      </span>
                    </li>
                  ))}
                </>
              )}
            </ul>
          ) : (
            loginsiwe && <ShowErrorBar errStr={t('noRegisterText')} />
          )}
        </div>

        {/* 中间内容 */}
        <div className="sccontent">
          {Array.isArray(daoData) && daoData.length > 0 && (
            <>
              <div className="d-flex justify-content-between align-items-center secconddiv">
                <div className="selectText" style={{ paddingLeft: '12px' }}>
                  {activeTab === 2 ? (
                    <span className="daism-a selectText" onClick={callBack}>
                      <BackSvg size={24} />
                      {t('esctext')}
                    </span>
                  ) : (
                    <>
                      {navObj.isFilter ? (
                        ''
                      ) : navObj?.svg ? (
                        navObj.svg
                      ) : (
                        <img
                          src={navObj.dao_logo}
                          alt={navObj.actor_account}
                          height={24}
                          width={24}
                        />
                      )}{' '}
                      {navObj.isFilter
                        ? navObj.text
                        : navObj?.text
                        ? t(navObj.text)
                        : navObj.actor_account}
                    </>
                  )}
                </div>

                {leftHidden && (
                  <NavDropdown className="daism-a" title="...">
                    {loginsiwe && actor?.actor_account ? (
                      <>
                        <NavDropdown.Item
                          className={navObj?.text === 'publishText' ? 'scli' : ''}
                        >
                          <span onClick={() => createHandle()}>
                            {svgs[5].svg} {t('publishText')}
                          </span>
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          className={navObj?.text === 'latestText' ? 'scli' : ''}
                        >
                          <span onClick={() => latestHandle()}>
                            {svgs[0].svg} {t('latestText')}
                          </span>
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          className={navObj?.text === 'eventText' ? 'scli' : ''}
                        >
                          <span onClick={() => eventHandle()}>
                            {svgs[1].svg} {t('eventText')}
                          </span>
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          className={
                            navObj?.text === 'followCommunity' ? 'scli' : ''
                          }
                        >
                          <span onClick={() => myFollowHandle()}>
                            {svgs[2].svg} {t('followCommunity')}
                          </span>
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          className={
                            navObj?.text === 'bookTapText' ? 'scli' : ''
                          }
                        >
                          <span onClick={() => myBookHandle()}>
                            {svgs[3].svg} {t('bookTapText')}
                          </span>
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          className={navObj?.text === 'likeText' ? 'scli' : ''}
                        >
                          <span onClick={() => myLikeHandle()}>
                            {svgs[4].svg} {t('likeText')}
                          </span>
                        </NavDropdown.Item>

                        {daoData.map((obj) => (
                          <NavDropdown.Item
                            key={obj.dao_id}
                            className={
                              navObj?.dao_symbol === obj.dao_symbol ? 'scli' : ''
                            }
                          >
                            <span
                              style={{
                                display: 'inline-block',
                                whiteSpace: 'nowrap'
                              }}
                              onClick={() => daoSelectHandle(obj)}
                            >
                              <img
                                src={obj.dao_logo}
                                alt={obj.actor_account}
                                height={24}
                                width={24}
                              />{' '}
                              {obj.actor_account}
                            </span>
                          </NavDropdown.Item>
                        ))}
                      </>
                    ) : (
                      <NavDropdown.Item>
                        <ShowErrorBar errStr={t('noRegisterText')} />
                      </NavDropdown.Item>
                    )}
                  </NavDropdown>
                )}
              </div>
             
              {activeTab === 0 ? (
                <Mainself
                  setCurrentObj={setCurrentObj}
                  setActiveTab={setActiveTab}
                  fetchWhere={fetchWhere}
                  setFetchWhere={setFetchWhere}
                  filterTag={filterTag}
                  refreshPage={callBack}
                  afterEditCall={afterEditCall}
                  tabIndex={1}
                  path="enki"
                  daoData={daoData}
                />
              ) : activeTab === 1 ? (
                <EnkiCreateMessage
                  daoData={daoData}
                  callBack={callBack}
                  addCallBack={latestHandle}
                  currentObj={currentObj}
                  afterEditCall={afterEditCall}
                  accountAr={accountAr}
                />
              ) : (

                activeTab === 2 && currentObj &&(
                  <MessagePage
                    path="enki"
                    enkiMessObj={currentObj}
                    refreshPage={callBack}
                    setActiveTab={setActiveTab}
                    daoData={daoData}
                    tabIndex={1}
                    filterTag={filterTag}
                  />
                )
              )}
            </>
          )}
        </div>

        {/* 右侧 */}
        <div ref={rightDivRef} className="scsidebar scright">
          {Array.isArray(daoData) && daoData.length > 0 && (
            <ul>
              {loginsiwe && actor?.actor_account && (
                <NavItem
                  svgs={svgs}
                  navObj={navObj}
                  t={t}
                  latestHandle={latestHandle}
                  eventHandle={eventHandle}
                  myFollowHandle={myFollowHandle}
                  myBookHandle={myBookHandle}
                  myLikeHandle={myLikeHandle}
                />
              )}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}

interface NavItemProps {
  svgs: { svg: React.ReactNode; text: string }[]
  navObj: NavObj
  t: (key: string) => string
  latestHandle: () => void
  eventHandle: () => void
  myFollowHandle: () => void
  myBookHandle: () => void
  myLikeHandle: () => void
}

function NavItem({
  svgs,
  navObj,
  t,
  latestHandle,
  eventHandle,
  myFollowHandle,
  myBookHandle,
  myLikeHandle
}: NavItemProps) {
    return (<>
        <li className={navObj?.text==='latestText'?'scli':''}><span onClick={()=>latestHandle()} >{svgs[0].svg} {t('latestText')}</span></li>
        <li className={navObj?.text==='eventText'?'scli':''}><span onClick={()=>eventHandle()} >{svgs[1].svg} {t('eventText')}</span></li>
        <li className={navObj?.text==='followCommunity'?'scli':''}><span onClick={()=>myFollowHandle()} >{svgs[2].svg} {t('followCommunity')}</span></li>
        <li className={navObj?.text==='bookTapText'?'scli':''}><span onClick={()=>myBookHandle()} >{svgs[3].svg} {t('bookTapText')}</span></li> 
        <li className={navObj?.text==='likeText'?'scli':''}><span onClick={()=>myLikeHandle()} >{svgs[4].svg} {t('likeText')}</span></li> 
 </>)
}
