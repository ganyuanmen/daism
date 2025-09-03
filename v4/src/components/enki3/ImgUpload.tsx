import React, {
    useImperativeHandle,
    useRef,
    forwardRef,
    useState,
    ChangeEvent
    
  } from "react";
  import ErrorBar from "../form/ErrorBar";
  import { useTranslations } from "next-intl";
  import { Button } from "react-bootstrap";
  import { UploadImg } from "@/lib/jssvg/SvgCollection";
  
  interface ImgUploadProps {
    maxSize: number; // 最大允许大小，单位字节
    fileTypes: string[]; // 允许的文件后缀名
    setFileStr: (str: string | ArrayBuffer | null) => void; // 设置文件base64
    setFileType: (type: string) => void; // 设置文件后缀名
  }
  
  export interface ImgUploadRef {
    getFileType: () => string;
    getFile: () => File | null;
  }
  
  const ImgUpload = forwardRef<ImgUploadRef, ImgUploadProps>(
    ({ maxSize, fileTypes, setFileStr, setFileType }, ref) => {
      const t = useTranslations("ff");
      const tc = useTranslations("Common");
  
      const imgRef = useRef<HTMLButtonElement | null>(null);
      const fileInputRef = useRef<HTMLInputElement | null>(null);
      const fileTypeRef = useRef<string>("");
  
      const [invalidText, setInvalidText] = useState("");
  
      useImperativeHandle(ref, () => ({
        getFileType: () => fileTypeRef.current,
        getFile: () =>
          fileTypeRef.current && fileInputRef.current?.files
            ? fileInputRef.current.files[0]
            : null,
      }));
  
      // 选择图片后处理
      const fielChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.currentTarget.files || !event.currentTarget.files[0]) return;
        const file = event.currentTarget.files[0];
        fileTypeRef.current =
          file.name.indexOf(".") > 0
            ? file.name.toLowerCase().split(".").pop() || ""
            : "";
  
        const clear = () => {
          setFileType("");
          setFileStr("");
          fileTypeRef.current = "";
        };
  
        // 检查后缀名
        if (!fileTypes.includes(fileTypeRef.current)) {
          setInvalidText(
            `${tc("onlySuport")} ${fileTypes.join(", ")} ${tc(
              "ofImgText"
            )} [${file.name}]`
          );
          return clear();
        }
  
        // 检查文件大小
        if (file.size > maxSize) {
          setInvalidText(`${tc("fileSizeMax")} ${maxSize / 1024} k`);
          return clear();
        }
  
        setFileType(fileTypeRef.current);
  
        const reader = new FileReader();
        reader.addEventListener("loadend", (e) => {
          setFileStr(e.target?.result ?? null);
        });
        reader.readAsDataURL(file);
      };
  
      const triggerClick = () => {
        setInvalidText("");
        fileInputRef.current?.click();
      };
  
      return (
        <>
          <Button
            variant="light"
            size="sm"
            onClick={triggerClick}
            ref={imgRef}
            title={t("uploadPitruseText")}
          >
            <UploadImg size={24} />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={fielChange}
          />
          <ErrorBar
            show={!!invalidText}
            target={imgRef.current}
            placement="left"
            invalidText={invalidText}
          />
        </>
      );
    }
  );
  ImgUpload.displayName="ImgUpload";
  export default ImgUpload;
  