import { Tooltip, OverlayTrigger } from "react-bootstrap";
import React, { useRef } from "react";

import cssStyle from "@/styles/topSearch.module.css";

import Image from "next/image";
import { useTranslations } from "next-intl";

interface TopSearchProps {

    setFetchWhere: React.Dispatch<React.SetStateAction<FetchWhere>>;


  
}

const SearchBox: React.FC<TopSearchProps> = React.memo(({setFetchWhere}:TopSearchProps) => {
    const t = useTranslations('ff')

  const inputRef = useRef<HTMLInputElement>(null);


  return (

     
        <div className="d-flex">
          <OverlayTrigger placement="bottom" overlay={<Tooltip>{t('clickTosearchText')}</Tooltip>}>
            <Image
              className={cssStyle.top_find_img}
              src="/find.svg"
              width={18}
              height={18}
              alt="find"
              onClick={() => {
                if (inputRef.current) {
                    setFetchWhere(prev=>({...prev,where:inputRef.current?.value.trim()??''}));
                }
              }}
            />
          </OverlayTrigger>
          <input
            ref={inputRef}
            className={`form-control form-control-sm ${cssStyle.top_find_input}`}
            placeholder={t('seachPloText')}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setFetchWhere(prev=>({...prev,currentPageNum:0,where:inputRef.current?.value.trim()??''}));
              }
            }}
          />
        </div>


  );
});
SearchBox.displayName="SearchBox";
export default React.memo(SearchBox);
