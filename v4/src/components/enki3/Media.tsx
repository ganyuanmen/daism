import React, {
    useImperativeHandle,
    useRef,
    forwardRef,
    useState,
    ReactNode,
  } from "react";
  import ImgUpload, { ImgUploadRef } from "./ImgUpload";
  import VedioUpload from "./VedioUpload";
  import { Row, Col } from "react-bootstrap";
  import ShowVedio from "../enki2/form/ShowVedio";
  import { useTranslations } from "next-intl";
  
  interface CurrentObj {
    top_img?: string;
    vedio_url?: string;
  }
  
  interface MediaProps {
    children?: ReactNode;
    currentObj?: CurrentObj;
  }
  
  export interface MediaRef {
    getImg: () => File | null;
    getFileType: () => string;
    getVedioUrl: () => string;
  }
  
  const Media = forwardRef<MediaRef, MediaProps>(({ children, currentObj }, ref) => {
    const t = useTranslations("ff");
    const tc = useTranslations("Common");
  
    const geneType = (): string => {
      if (currentObj?.top_img) {
        const ar = currentObj.top_img.split(".");
        return ar[ar.length - 1];
      } else {
        return "";
      }
    };
  
    const [fileType, setFileType] = useState<string>(geneType());
    const [vedioUrl, setVedioUrl] = useState<string>(
      currentObj?.vedio_url ?? ""
    );
    const [fileStr, setFileStr] = useState<string>(currentObj?.top_img ?? "");
  
    const imgRef = useRef<ImgUploadRef>(null);
  
    useImperativeHandle(ref, () => ({
      getImg: () => (fileStr ? imgRef.current?.getFile() ?? null : null),
      getFileType: () => fileType,
      getVedioUrl: () => vedioUrl,
    }));
  
    return (
      <>
        <Row>
          <Col>{children}</Col>
          <Col className="col-auto">
          <ImgUpload
                ref={imgRef}
                maxSize={1024 * 500}
                fileTypes={["svg", "jpg", "jpeg", "png", "gif", "webp"]}
                setFileStr={(val) => setFileStr(val ? String(val) : "")} // 把 null 或 ArrayBuffer 转成 string
                setFileType={setFileType}
            />
            <VedioUpload vedioUrl={vedioUrl} setVedioUrl={setVedioUrl} />
          </Col>
        </Row>
  
        <Row className="mt-2">
          <Col>
            {fileStr && (
              <div style={{ position: "relative" }}>
                <img alt="" src={fileStr} style={{ maxWidth: "100%" }} />
                <button
                  style={{ position: "absolute", top: 0, right: 0 }}
                  className="btn btn-light"
                  onClick={() => {
                    setFileStr("");
                    setFileType("");
                  }}
                >
                  {tc("clearText")}
                </button>
              </div>
            )}
          </Col>
  
          <Col>
            {vedioUrl && (
              <div style={{ position: "relative" }}>
                <ShowVedio vedioUrl={vedioUrl} />
                <button
                  style={{ position: "absolute", top: 0, right: 0 }}
                  className="btn btn-light"
                  onClick={() => setVedioUrl("")}
                >
                  {tc("clearText")}
                </button>
              </div>
            )}
          </Col>
        </Row>
      </>
    );
  });
  
  export default React.memo(Media);
  