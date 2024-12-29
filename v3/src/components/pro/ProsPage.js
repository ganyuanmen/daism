import {  useState } from 'react';
import { Card, Col, Row,Button,Modal } from 'react-bootstrap';
import { EditSvg  } from "../../lib/jssvg/SvgCollection"
import { useDispatch } from 'react-redux';
import {setTipText,setMessageText} from '../../data/valueData'
import useMyPro from '../../hooks/useMyPro';
import ShowErrorBar from '../ShowErrorBar';
import Loadding from '../Loadding';
import ProDetail from './ProDetail';
import { client } from '../../lib/api/client';


export default function ProsPage({user,t,tc})
{
    const [refresh,setRefresh]=useState(true)
    const prosData = useMyPro({did:user.account,refresh,setRefresh})

    return (
        <>
        {prosData.data.length?<ProsList user={user} prosData={prosData} t={t} tc={tc} setRefresh={setRefresh} />
            :prosData.status==='failed'?<ShowErrorBar errStr={prosData.error} />
            :prosData.status==='succeeded' ? <ShowErrorBar errStr={tc('noDataText')} />
            :<Loadding />
        }  
        </>
    );
    
}


function ProsList({user,prosData,t,tc,setRefresh})
{
    const dispatch = useDispatch();
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    function showError(str){dispatch(setMessageText(str))}

    

    //投票
    const vote=async (dao_id,delegator,flag)=>{
        try {
            let res=await client.get(`/api/getData?daoid=${dao_id}&did=${user.account}`,'getLastPro');
            if(res?.data?.length){
               
                if(res.data[0].lifetime<0){
                    showError(t('passlifeTime')); 
                }else {
                    if(dao_id>3){  //第2次升级增加的功能 
                        let is_vis=await window.daismDaoapi.Dao.isVotable(delegator);
                        if(!is_vis) {
                            showError(t('noVoteText')); 
                            return;
                        }
                    }
                    showTip(t('submitVoteText')); 
                    await  window.daismDaoapi.Dao.vote(delegator,flag);
                    setRefresh(true);
                }
            }else{
                showTip(tc('dataHandleErrorText'));  
            }
        } catch (err) {
            console.error(err);
            showError(tc('errorText')+(err.message?err.message:err)); 
        }
        finally{
            closeTip()
        }
    }

  const cssType={display:'inline-block',padding:'4px'}

    return <Card className='mt-1 daism-title ' >
            <Card.Header>{t('myProText')}
            
            </Card.Header>
            <Card.Body>
                {prosData.data.map((obj,idx)=>(
                    <Row key={idx} className='mb-3 p-1'  style={{borderBottom:'1px solid gray'}} >
                        <Col><span style={cssType}>{t('proText')}</span>:<b style={cssType}>{t('proNameText').split(',')[obj.pro_type]}</b></Col>
                        <Col><span style={cssType}>{t('totalText')}</span>:<b> {obj.total_vote} </b> ({t('rights')}:<b>{obj.rights}</b> {t('antirights')}:<b>{obj.antirights}</b>)</Col>
                        <Col>
                            {obj.yvote!=="0"?<span style={cssType}>{t('votedText')}</span> //已投票
                                :<>
                                   <Button  size="sm" variant="info" onClick={()=>{vote(obj.dao_id,obj.delegator,false)}} ><EditSvg size={16} /> {t('rights')}</Button>  {'  '} 
                                   <Button  size="sm" variant="warning" onClick={()=>{vote(obj.dao_id,obj.delegator,true)}} ><EditSvg size={16} /> {t('antirights')}</Button> 
                                </>
                            }
                            <ProDetail obj={obj}  t={t} /> 
                        </Col>
                    </Row>
                ))
                }
            </Card.Body>
           </Card>
}

