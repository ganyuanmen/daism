
// import { useRef } from 'react';
// import { Button } from 'react-bootstrap';
// import {setTipText,setMessageText} from '../../data/valueData'
// import {useDispatch } from 'react-redux';
// import DaismImg from '../../components/form/DaismImg';
// import { SetLogoSvg } from '../../lib/jssvg/SvgCollection';
// import { useTranslations } from 'next-intl'
// /**
//  * 图片选择器
//  */
// export default function LogoSelect({ daoId,setLogo,setShowSetLogo }) {
//    const imgRef=useRef()
//    const dispatch = useDispatch();
//    function showError(str){dispatch(setMessageText(str))}
//    function showTip(str){dispatch(setTipText(str))}
//    function closeTip(){dispatch(setTipText(''))}
//    const t = useTranslations('dao')
//    const tc = useTranslations('Common')

//     //首次设置logo提交链上，修改logo需要经过提案执行
//     const handle = () => {
//         if(!imgRef.current.getBinary()) {
//             showError(t('noSelectImgText'))
//             return
//         }
//         setShowSetLogo(false)
//         showTip(t('submitLogoText')); 
//         //svg 已经压缩，后缀名->zip
//         let imgStr=imgRef.current.getData()
//         window.daismDaoapi.DaoLogo.setLogo(daoId,imgRef.current.getBinary(), imgRef.current.getFileType()==='svg'?'zip':imgRef.current.getFileType()).then(() => {
//             setLogo(imgStr)
//             closeTip()
//         }, err => {
//             console.error(err);closeTip();
//             showError(tc('errorText')+(err.message?err.message:err));
//         });
//     }

//     return (
//         <>
//             <DaismImg ref={imgRef} title={`${t('uploadText')} logo`} maxSize={10480} fileTypes='svg,jpg,jpeg,png,gif,webp,zip' />
//             <div style={{textAlign:'center'}} >
//                 <Button variant='primary' onClick={handle}><SetLogoSvg size={20} /> {t('setLogoText')}</Button>
//             </div> 
//         </>
//     );
// }
