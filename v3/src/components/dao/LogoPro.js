
import { useRef } from 'react';
import Button from 'react-bootstrap/Button';
import DaismImg from '../../components/form/DaismImg';
import Alert from 'react-bootstrap/Alert';
import { useDispatch} from 'react-redux';
import {setTipText,setMessageText} from '../../data/valueData'
import { EditSvg } from '../../lib/jssvg/SvgCollection';
import { useTranslations } from 'next-intl'

/**
 * 图片提案修改器
 * @daoName 智能公器名称
 * @setChangeLogo 关闭窗口
 * @delegator 智能公器的代理地址
 */
export default function LogoPro({ daoName,setChangeLogo,delegator,setMess }) {
    const t = useTranslations('dao')
    const tc = useTranslations('Common') 

    const dispatch = useDispatch();
    function showError(str){dispatch(setMessageText(str))}
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}
    const imgRef=useRef()

    async function changeLogoClick()
    {
        const imgbase64=imgRef.current.getData()
        if(!imgbase64)
        {
            showError(t('noSelectImgText'))   
            return
        }
        const imgstr =window.atob(imgbase64.split(',')[1]);

        setChangeLogo(false)
        showTip( t('submitingProText'))
        
        let uplogoid='0x0000000000000000000000000000000000000003'
      
        //修改logo proposalType=1
        window.daismDaoapi.Dao.addProposal(delegator,uplogoid,1,parseInt(new Date().getTime()/1000),0,0,'',1,
        'svg',imgstr).then(() => {
            closeTip();
            setMess(true);
            // showError(`${t("uploadPro")}_*_`)
          }, err => {
              console.error(err);closeTip();
              if(err.message && err.message.includes('proposal cooling period'))  showError(t('noCooling'))
              else if(err.message && err.message.includes('valid proposal exists'))  showError(t('noComplete'))
              else showError(tc('errorText')+(err.message?err.message:err));
          }
        );

    }
  
    return (
            <>
                <DaismImg  ref={imgRef} title={`${t('uploadText')} logo`}  maxSize={10480} fileTypes='svg' />
                <Button variant='primary'  className='mb-2' onClick={changeLogoClick} ><EditSvg size={20} />  {t('changeLogoProText')}</Button>

                <Alert variant="danger" >
                        <p>
                        Smart Commons ({daoName})  {t('chageLogoWarnText')}
                        </p>
                </Alert>
            </>
        );

}