
import React,{ useRef } from "react"
import { InputGroup,Form,Button } from "react-bootstrap"

/**
 * 社区搜索
 */

const CommunitySerach = React.memo(({t,searchPlace,setFetchWhere,fetchWhere}) => {
    const searRef=useRef()
 
    return <div className="sctop" >
            <InputGroup className="mb-3">
                <Form.Control ref={searRef} placeholder={searchPlace} onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        setFetchWhere({ ...fetchWhere, currentPageNum: 0, where: e.target.value })
                    }
                }}
                />
                <Button variant="outline-secondary" onClick={e => {
                    setFetchWhere({ ...fetchWhere, currentPageNum: 0, where: searRef.current.value })
                }} > {t('searchMainText')} </Button>
            </InputGroup>
            </div>
})

export default CommunitySerach