

import { Button,Modal,InputGroup,Form,FormControl } from 'react-bootstrap';
import { useState } from 'react';
import {ToolsSvg,FindSvg} from '../../lib/jssvg/SvgCollection';
import Loadding from '../Loadding';
import useGetDappOwner from "../../hooks/useGetDappOwner"

export default function Tempmint({obj,closeTip,showTip,showError,t,tc,user})
{
    const [show, setShow] = useState(false); //mint nft 窗口
    const [show1, setShow1] = useState(false); // nft  预览窗口
    const [allAr,setAllAr]=useState([])
    const [nftText,setNftText]=useState('')  //nft 内容
    const [batch,setBatch]=useState(false) //是否批量
    const [errorFirrstName, setErrorFirrstName] = useState(false) 
    const [errorFirrstVote, setErrorFirrstVote] = useState(false) 
    const [addAr, setAddAr] = useState([]); 


    const mynftData =useGetDappOwner(user.account) 


    function handle()
    {
        let e=JSON.parse(obj.templatesvg)
        setShow(true)
        // window.daismDaoapi.Mynft.getSvgTemplate(obj.template_id).then(e =>{
            let _ar=[{str:'svg(1)',text:e[0][0]}];
            for(var i=0;i<e[0].length-1;i++)
            {
                _ar.push({str:`tip(${i+1})`,text:''})  
                if(i<e[0].length-2)  _ar.push({str:`svg(${i+2})`,text:e[0][i+1]})
            }
            _ar.push({str:`svg(${e[0].length})`,text:e[0][i]})
            setAllAr(_ar)
        // },
        // err=>{
        //     setShow(false)
        //     showError(tc('networkError'))
        // }
        
        // )

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

       

    function checkempty(fk)  //true mint 检测
    {
        const form=document.getElementById("nftform")
        let tipar=[]
        let checkStr=''  //检查是否为空
        for(let i=0;i<allAr.length;i++)
        {
            if(fk && allAr[i].str.startsWith('svg')) continue
            let v=form[`nft_svg_${i}`].value.trim()
            tipar.push(v)
            if(!v) { checkStr=allAr[i].str; break;} 
        }

        if(checkStr) {
            showError(`${checkStr} ${t('noEmptyText')}`)
            
            return []
        }
        return tipar
    }
   
    function mintsvg()
    {
        let tipar=checkempty(true)
        if(!tipar.length) return

        // if(obj.is_public){
            const form=document.getElementById("nftform")
            if(!form['daoselect'].value){
                showError(t("selectDaoText"))
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

                window.daismDaoapi.Mynft.mintWithSvgBatchByTokenId(
                    form['daoselect'].value, 
                    obj.token_id                    ,
                    members,
                    form.org_firstvote.value.trim(),
                    tipar)
                .then(e => {setTimeout(() => { window.location.reload()}, 1000)}, 
                    err => {
                        closeTip();
                        if(err.message.includes('DAismNFT:need the dapp owner') || err.message.includes('DAismNFT:dapp address not exist')) 
                        showError(t('adminMintText'));
                        else 
                        showError(tc('errorText') + (err.message ? err.message : err));
                    }
                );
                }

            }else 
         {
            showTip(tc('blockchainText3'))
            window.daismDaoapi.Mynft.mintWithSvgTemplateId(form['daoselect'].value, obj.template_id,user.account,tipar)
            .then(e => {setTimeout(() => { window.location.reload()}, 1000)}, 
                err => {
                    console.error(err)
                    closeTip();
                    if(err.message.includes('DAismNFT:need the dapp owner') || err.message.includes('DAismNFT:dapp address not exist')) 
                    showError(t('adminMintText'));
                    else 
                    showError(tc('errorText') + (err.message ? err.message : err));
                }
            );
            }
        // }
        // else  //dao_id,token_id,_addrsss,tipAr私有模板        
        //     window.daismDaoapi.Mynft.mintWithSvgTips(obj.token_id,tipar)
        //     .then(e2 => {setTimeout(() => { window.location.reload()}, 1000)}, 
        //         err2 => {
        //             console.error(err2)
        //             closeTip();
        //             if(err2.message.includes('DAismNFT:need the dapp owner') || err2.message.includes('DAismNFT:dapp address not exist')) 
        //             showError(t('adminMintText'));
        //             else 
        //             showError(tc('errorText') + (err2.message ? err2.message : err2));
        //         }
        //     );
        
    }

    function showsvg()
    {
       let _ar=checkempty(false)
       if(!_ar.length) return
       setNftText(_ar.join(''))
       setShow1(true)
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
        setAddAr([...addAr, {index:addAr[addAr.length-1].index+1,isErr1:false,isErr2:false}])
    else
        setAddAr([{index:0,isErr1:false,isErr2:false}])
}
 
    const stylea={width:'60px'}

    return ( 
        <>  
          <Button size="sm" variant="primary" onClick={handle} ><ToolsSvg size={24} />mint NFT </Button> 
          <Modal size='lg' className='daism-title' show={show} onHide={(e) => {setShow(false)}}>
                <Modal.Header closeButton>NFT mint </Modal.Header>
                <Modal.Body   >
                <div className='mb-2' > {t('nftDescText')} </div>
                 { allAr.length?
                <Form id='nftform'>
                    <div  className='mb-2 d-flex justify-content-end align-items-center' > 
                        
                    <span>{t('smartCommonText')}:{' '}  </span>
                       <Form.Select id="daoselect" style={{width:'300px'}} >
                        {mynftData.data && mynftData.data.length && mynftData.data.map((obj,idx)=>(
                            <option key={'dao_'+idx} value={obj.dao_id}>
                                {obj.dao_name}(Valuation Token: {obj.dao_symbol})
                            </option>
                        ))
                        }
                    </Form.Select>
                    </div>
                    
                    {allAr.map((obj,idx)=>(
                            <InputGroup className='mt-1'  key={idx} >
                            <InputGroup.Text style={stylea} >{obj.str}</InputGroup.Text>
                            <Form.Control onFocus={e=>{setShow1(false)}}  id={'nft_svg_' + idx} 
                            readOnly={obj.str.startsWith('svg')}  defaultValue={obj.text}
                            rows={obj.str.startsWith('svg')?5:1 }  as="textarea" aria-label={obj.str} />
                            </InputGroup>
                        ))
                    }

                { obj.is_public===1 &&  
                <>
                   <Form.Check type="switch"  id="batch-switch" checked={batch} onChange={e=>{setBatch(e.currentTarget.checked)}} label={t('batchText')} />
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
                        </div>    }   
                    </>   }  


                   {show1 && <div className='d-flex justify-content-center' dangerouslySetInnerHTML={{__html: nftText}}></div>}



                    <div className='d-flex justify-content-center mt-2' >
                        <Button onClick={mintsvg} variant="primary" ><ToolsSvg size={24} />mint NFT </Button> 
                        <Button onClick={showsvg} style={{marginLeft:'10px'}} variant="info" ><FindSvg size={24} />{t('previewText')} </Button> 
                    </div>
                </Form>
                :<Loadding />
                }

                </Modal.Body>

            </Modal>
       </>
)

}