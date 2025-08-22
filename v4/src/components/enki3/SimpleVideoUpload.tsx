import { useState, ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import {
  type AppDispatch,
  setTipText,
  setMessageText
} from '@/store/store';
import { useTranslations } from 'next-intl';
import { Button } from 'react-bootstrap';

const MAX_SIZE = 100 * 1024 * 1024; // 100MB

interface SimpleVideoUploadProps {
  setVedioUrl: (url: string) => void;
  setShow: (show: boolean) => void;
}

export default function SimpleVideoUpload({
  setVedioUrl,
  setShow,
}: SimpleVideoUploadProps) {
  const [video, setVideo] = useState<File | null>(null);

  const t = useTranslations('ff');
  const dispatch = useDispatch<AppDispatch>();

  const showTip = (str: string) => dispatch(setTipText(str));
  const closeTip = () => dispatch(setTipText(''));
  const showClipError = (str: string) => dispatch(setMessageText(str));

  const handleUpload = async () => {
    if (!video) return;

    const formData = new FormData();
    formData.append('video', video);

    showTip(t('uploaddingText'));

    try {
      const res = await fetch('/api/admin/uploaVedio', {
        method: 'POST',
        body: formData,
      });

      if (res.status !== 200) {
        showClipError(`${res.statusText}\n ${t('maxImageSize', { num: 100 })}`);
      } else {
        const data: { path: string } = await res.json();
        setVedioUrl(data.path);
      }
    } catch (error: any) {
      showClipError(error.message || 'Upload failed');
    } finally {
      closeTip();
      setShow(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        showClipError(t('selectVedioText'));
        return;
      }

      if (file.size > MAX_SIZE) showClipError(t('vedioSizeText'));
      else setVideo(file);
    }
  };

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleChange} />
      {video && <Button onClick={handleUpload}>{t('uploadVedioText')}</Button>}
    </div>
  );
}
