
import { useRef,useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import DaismImg from '../../components/form/DaismImg';
import Alert from 'react-bootstrap/Alert';
import { useDispatch} from 'react-redux';
import {setTipText,setMessageText} from '../../data/valueData'
import { EditSvg,UploadSvg } from '../../lib/jssvg/SvgCollection';
import { useTranslations } from 'next-intl'
import useLogoID from '../../hooks/useLogoID';

/**
 * 图片提案修改器
 */
export default function LogoPro({ daoName,daoId,setChangeLogo,delegator,lastPro,setRefresh }) {
    const t = useTranslations('dao')
    const tc = useTranslations('Common')
    const [loadding,setLoadding]=useState(true)
    
    const data=useLogoID(daoId,loadding,setLoadding);
  

    const dispatch = useDispatch();
    function showError(str){dispatch(setMessageText(str))}
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    const imgRef=useRef()

    async function changeLogoClick()
    {
        if(!imgRef.current.getBinary())
        {
            showError(t('noSelectImgText'))   
            return
        }

        setChangeLogo(false)
        showTip( t('submitingProText'))
        
        let uplogoid='0x0000000000000000000000000000000000000003'
      
        window.daismDaoapi.Dao.addProposal(delegator,uplogoid,1,parseInt(new Date().getTime()/1000),0,0,'',
        imgRef.current.getFileType()==='svg'?'zip':imgRef.current.getFileType(),imgRef.current.getBinary()).then(() => {
            closeTip()
            showError(t("uploadPro"))
            setRefresh(true)
          }, err => {
              console.error(err);closeTip();
              showError(tc('errorText')+(err.message?err.message:err));
          }
        );

    }
  

//    async function upLogoClick()
//    {
//     if(!imgRef.current.getBinary())
//     {
//         showError(t('noSelectImgText'))   
//         return
//     }
//     showTip( t('uplogoing') )
//     console.log("----------------------------------")
//     console.log(imgRef.current.getBinary())
//     console.log("----------------------------------")
//      //svg 已经压缩，后缀名->zip
//      window.daismDaoapi.DaoLogo.addLogo(daoId,imgRef.current.getBinary(), imgRef.current.getFileType()==='svg'?'zip':imgRef.current.getFileType()).then(() => {
//         closeTip()
//         setTimeout(() => {
//             setLoadding(true) //刷新logo
//         }, 1000);
//       }, err => {
//           console.error(err);closeTip();
//           showError(tc('errorText')+(err.message?err.message:err));
//       });

//    }


    return <> {(lastPro.length && lastPro[0].is_end===0)?<Alert variant="danger" >{t('noComplete')} </Alert>
                :<>{lastPro.length && lastPro[0].is_end===1 && lastPro[0].cool_time<0?<Alert variant="danger" >{t('noCooling')} </Alert>:
                    <>
                        <DaismImg  ref={imgRef} title={`${t('uploadText')} logo`}  maxSize={10480} fileTypes='svg,jpg,jpeg,png,gif,webp,zip' />
                        <Button variant='primary'  className='mb-2' onClick={changeLogoClick} ><EditSvg size={20} />  {t('changeLogoProText')}</Button>
                    
                        
                    
                        <Alert variant="danger" >
                                <p>
                                Smart Commons ({daoName})  {t('chageLogoWarnText')}
                                </p>
                        </Alert>
                    </>
                   }               
                </>
             }
            </>

}