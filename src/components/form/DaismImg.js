import ErrorBar from "./ErrorBar";
import React, {useImperativeHandle,useState,useRef, forwardRef, useEffect } from "react";
import JSZip from 'jszip';
import { Button } from "react-bootstrap";
import { useTranslations } from 'next-intl'

const DaismImg = forwardRef(({title,maxSize,fileTypes,...props}, ref) => {
    const [showError,setShowError]=useState(false)
    const [invalidText,setInvalidText]=useState('')
    const [fileStr,setFileStr]=useState('')
    const imgRef=useRef()
    const fileInputRef = useRef(null);
    const fileTypeRef=useRef('')
    const binaryRef=useRef('')
    const t = useTranslations('Common')
    const defaultRef=useRef(props.defaultValue)
    useEffect(()=>{
        if(defaultRef.current) {
            let type = defaultRef.current.split('.').splice(-1); 
            fileTypeRef.current=type[0]
            if(props.isApi) {
                if(defaultRef.current.endsWith('.svg')) {
                    fetch(`/api/getimage?path=${defaultRef.current}`).then(async res=>{if(res.status===200) setFileStr(await res.text())})
                }
                else setFileStr(`/api/getimage?path=${defaultRef.current}`)
            } else setFileStr(defaultRef.current)
        }
    },[props.isApi])

    useImperativeHandle(ref, () => ({
      getData: ()=>{return fileStr},
      getFileType:()=>{ return fileTypeRef.current},
      getBinary:()=>{return binaryRef.current},
      getFile:()=>{return  fileTypeRef.current?fileInputRef.current.files[0]:null},
    }));

    //选择图片后处理
    const fielChange = (event) => {
        setShowError(false)
        if (!event.currentTarget.files || !event.currentTarget.files[0]) { return; }
        binaryRef.current=''
        let file = event.currentTarget.files[0];
        let type = file.name.toLowerCase().split('.').splice(-1); //获取上传的文件的后缀名  
        fileTypeRef.current=type[0]
        //检查后缀名
        if (!fileTypes.includes(type[0])) {
            setInvalidText(`${t('onlySuport')} ${fileTypes} ${t('ofImgText')} [${file.name}]`);
            setShowError(true)
            return;
        }
        //检查文件大小
        if (file.size > maxSize) {
            setInvalidText(`${t('fileSizeMax')} ${maxSize/1024} k `);
            setShowError(true)
            setFileStr('')
            binaryRef.current=''
            fileTypeRef.current=''
           
            return;
        }

        //链上要求的格式,后缀名包含zip 表示链上图片
        if (fileTypes.includes('zip')) {
            let reader = new FileReader() 
            if(type[0]==='svg')
            {
                reader.addEventListener('loadend', function (e) {
                    let mbytes = '0x';
                    let zip = new JSZip();
                    zip.file("zip.svg", e.target.result);
                    zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 9 } })
                        .then(function (content) {
                            let reader = new FileReader()
                            reader.addEventListener('loadend', function (e1) {
                                for (let j = 0; j < e1.target.result.length; j++) {
                                    let _a = e1.target.result[j].valueOf().charCodeAt(0).toString(16);
                                    mbytes = mbytes + (_a.length === 1 ? ('0' + _a) : _a);
                                }
                                binaryRef.current=mbytes
                            })
                            reader.readAsBinaryString(content)
                        });
                 });
                reader.readAsText(file);
            }
            else 
            {
                reader.addEventListener('loadend', function (e) {
                    let mbytes = '0x';
                    for (let j = 0; j < e.target.result.length; j++) {
                        let _a = e.target.result[j].valueOf().charCodeAt(0).toString(16);
                        mbytes = mbytes + (_a.length === 1 ? ('0' + _a) : _a);
                    }
                    binaryRef.current=mbytes
                 });
                reader.readAsBinaryString(file);
            }
        }
     
        let reader = new FileReader() 
        if (type[0] === 'zip') { //zip 文件要解压，根据后缀名还原成原文件base64编码
            let new_zip = new JSZip();
            new_zip.loadAsync(file)
                .then(function (mzip) {
                    let fileName = Object.keys(mzip.files)[0];
                    mzip.file(fileName).async("blob").then(blob => {
                        let fileNameSplit = fileName.split('.');
                        let suffixName = fileNameSplit[fileNameSplit.length - 1];
                        if (suffixName === 'svg') {
                            reader.addEventListener('loadend', function (e) {
                                setFileStr('data:image/svg+xml;base64,' + window.btoa(decodeURIComponent(encodeURIComponent(e.target.result))));
                            })
                            reader.readAsText(blob) //按文本读取
                        } else { //二进制文件
                            reader.addEventListener('loadend', function (e) {
                                setFileStr(e.target.result.replace("application/octet-stream", "image/" + type[0]))
                            })
                            reader.readAsDataURL(blob)
                        }
                    });
                });
        }else {
            reader.addEventListener('loadend', function (e) { 
                setFileStr(e.target.result)
                });
            reader.readAsDataURL(file)
        }
    }

    const triggerClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        fileInputRef.current.click();
    };

    return (
        <div className="mb-3 border" style={{paddingLeft:'6px'}} onClick={e=>{setShowError(false)}} >
            <Button onClick={triggerClick} ref={imgRef} style={{border:0,background:'transparent'}}  >
                <span style={{color:'black'}} > {title}</span> <img alt="" src='/add.svg' width={32} height={32} style={{margin:'36px 0 36px 0'}} />
            </Button>
            
            {fileStr &&
                <> 
                    <img alt="" src={fileStr} width={110} height={90} style={{maxHeight:'110px',marginLeft:'20px'}} />
                    <button className='btn btn-light'  onClick={e=>{setFileStr('');fileTypeRef.current='';}}>{t('clearText')}</button>
                </>
            }
            <input ref={fileInputRef} type="file" style={{ display: 'none' }}  onChange={fielChange} />
            <ErrorBar show={showError} target={imgRef} placement='right' invalidText={invalidText} ></ErrorBar>
        </div>
    );
});

export default React.memo(DaismImg);


// layout="fill" // required
// objectFit="cover" // change to suit your needs