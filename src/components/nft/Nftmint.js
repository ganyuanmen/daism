
import { useSelector } from 'react-redux';
import { Button,Modal,InputGroup,Form } from 'react-bootstrap';
import useGetDappOwner from "../../hooks/useGetDappOwner"
import { useEffect, useState } from 'react';

import {ToolsSvg,FindSvg} from '../../lib/jssvg/SvgCollection'


export default function Nftmint({closeTip,showTip,showError,t,tc,user})
{
    const [show, setShow] = useState(false); //mint nft 窗口
    const [show1, setShow1] = useState(false); // nft  预览窗口
    const [btn, setBtn] = useState(true); // nft  预览窗口
    const [allAr,setAllAr]=useState([])
    const [tipAr,setTipAr]=useState(1)
    const [nftText,setNftText]=useState('')  //nft 内容
    const [tempPub,setTempPub]=useState(true)  //公共模板变量值
    const [isTemp,setIsTemp]=useState(false) //纯模板变量值
    // const daoActor = useSelector((state) => state.valueData.daoActor)
    const mynftData =useGetDappOwner(user.account) 

    useEffect(()=>{setAllAr(geneAr(true))},[tipAr])
    useEffect(()=>{setBtn(!isTemp); setAllAr(geneAr(!isTemp));},[isTemp])

    function geneAr(fk)
    {
        let _ar=['svg(1)'];
        for(var i=0;i<tipAr;i++)
        {
            if(fk) _ar.push(`tip(${i+1})`)  //非模板
            if(i<tipAr-1)  _ar.push(`svg(${i+2})`)
        }
        _ar.push(`svg(${tipAr+1})`)
        return _ar
    }
   
    function mintsvg()
    {
        let svgar=[]
        let tipar=[]
        const form=document.getElementById("nftform")
        let checkStr=''  //检查是否为空
        for(let i=0;i<allAr.length;i++)
        {
            let str=allAr[i]
            let v=form[`nft_svg_${i}`].value.trim()
            if(str.startsWith('svg')) svgar.push(v)
            else tipar.push(v)
            if(!v) { checkStr=str; break;} 
        }

        if(checkStr) {
            showError(`${checkStr} ${t('noEmptyText')}`)
            return
        }
        if(!form['daoselect'].value){
            showError(t("selectDaoText"))
            return
        }

        showTip(tc('blockchainText3'))
        window.daismDaoapi.Mynft.mintWithSvgTemplateAndTips(form['daoselect'].value,user.account,svgar,tipar,tempPub)
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

    function showsvg()
    {
        const form=document.getElementById("nftform")
        let _ar=[]
        let checkStr=''  //检查是否为空
        for(let i=0;i<allAr.length;i++)
        {
            let v=form[`nft_svg_${i}`].value.trim()
            _ar.push(v)
            if(!v) { checkStr=allAr[i] ; break;} 
        }
        if(checkStr) {
            showError(`${checkStr} ${t('noEmptyText')}`)
            return
        }
       setNftText(_ar.join(''))
       setShow1(true)
    }

    
   
    const stylea={width:'60px'}

    return ( 
        <>  
          <Button size="lg" variant="primary" onClick={e=>{setShow(true)}} ><ToolsSvg size={24} />mint NFT </Button> 
          <Modal size='lg' className='daism-title' show={show} onHide={(e) => {setShow(false)}}>
                <Modal.Header closeButton>NFT mint </Modal.Header>
                <Modal.Body   >
                    <div className='mb-2' > {t('nftDescText')} </div>
                    <div className='mb-2 d-flex justify-content-between align-items-center' >
                        <div>
                            <div className="form-check form-switch ">
                            <input className="form-check-input" type="checkbox" id="onLineBox"  checked={isTemp} onChange={e=>{setIsTemp(e.currentTarget.checked)}} />
                            <label className="form-check-label" htmlFor="onLineBox">{t('onlyTemplate')}</label>
                            </div>
                        </div>
                        <div>
                         { btn && <div>
                         <Button size='sm' onClick={e=>{setTipAr(i=>tipAr+1)}} variant="info" >{t('addBtnText')} </Button> 
                         <Button size='sm' style={{marginLeft:'10px'}}  onClick={e=>{if(tipAr>1) setTipAr(i=>tipAr-1)}} variant="warning" >{t('reduBtnText')} </Button> 
                         </div>}
                        </div>
                    </div>
                <Form id='nftform' >
                    <div className='mb-2 d-flex justify-content-between align-items-center' >
                    <Form.Check type="switch"  id="custom-switch" checked={tempPub} onChange={e=>{setTempPub(e.currentTarget.checked)}} label={t('publicTemplate')} />
                    <Form.Select id="daoselect" style={{width:'300px'}} >
                    {mynftData.data && mynftData.data.length && mynftData.data.map((obj,idx)=>(
                            <option key={'dao_'+idx} value={obj.dao_id}>
                                {obj.dao_name}(Valuation Token: {obj.dao_symbol})
                            </option>
                        ))
                    }
                    </Form.Select>
                    </div>
                    {allAr.map((str,idx)=>(
                            <InputGroup className='mt-1' key={idx} >
                            <InputGroup.Text style={stylea} >{str}</InputGroup.Text>
                            <Form.Control onFocus={e=>{setShow1(false)}}  id={'nft_svg_' + idx}  rows={str.startsWith('svg')?5:1 }  as="textarea" aria-label={str} />
                            </InputGroup>
                        ))
                    }

                   {show1 && <div className='d-flex justify-content-center mt-2 ' dangerouslySetInnerHTML={{__html: nftText}}></div>}



                    <div className='d-flex justify-content-center mt-2' >
                        <Button onClick={mintsvg} variant="primary" ><ToolsSvg size={24} />
                        {isTemp?t('upTemplate'):t('upTemplateandMint')}</Button> 
                        <Button onClick={showsvg} style={{marginLeft:'10px'}} variant="info" ><FindSvg size={24} />{t('previewText')} </Button> 
                    </div>
                </Form>
                </Modal.Body>

            </Modal>
       </>
)

}