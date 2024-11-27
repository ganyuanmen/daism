
import { Pagination} from "react-bootstrap";
import { useTranslations } from 'next-intl'

export default function PageItem({records,currentPageNum,pages,setCurrentPageNum,postStatus}) {
    const t = useTranslations('Common')
   const tStyle={ color:'blueviolet',fontWeight:'bold',padding:'0 4px'}
    return  <>{pages>1 &&
                <div>
                <div className="d-flex align-items-center justify-content-between p-2">
                    <div key={12} >{t('totalRecordText')}：{" "}<span style={tStyle}>{records}</span></div>
                    <div key={13}>{t('currentPageText')}：{" "}<span style={tStyle}>{currentPageNum}</span></div>
                    <div key={14}>{t('totalPageText')}：{" "}<span style={tStyle}>{pages}</span></div>
                </div>
                <div className="d-flex align-item-center justify-content-center">
                    <Pagination size="lg">
                       {pages>2 && <Pagination.First disabled={(postStatus!=='succeeded' || currentPageNum===1)?true:false} onClick={(e) => {setCurrentPageNum(1);}}/>}
                        <Pagination.Prev  onClick={(e)=>{setCurrentPageNum(currentPageNum-1);}} disabled={(postStatus!=='succeeded' || currentPageNum===1)?true:false}/>
                        <Pagination.Next disabled={(postStatus!=='succeeded' || currentPageNum===pages)?true:false} onClick={(e)=>{setCurrentPageNum(currentPageNum+1);}}/>
                       {pages>2 && <Pagination.Last  disabled={(postStatus!=='succeeded' || currentPageNum===pages)?true:false} onClick={(e) => {setCurrentPageNum(pages);}} />}
                    </Pagination>
                </div>
                </div>
                }
            </>
  }
  
