import React, {
  useImperativeHandle,
  useState,
  useRef,
  forwardRef,
  useEffect,
  ChangeEvent,
  FormEvent,
} from "react";
import editStyle from "@/styles/editor.module.css";
import SCProperty, { SCPropertyRef } from "../../enki3/SCProperty";
import Media, { MediaRef } from "../../enki3/Media";
import { useTranslations } from "next-intl";


interface EditorProps {
  currentObj?: EnkiMessType|null;
  nums: number;  //充许文字数量
  accountAr?: AccountType[]; //私下的用户列表
  isSC?: boolean;
  showProperty: boolean; 
}

export interface EditorRef {
  getData: () => string;
  getImg: () => File | null;
  getFileType: () => string;
  getVedioUrl: () => string;
  getProperty: () => number;
  getAccount: () => string;
}

const Editor = forwardRef<EditorRef, EditorProps>(
  ({ currentObj, nums, accountAr, isSC, showProperty = true }, ref) => {

    const t = useTranslations("ff");

    const delHtml = (): string => {
      let temp = (currentObj?.content || "").replaceAll("</p><p>", "\n");
      temp = temp.replaceAll("<p>", "").replaceAll("</p>", "");
      return temp;
    };

    const [inputValue, setInputValue] = useState<string>(delHtml());
    const [remainingChars, setRemainingChars] = useState<number>(
      currentObj?.content ? nums - currentObj.content.length : nums
    );

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const propertyRef = useRef<SCPropertyRef>(null);
    const mediaRef = useRef<MediaRef>(null);

    useImperativeHandle(ref, () => ({
      getData: () => inputValue,
      getImg: () => mediaRef.current?.getImg() ?? null,
      getFileType: () => mediaRef.current?.getFileType() ?? "",
      getVedioUrl: () => mediaRef.current?.getVedioUrl() ?? "",
      getProperty: () => propertyRef.current?.getData() ?? 1,
      getAccount: () => propertyRef.current?.getAccount() ?? "",
    }));

    useEffect(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight + 6}px`;
      }
    }, [inputValue]);

    // 输入处理
    const onInput = (e: FormEvent<HTMLTextAreaElement>) => {
      const target = e.target as HTMLTextAreaElement;
      const value = target.value;
      setRemainingChars(nums - value.length);
    };

    return (
      <>
        <textarea
          className="form-control"
          ref={textareaRef}
          rows={5}
          onInput={onInput}
          value={inputValue}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setInputValue(e.target.value)
          }
        />

        <Media ref={mediaRef} currentObj={currentObj}>
          {showProperty && (
            <SCProperty
              ref={propertyRef}
              currentObj={currentObj}
              accountAr={accountAr}
              isSC={isSC}
            >
              <div className={editStyle.charcount}>
                {t("remainingText")}: {remainingChars}{" "}
              </div>
            </SCProperty>
          )}
        </Media>
      </>
    );
  }
);

export default React.memo(Editor);
