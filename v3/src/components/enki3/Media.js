import React, {useImperativeHandle,useRef, forwardRef, useState } from "react";
import ImgUpload from "./ImgUpload";
import VedioUpload from "./VedioUpload";
import { Row,Col } from "react-bootstrap";
import ShowVedio from "../enki2/form/ShowVedio";

const Media = forwardRef(({children, tc,t,currentObj}, ref) => {
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
            <ImgUpload ref={imgRef} currentObj={currentObj} tc={tc} t={t} maxSize={1024*500} fileTypes='svg,jpg,jpeg,png,gif,webp'
            setFileStr={setFileStr} setFileType={setFileType}/>
            <VedioUpload tc={tc} t={t} vedioUrl={vedioUrl} setVedioUrl={setVedioUrl} />
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

