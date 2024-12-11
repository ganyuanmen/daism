import React, {useImperativeHandle,useRef, forwardRef, useState } from "react";
import ImgUpload from "./ImgUpload";
import VedioUpload from "./VedioUpload";
import { Row,Col } from "react-bootstrap";
import ShowVedio from "../enki2/form/ShowVedio";
import { useTranslations } from 'next-intl'

/**
 * 包括图片上传和视频上传组件
 * @currentObj 嗯文对象
 * @children 留有一个插槽 用于放置 指定人的按钮， 把三个组件放在一行上
 */

const Media = forwardRef(({children,currentObj}, ref) => {
    const t = useTranslations('ff')
    const tc = useTranslations('Common')

    const geneType=()=>{
        if(currentObj?.top_img)
          {
            const ar=currentObj.top_img.split('.');
            return ar[ar.length-1]
          }else 
          {
            return '';
          }
      }
    const [fileType,setFileType]=useState(geneType())
    const [vedioUrl,setVedioUrl]=useState(currentObj?.vedio_url?currentObj.vedio_url:'')  //选择视频
    const [fileStr,setFileStr]=useState(currentObj?.top_img?currentObj.top_img:'')  //选择图片

    const imgRef=useRef();

    useImperativeHandle(ref, () => ({
        getImg:()=>{return fileStr?imgRef.current.getFile():null},
        getFileType:()=>{return fileType},
        getVedioUrl:()=>{return vedioUrl},
    }));

  
    return (<>
        <Row>
            <Col>{children}</Col>
            <Col className="col-auto" > 
            <ImgUpload ref={imgRef} currentObj={currentObj} maxSize={1024*500} fileTypes='svg,jpg,jpeg,png,gif,webp'
            setFileStr={setFileStr} setFileType={setFileType}/>
            <VedioUpload vedioUrl={vedioUrl} setVedioUrl={setVedioUrl} />
            </Col>
        </Row>
        <Row className="mt-2" >
            <Col>
            { fileStr &&
                <div style={{position:'relative'}} > 
                    <img alt="" src={fileStr} style={{maxWidth:'100%'}} />
                    <button style={{position:'absolute',top:'0px', right:'0px'}}  className='btn btn-light'  
                    onClick={e=>{setFileStr('');setFileType('');}}>{tc('clearText')}</button>
                </div>
            }
            </Col>
            <Col>
            { vedioUrl &&
                <div style={{position:'relative'}}> 
                <ShowVedio vedioUrl={vedioUrl} /> 
                <button style={{position:'absolute',top:'0px', right:'0px'}}  className='btn btn-light' 
                onClick={e=>{setVedioUrl('')}}>{tc('clearText')}</button>
                </div>}
            </Col>
        </Row>
    </>
    );
});

export default React.memo(Media);

