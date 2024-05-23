
import {Row,Col, Container,Tooltip,OverlayTrigger} from "react-bootstrap"
import React,{ useRef } from "react"
import { useTranslations } from 'next-intl'
import cssStyle from "../../styles/topSearch.module.css"
import Loadding from "../../components/Loadding"

const TopSearch = React.memo(({orderType,setOrderType,setOrderField,setCurrentPageNum,setSearchText,postStatus,orderIndex, setOrderIndex}) => {
    const t = useTranslations('dao')

// export default function TopSearch({t,orderType,setOrderType,setOrderField,setCurrentPageNum,setSearchText,postStatus})
// {
    const inputRef=useRef()
    const orderMenu=[
        {sortId:'dao_time',text:t('byTimeText')},
        {sortId:'dao_name',text:t('byNameText')},
        {sortId:'dao_ranking',text:t('byRankingtext')}
    ]
    // const [orderIndex, setOrderIndex) = useState(0) 
    
    return <Container >
            <Row className="mb-1 mt-3 align-items-center" >
                <Col className="Col-auto me-auto d-flex" >
                <OverlayTrigger placement="bottom" overlay={<Tooltip>{t('tipText')}</Tooltip>}>
                    <img className={cssStyle.top_find_img} src="/find.svg" width={18} height={18}  alt="find" onClick={(e) => {
                        setSearchText(inputRef.current.value.trim())
                        setCurrentPageNum(1)}}  />
                </OverlayTrigger>
                <input ref={inputRef} className={`form-control form-control-sm ${cssStyle.top_find_input}`} placeholder={t('seachText')}
                    onKeyDown={(e) => {if (e.key === "Enter") { setSearchText(e.target.value.trim())
                    setCurrentPageNum(1)}}}>
                </input>
                </Col>
                {postStatus!=='succeeded'?<Col className="col-auto"><Loadding size="sm" /> </Col>
                :<Col className="col-auto" >
                    {orderMenu.map((obj, idx) => (
                        <span key={idx} className={orderIndex===idx?`${cssStyle.top_item} ${cssStyle.top_order}`:cssStyle.top_item} onClick={e=>{
                            setOrderIndex(idx)
                            setOrderField(obj.sortId) 
                            setOrderType(!orderType)
                        }}>
                            {obj.text} {orderIndex ===idx && (orderType?"↓":"↑")}
                        </span>
                    ))}
                 </Col>
                }
           </Row>
        </Container>
})

export default TopSearch