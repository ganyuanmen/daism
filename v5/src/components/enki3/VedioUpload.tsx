import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useTranslations } from "next-intl";
import { UploadVedio } from "@/lib/jssvg/SvgCollection";
import Video from "./Video";

interface VedioUploadProps {
  vedioUrl: string; // 当前视频地址
  setVedioUrl: (url: string) => void; // 设置视频地址
}

const VedioUpload: React.FC<VedioUploadProps> = ({ vedioUrl, setVedioUrl }) => {
  const [show, setShow] = useState<boolean>(false);

  const t = useTranslations("ff");

  return (
    <>
      <Button
        variant="light"
        size="sm"
        onClick={() => setShow(true)}
        title={t("uploadVedioText")}
      >
        <UploadVedio size={20} />
      </Button>
      <Video
        show={show}
        setShow={setShow}
        vedioUrl={vedioUrl}
        setVedioUrl={setVedioUrl}
      />
    </>
  );
};

export default React.memo(VedioUpload);
