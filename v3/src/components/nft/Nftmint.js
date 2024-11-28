
import { Button,Modal,InputGroup,Form,FormControl } from 'react-bootstrap';
import useGetDappOwner from "../../hooks/useGetDappOwner"
import { useState,useEffect } from 'react';

import {Honor} from '../../lib/jssvg/SvgCollection'


export default function Nftmint({closeTip,showTip,showError,t,tc,user})
{
    const [show, setShow] = useState(false); //mint nft 窗口
    const [tips,setTips]=useState(1)
    const [batch,setBatch]=useState(false) //是否批量
    const [addAr, setAddAr] = useState([]); 
    const [errorFirrstName, setErrorFirrstName] = useState(false) 
    const [errorFirrstVote, setErrorFirrstVote] = useState(false) 
    const [allAr,setAllAr]=useState([])
    const mynftData =useGetDappOwner(user.account) 

    useEffect(()=>{setAllAr(geneAr(true))},[tips])

    const geneAr=(fk)=>{
        let _ar=[];
        for(var i=0;i<tips;i++)
        {
            _ar.push({index:i,err:false})  
        }
        return _ar
    }



       //地址检测 0x开头40位数字字母
    const checkAddress=(v)=>{return /^0x[A-Fa-f0-9]{40}$/.test(v);}
    const checkNum=(v)=>{return /^[1-9][0-9]*$/.test(v);}
        //表单上数据合法性检测
    const myCheck = (form) => {
        let _err = 0;
        let _temp;
       
         _temp = form.org_firstName.value.trim(); //第一个成员地址
        if (!_temp || !checkAddress(_temp)) { _err = _err + 1; setErrorFirrstName(true); }
        _temp=form.org_firstvote.value.trim(); //第一个成员票权
        if(!_temp || !checkNum(_temp) ) {_err=_err+1; setErrorFirrstVote(true);}

     
        //第二成员开始的地址和票权检测
        addAr.forEach(v=>{
            _temp=form['org_firstName' + v.index].value.trim();
            if(!_temp || !checkAddress(_temp) ) {_err=_err+1; v.isErr1=true;} 
        })
     
        return _err === 0;
    }


    const mintsvg=()=>{
        // debugger;
        let tipar=[]
        const form=document.getElementById("nftform")
        let lok=false  //检查是否为空
      

        allAr.forEach(v=>{
            
            const _temp=form['nft_svg_' + v.index].value.trim();
            
            if(!_temp ) {v.err=true;lok=true;} 
            tipar.push(_temp)
        })
        if(lok){
            setAllAr([...allAr]);
            showError(t('checkError'));
            return
        }

        if(!form['daoselect'].value){
            showError( t("selectDaoText"))
            return
        }
        if(batch) {
            if (!myCheck(form)) {
                setAddAr([...addAr]);
                showError(t('checkError'));
            } else 
            {
            showTip(tc('blockchainText3'))
            let members = [form.org_firstName.value.trim()];
            addAr.forEach(v=>{
                members.push(form['org_firstName' + v.index].value.trim());
            })
            window.daismDaoapi.Mynft.mintBatch(
                form['daoselect'].value,  
                members,tipar,
                form.org_firstvote.value.trim()
                )
            .then(e => {setTimeout(() => { window.location.reload()}, 1000)}, 
                err => {
                    closeTip(); 
                    showError(tc('errorText') + (err.message ? err.message : err));
                }
            );
            }

        }else {

        showTip(tc('blockchainText3'))
        window.daismDaoapi.Mynft.mint(form['daoselect'].value,user.account,tipar)
        .then(e => {setTimeout(() => { window.location.reload()}, 1000)}, 
            err => {
                closeTip();
                showError(tc('errorText') + (err.message ? err.message : err));
            }
        );
        }

    }

     //删除成员
     const delMember = (event) => {
        let _num = parseInt(event.currentTarget.getAttribute('data-key'));
        for (let i = 0; i < addAr.length; i++) {
            if (addAr[i].index === _num) {
                addAr.splice(i, 1);
                setAddAr([...addAr]);
            }
        }
    }
    
    //增加成员
    const addMember = (event) => {
        if (addAr.length)
            setAddAr([...addAr, {index:addAr[addAr.length-1].index+1,isErr1:false}])
        else
            setAddAr([{index:0,isErr1:false}])
    }

    const stylea={width:'60px'}

    return ( 
        <>  
          <Button size="lg" variant="primary" onClick={e=>{setShow(true)}} ><Honor size={24} />mint {t('nftText')} </Button> 
          <Modal size='lg' className='daism-title' show={show} onHide={(e) => {setShow(false)}}>
                <Modal.Header closeButton>{t('nftText')} </Modal.Header>
                <Modal.Body   >
               
                <Form id='nftform' >
                    <div className='mb-2 d-flex justify-content-between align-items-center' >
                        <div>
                            <Button size='sm' onClick={e=>{setTips(i=>tips+1)}} variant="info" >{t('addBtnText')} </Button> 
                            <Button size='sm' style={{marginLeft:'10px'}}  onClick={e=>{if(tips>1) setTips(i=>tips-1)}} variant="warning" >{t('reduBtnText')} </Button> 
                        </div>
                        <Form.Select id="daoselect" style={{width:'300px'}} >
                            {mynftData.data && mynftData.data.length && mynftData.data.map((obj,idx)=>(
                                    <option key={'dao_'+idx} value={obj.dao_id}>
                                        {obj.dao_name}(Valuation Token: {obj.dao_symbol})
                                    </option>
                                ))
                            }
                        </Form.Select>
                    </div>
                    {allAr.map((placement,idx)=>(
                          <div key={'nft_'+idx} >
                          <InputGroup hasValidation className="mt-2">
                                <InputGroup.Text style={stylea} >{t('eventsDesc')}</InputGroup.Text>
                                <FormControl id={'nft_svg_' + placement.index}  rows={2}  as="textarea"   
                                isInvalid={placement.err?true: false} 
                                onFocus={e=>{placement.err=false;setAllAr([...allAr])}}  type="text" defaultValue="" />
                                <Form.Control.Feedback type="invalid"> {t('noEmptyText')} </Form.Control.Feedback>
                          </InputGroup>
                      </div>
                            // <InputGroup className='mt-1' key={idx} >
                            // <InputGroup.Text style={stylea} >{t('eventsDesc')}</InputGroup.Text>
                            // <Form.Control  id={'nft_svg_' + idx}  rows={2}  as="textarea" />
                            // </InputGroup>
                        ))
                    }

                  <Form.Check className='mt-2' type="switch"  id="batch-switch" checked={batch} onChange={e=>{setBatch(e.currentTarget.checked)}} label={t('batchText')} />
                   {batch && 
                    <div className='mt-2' >
                    <InputGroup hasValidation className="mb-2">
                        <InputGroup.Text style={{width:"240px"}} >{t('mintNumberText')}</InputGroup.Text>
                        <FormControl id='org_firstvote'   
                        isInvalid={errorFirrstVote?true: false}  type="text" placeholder="1"  
                        onFocus={e=>{setErrorFirrstVote(false)}}     defaultValue="1" />
                        <Form.Control.Feedback type="invalid"> {t('mintValue')} </Form.Control.Feedback>
                        </InputGroup>

                        <InputGroup hasValidation className="mb-0">
                        <InputGroup.Text style={{width:"80px"}} >{t('memberText')}</InputGroup.Text>
                        <FormControl id='org_firstName' isInvalid={errorFirrstName?true: false}  type="text" placeholder="0x"  
                        onFocus={e=>{setErrorFirrstName(false)}}  defaultValue={user.account} />
                        <Button variant="primary"  onClick={addMember}>{t('addMember')}</Button>
                        <Form.Control.Feedback type="invalid"> {t('addressCheck')} </Form.Control.Feedback>
                        </InputGroup>

                        {addAr.map((placement, idx) => (
                            <div key={'org_'+idx} >
                                <InputGroup hasValidation className="mt-2">
                                    <InputGroup.Text style={{width:"80px"}} >{t('memberText')}</InputGroup.Text>
                                    <FormControl id={'org_firstName' + placement.index}   
                                    isInvalid={placement.isErr1?true: false} 
                                    onFocus={e=>{placement.isErr1=false;setAddAr([...addAr])}}  type="text"
                                    placeholder="0x" defaultValue="" />
                                      <Button variant="warning" data-key={placement.index} onClick={delMember}>{t('delMember')}</Button>
                                    <Form.Control.Feedback type="invalid"> {t('addressCheck')} </Form.Control.Feedback>
                                </InputGroup>
                            </div>
                        ))}
                        </div>    
                   }   


                    <div className='d-flex justify-content-center mt-2' >
                        <Button onClick={mintsvg} variant="primary" ><Honor size={24} />
                        mint {t('nftText')} 
                        </Button> 
                    </div>
                </Form>
                </Modal.Body>

            </Modal>
       </>
)

}