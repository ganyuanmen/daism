
import { useSelector,useDispatch} from 'react-redux';
import { useState,useRef, useEffect } from 'react';
import { AddSvg,EditSvg,DeleteSvg,SendSvg } from '../../lib/jssvg/SvgCollection';
import DaismInputGroup from '../../components/form/DaismInputGroup';
import { useTranslations } from 'next-intl'
import Loadding from '../../components/Loadding'
import { ethers } from 'ethers';
import ShowAddress from '../../components/ShowAddress';
import ShowErrorBar from '../../components/ShowErrorBar';
import { Card,Row,Col, Button,Modal,Container } from 'react-bootstrap';
import {setTipText,setMessageText} from '../../data/valueData'
import useDaoDetail from '../../hooks/useDaoDetail';
import PageLayout from '../../components/PageLayout';
import { useRouter } from 'next/router';
import { getEnv } from '../../lib/utils/getEnv';
import LogoPro from '../../components/dao/LogoPro';
import useLastPro from '../../hooks/useLastPro';
import DaismTextarea from '../../components/form/DaismTextarea';
import ConfirmWin from '../../components/federation/ConfirmWin';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import useGetVersion from '../../hooks/useGetVersion';
import Head from 'next/head';

/**
 * 指定id 某个智能公器信息
 */
export default function DaoDetail({locale,env}) {
    const { query } = useRouter()
    const daoid=query.id
    const [refresh,setRefresh]=useState(true)
    const daoData=useDaoDetail({daoid})
    const user = useSelector((state) => state.valueData.user)
    const lastPro=useLastPro(daoid,user.account,refresh,setRefresh)  
    const t = useTranslations('dao')
    const tc = useTranslations('Common')
   
    return ( <>
        <Head>
            <title>{tc('smartcommonsTitle',{name:daoData?.data[0]?.dao_symbol})}</title>
        </Head>
        <PageLayout env={env}>
            {daoData.data.length?<> 
                  <DaoInfo record={daoData.data[0]} user={user} daoid={daoid} lastPro={lastPro} setRefresh={setRefresh} /> 
            </>
            :daoData.status==='failed'?<ShowErrorBar errStr={daoData.error} />
            :daoData.status==='succeeded' ? <ShowErrorBar errStr={tc('noDataText')}  />
            :<Loadding />
            }   
        </PageLayout>
        </>
    );
}

const bStyle={borderBottom:'1px solid gray'}

function DaoInfo({record,daoid,user,lastPro,setRefresh})
{
    const t = useTranslations('dao')
    const tc = useTranslations('Common')
    const [show,setShow]=useState(false) // add member window
    const [showmodify,setShowmodify]=useState(false)  //modify window
    const [updateCreator,setUpdateCreator]=useState(false) //set updateCreator window
    const [changeLogo,setChangeLogo]=useState(false) //change Logo window
    const [changeDesc,setChangeDesc]=useState(false) //change desc window
    const [changeManager,setChangeManager]=useState(false) //change manager window
    const [changeStrategy,setChangeStrategy]=useState(false) //change Strategy window
    const [showDel,setShowDel]=useState(false) //show del confirm
    const [showType,setShowType]=useState(false) //类型修改窗口
    const [divdend,setDivdend] =useState('0') //可领取的奖励
    // const [logo,setLogo]=useState(record.dao_logo)
    const [ismember,setIsmember]=useState(false) //是否为成员

    const versionData =useGetVersion(daoid) 
    
    const dispatch = useDispatch();
    function showError(str){dispatch(setMessageText(str))}
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    const memberAddressRef=useRef()
    const voteRef=useRef()
    const modifyVoteRef=useRef()
    const modifyAccountRef=useRef()
    const descRef=useRef()
    const managerRef=useRef()
    const strategyRef=useRef()
    const delMemberRef=useRef()
    const updateRef=useRef()
    const typeRef=useRef()

    useEffect(()=>{
        let _is=record.child.find((obj)=>{return obj.member_address.toLowerCase()===user.account.toLowerCase()})
        setIsmember(!!_is)
        
    },[record,user])

  
    useEffect( () => {
        let ignore = false;
        if(user.connected===1 &&  window.daismDaoapi)
        window.daismDaoapi.Dao.dividend(record.delegator,user.account).then((e) => {
            if(!ignore)  setDivdend(parseFloat(ethers.formatUnits(e,8)).toFixed(4))
          }
        );
        
        return () => {ignore = true}
    
}, [user]);
     
    const checkAddress = (v) => {
        return /^0x[0-9,a-f,A-F]{40}$/.test(v);
    }; 

   //增加成员
   const add=()=>{
        let _address=memberAddressRef.current.getData()
        if (!checkAddress(_address)) {
            memberAddressRef.current.notValid(t('managerAddressValid'))
          return
        }

        let _vote=parseInt(voteRef.current.getData())
        if (isNaN(_vote) || _vote <1 ) {
            voteRef.current.notValid(t('voteErr'))
          return
        }

        // if ( _vote <4 ) {
        //     voteRef.current.notValid(t('noVote'))
        //   return
        // }

        let _member=record.child.find((obj)=>{return obj.member_address.toLowerCase()===_address.toLowerCase()})
        if(_member) {
            memberAddressRef.current.notValid(t('alreadyMember'))
            return
        }
        setShow(false)
        upPro(_address,_vote,'',9) 

    }
 
    //修改成员奖励权
    const modify=()=>{
        let _vote=parseInt(modifyVoteRef.current.getData())
        if (isNaN(_vote) || _vote <1 ) {
            modifyVoteRef.current.notValid(t('voteErr'))
          return
        }

        // if ( _vote <4 ) {
        //     modifyVoteRef.current.notValid(t('noVote'))
        //   return
        // }
        setShowmodify(false)
        upPro(modifyAccountRef.current.innerHTML,_vote,'',9) 
       
    }

    //删除成员
   const delMember=()=>{
        setShowDel(false)
        upPro(delMemberRef.current,0,'',9) 
    }

    //修改dao描述
    const modifyDesc=()=>{
        let _desc=descRef.current.getData()
        setChangeDesc(false)
        upPro(record.dao_manager,2,_desc,2) 
    }

  
    //更新dao 成员信息
    const update=(obj)=>{
       setTimeout(() => {
        modifyAccountRef.current.innerHTML=obj.member_address;
        modifyVoteRef.current.mySetValue(obj.member_votes);
    }, 300);
    }
    
     //检查提案完成及冷却
    const checkPro=()=>{
        if(lastPro.length && lastPro[0].is_end===0) {showError(t('noComplete'));return false;}
        if(lastPro.length && lastPro[0].is_end===1 && lastPro[0].cool_time<0) {
             showError(t('noCooling'))
             return false
        }
        return true
    }

    //修改dao管理者
    const manager=()=>{
        let _address=managerRef.current.getData()
        if (!checkAddress(_address)) {managerRef.current.notValid(t('managerAddressValid'));return;}
        let _member=record.child.find((obj)=>{return obj.member_address.toLowerCase()===_address.toLowerCase()})
        if(!_member) {managerRef.current.notValid(t('onlyMemberText'));return;}
        if(_address.toLowerCase()===record.dao_manager.toLowerCase()) {managerRef.current.notValid(t('alreadyManagerText'));return;}
        setChangeManager(false)
        upPro(_address,3,'',3) 
    }
      //修改类型
    const typeEdit=()=>{
        let _type=typeRef.current.getData()
        if(!_type) {typeRef.current.notValid(t('noEmpty'));return;}
        setShowType(false)
        upPro('0x1000000000000000000000000000000000000000',4,_type,4) 
    }

    //修改dao creator
    const creatorEdit=()=>{
        let _address=updateRef.current.getData()
        if (!checkAddress(_address)) {updateRef.current.notValid(t('managerAddressValid'));return;}
        if(_address.toLowerCase()===record.creator.toLowerCase()) {updateRef.current.notValid(t('alreadyCreatorText'));return;}
        setUpdateCreator(false)
        showTip(t('submittingText'))
        window.daismDaoapi.Register.proposeUpdate(record.dao_id,_address).then(() => {
            setTimeout(() => {closeTip();setRefresh(true);}, 1000);
        }, err => {
            console.error(err);closeTip();showError(tc('errorText')+(err.message?err.message:err));
        });
    }

    //提交提案
    const upPro=(_address,_vote,_desc,proposalType)=>{
        showTip(t('submitingProText'));
        window.daismDaoapi.Dao.addProposal(record.delegator,_address,_vote,parseInt(new Date().getTime()/1000),0,0,_desc,proposalType).then((e) => {
            closeTip()
            showError(`${t("uploadPro")}_*_`)
            setRefresh(true) //刷新提案
            }, err => {
                console.error(err);
                closeTip();
                if(err.message && err.message.includes('proposal cooling period'))  showError(t('noCooling'))
                else showError(tc('errorText')+(err.message?err.message:err));
            }
            );
    }

    //修改策略
    const strategy=()=>{
        let _vote=parseInt(strategyRef.current.getData())
        if (isNaN(_vote) || _vote <0 || _vote>100 ) {strategyRef.current.notValid(t('passRateText'));return;}
        setChangeStrategy(false)
        upPro('0x0000000000000000000000000000000000000000',parseInt(655.35*_vote),'',0) 
    }

    
    //获取奖励权
    const getDivdend=async ()=>{
        if(parseFloat(divdend)===0)
        {
            showError(t('currentAmount'))
            return
        }
        showTip(t('getDivdending')); 
        window.daismDaoapi.Dao.getDividend(record.delegator,user.account).then(() => {
            closeTip()
            showError(`${t('divdendComplete')}_*_`)
            setDivdend('0')
          }, err => {
              console.error(err);closeTip();
              showError(tc('errorText')+(err.message?err.message:err));
          }
        );
    }
    const popover = (
        <Popover >
          <Popover.Header as="h3">{t('upgradeText')}</Popover.Header>
          <Popover.Body  >
         {versionData?.data?.map((obj,idx)=>(
             <div key={idx} className='mb-2' style={{borderBottom:'1px solid gray'}}  >
                    <div>{t('dateText')}: {obj._time}</div>
                    <div>{t('addressText')}: <ShowAddress  address={obj.creator} /></div>
                    <div>{t('lastVersion')}: {obj.dao_version}</div>
            </div>
          ))}
          
          </Popover.Body>
        </Popover>
      );
      
    return <>
   
            <Card className='daism-title mt-3'>
            <Card.Header> Smart Commons {t('infoText')}</Card.Header>
            <Card.Body>

            <div className='mb-3 p-1' style={bStyle} >
                <img height={32} width={32} alt='' src={record.dao_logo?record.dao_logo:'/logo.svg'} style={{borderRadius:'50%'}} />{'  '}
                <b>{record.dao_name}({record.dao_symbol})</b> {'  '}
                {ismember && <Button  style={{marginLeft:30}} variant="primary" onClick={e=>{setChangeLogo(true)}} >{t('logoChangeText')}</Button>}
            </div>

           {record.sctype=='dapp' && <div className='mb-3 p-1' style={bStyle}  >
                {t('execText')}:<ShowAddress  address={record.creator} />  {'  '} 
                {ismember &&  user.account.toLowerCase()===record.dao_manager.toLowerCase() &&
                    <Button  style={{marginLeft:30}} onClick={e=>{  setUpdateCreator(true);}}  variant='primary'> <EditSvg size={16} /> {t('updateText')}</Button>
                }{'  '} 
                <OverlayTrigger trigger="click" placement="bottom" overlay={popover}  >
                     <Button variant="success">{t('versionText')}</Button>
                 </OverlayTrigger>
            </div>
            }

            <div className='mb-3 p-1' style={bStyle} >
                {t('managerText')}:<ShowAddress  address={record.dao_manager} />  {'  '} 
                {ismember && <Button  style={{marginLeft:30}} onClick={e=>{if(checkPro())  setChangeManager(true);}}  variant='primary'> <EditSvg size={16} /> {t('updateManagerText')}</Button>}
           </div>

            <div className='mb-3 p-1'  style={bStyle}>
               <b>{t('descText')}:</b>  {'  '} 
                {ismember && 
                    <Button style={{marginLeft:30}}  onClick={e=>{
                            if(checkPro())  setChangeDesc(true);
                            }}  variant='primary'> <EditSvg size={16} /> {t('changeDescText')} 
                    </Button>
                }
                <p className='mt-3' >{record.dao_desc}</p>
            </div>
          

            <div className='mb-3 p-1' style={bStyle} >
               <b>{t('proStrategyText')}:</b> {'  '} (<span>{t('voteRateText')}:</span> {record.strategy} %)
                {ismember && <Button  style={{marginLeft:30}} onClick={e=>{
                            if(checkPro())  setChangeStrategy(true);
                            }}  variant='primary'> <EditSvg size={16} /> {t('changeStrategyText')} 
                    </Button>
                }
            </div>
        
            { ismember && <div className='mb-3 p-1' style={bStyle}> {/*  当前奖励 */}
                <b>{t('currentDividend')}:</b> {'  '}(<span>Utoken :</span> {divdend})
                <Button  style={{marginLeft:30}} onClick={getDivdend}  variant='primary'> <EditSvg size={16} /> {t('obtainDividends')} </Button>
                </div>
            }
            <div className='mb-3 p-1' style={bStyle} >
               <b>{t('typeName')}:</b> {'  '} ({record.sctype})
                {ismember && <Button  style={{marginLeft:30}} onClick={e=>{setShowType(true)}}  variant='primary'> <EditSvg size={16} /> {t('editTypeText')}
                    </Button>
                }
            </div>

            <div className='mb-3 p-1'  style={bStyle}>
              <span>{t('proLifeTime')} :</span> {record.lifetime/(24*3600)} {t('days')} 
              <span style={{marginLeft:30}} >{t('proCoolTime')} :</span> {record.cool_time/(24*3600)} {t('days')}  
            </div>


            <div className='mb-3 p-1' >
                <b>{t('daoMemberText')}:</b>
                {ismember && <Button style={{marginLeft:30}} onClick={()=>{
                            if(checkPro())  setShow(true);
                            }}  variant='primary'> <AddSvg size={16} /> {t('addMember')} 
                    </Button>

                }
            </div>

          
            {
                record?.child?.map((obj,idx)=>(
                <Row key={idx}  className='mb-3 p-1' style={bStyle} >
                    <Col><ShowAddress address={obj.member_address}  /> </Col>
                    <Col>{t('memberVoteText')}:{obj.member_votes}</Col>
                    <Col>
                      <b style={{display:'inline-block',width:'90px'}} >{record.dao_manager.toLowerCase()===obj.member_address.toLowerCase()?t('managerText'):parseInt(obj.member_type)===1?t('originMember'):t('invitMember')}</b>
                     {'   '} 
                     { parseInt(obj.member_type)===1 && ismember && 
                        <><Button onClick={e=>{
                           if(checkPro()) {
                                setShowmodify(true);
                                update(obj);
                            }
                            }} size='sm' variant='primary'> <EditSvg size={16} /> {t('updateText')} </Button> {'   '}
                        {record.dao_manager.toLowerCase()!==obj.member_address.toLowerCase() && <Button onClick={e=>{
                                if(checkPro()) {
                                    setShowDel(true)
                                    delMemberRef.current=obj.member_address
                                }
                            }
                            }
                            size='sm' variant='danger'><DeleteSvg size={16} />  {t('delText')} </Button>
                        }
                        </>
                     }
                    </Col>
                </Row>
                ))
            }
            
            </Card.Body>
            </Card>
            <Modal  className='daism-title' show={show} onHide={(e) => {setShow(false)}} >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <DaismInputGroup title={t('memberAddress')} ref={memberAddressRef} defaultValue={user.account} ></DaismInputGroup>
                    <DaismInputGroup title={t('memberVoteText')} ref={voteRef} defaultValue={10} ></DaismInputGroup>
                    <div style={{textAlign:'center'}} >
                    <Button onClick={add} variant='primary'><SendSvg size={16} /> {t('confirm')} </Button>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal className='daism-title' show={showmodify} onHide={(e) => {setShowmodify(false)}} >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <div style={{paddingLeft:"10px"}} >{t('memberAddress')}: </div>
                    <div  style={{paddingLeft:"10px",marginBottom:"10px"}} ref={modifyAccountRef}></div>
                    <DaismInputGroup title={t('memberVoteText')} ref={modifyVoteRef} defaultValue={10} ></DaismInputGroup>
                    <div style={{textAlign:'center'}} >
                    <Button onClick={modify} variant='primary'><SendSvg size={16} /> {t('confirm')} </Button>
                    </div>
                </Modal.Body>
            </Modal>

            {/* <Modal className='daism-title' show={showSetLogo} onHide={(e) => {setShowSetLogo(false)}} >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <LogoSelect setLogo={setLogo} daoId={daoid} setShowSetLogo={setShowSetLogo}  />
                </Modal.Body>
            </Modal> */}
            <Modal className='daism-title' show={changeLogo} onHide={(e) => {setChangeLogo(false)}} >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <LogoPro  daoId={daoid} daoName={record.dao_name} setChangeLogo={setChangeLogo} delegator={record.delegator} setRefresh={setRefresh} lastPro={lastPro} />
                </Modal.Body>
            </Modal>
            <Modal className='daism-title' show={changeDesc} onHide={(e) => {setChangeDesc(false)}} >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                  
                    <DaismTextarea ref={descRef} defaultValue={record.dao_desc} title={t('daoDescText')}></DaismTextarea>    
                    {/* <RichTextEditor  defaultValue={record.dao_desc}  title={t('daoDescText')} editorRef={descRef} /> */}
                    <div style={{textAlign:'center'}} >
                    <Button onClick={modifyDesc} variant='primary'><SendSvg size={16} /> {t('confirm')} </Button>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal className='daism-title' show={changeManager} onHide={(e) => {setChangeManager(false)}} >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <DaismInputGroup title={t('newManagerText')} ref={managerRef}  ></DaismInputGroup>
                    <div style={{textAlign:'center'}} >
                    <Button onClick={manager} variant='primary'><SendSvg size={16} /> {t('confirm')} </Button>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal className='daism-title' show={showType} onHide={(e) => {setShowType(false)}} >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <DaismInputGroup title={t('typeName')} ref={typeRef}  ></DaismInputGroup>
                    <div style={{textAlign:'center'}} >
                    <Button onClick={typeEdit} variant='primary'><SendSvg size={16} /> {t('confirm')} </Button>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal className='daism-title' show={changeStrategy} onHide={(e) => {setChangeStrategy(false)}} >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                   
                    <DaismInputGroup title={`${t('voteRateText')}%(0-100)`} ref={strategyRef} defaultValue={100} ></DaismInputGroup>
                    <div style={{textAlign:'center'}} >
                    <Button onClick={strategy} variant='primary'><SendSvg size={16} /> {t('confirm')} </Button>
                    </div>
                </Modal.Body>
            </Modal>
            <ConfirmWin  show={showDel} setShow={setShowDel} question={t('delConfirmText')} callBack={delMember} />
          
            <Modal className='daism-title' show={updateCreator} onHide={(e) => {setUpdateCreator(false)}} >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <DaismInputGroup title={t('newCreatroText')} ref={updateRef}  ></DaismInputGroup>
                    <div style={{textAlign:'center'}} >
                    <Button onClick={creatorEdit} variant='primary'><SendSvg size={16} /> {t('confirm')} </Button>
                    </div>
                </Modal.Body>
            </Modal>

            </>
}



export const getServerSideProps = ({ locale }) => {
    
  
      return {
        props: {
          messages: {
            ...require(`../../messages/shared/${locale}.json`),
            ...require(`../../messages/dao/${locale}.json`),
          },locale
          ,env:getEnv()
          
        }
      }
    }
  

    
