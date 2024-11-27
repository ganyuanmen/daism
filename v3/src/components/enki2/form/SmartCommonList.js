import { Row,Col } from "react-bootstrap";
import iaddStyle from '../../../styles/iadd.module.css'
import { useSelector,useDispatch } from 'react-redux';
import {setDaoFilter} from '../../../data/valueData'
//
export default function SmartCommonList({callBack})
{

    const daoFilter = useSelector((state) => state.valueData.daoFilter)
    const daoList = useSelector((state) => state.valueData.daoList)
    const dispatch = useDispatch();

    return(
        <div style={{backgroundColor:'white',width:'100%',padding:'20px'}} >
            <TopSearch daoList={daoList} dispatch={dispatch} /> 
            {daoFilter.map((obj, idx) =>                 
                <Row key={idx} className={`mb-1 ${iaddStyle.iadd_tokenlist}`}  onClick={()=>{callBack(obj)}} >
                    <Col className="Col-auto me-auto d-flex  align-items-center" >
                        <img width={36} height={36}  alt="" src={obj.avatar ? obj.avatar : '/logo.svg'} style={{borderRadius:'10px'}}  />
                        <div style={{paddingLeft:'12px'}} >
                            <div style={{color:'#0D111C',fontSize:'16px'}} >{obj.dao_name}</div>
                            <div style={{color:'#98AEC0',fontSize:'12px'}} >{obj.actor_name}</div>
                        </div>
                    </Col>
                    <Col className="col-auto">
                        <span style={{color:'#0D111C',fontSize:'1.2rem'}} >{obj.amount}</span>
                    </Col>
                </Row>            
                )
                }
        </div>);
}


function TopSearch({daoList,dispatch})
{ 
    const checkAddress = (v) => {return /^0x[0-9,a-f,A-F]{40}$/.test(v);}; 
    
    return <div className="d-flex mb-2" style={{paddingLeft:'16px',paddingRight:'6px'}}  >
                <img alt="" width={20} height={20} className={iaddStyle.iadd_find_img} src="/find.svg" />
                <input autoComplete="off" className={`form-control form-control-lg ${iaddStyle.iadd_find_input}`} 
                placeholder='Search name or paste dApp address' onChange={
                    e=>{
                        let v=e.currentTarget.value.toLowerCase().trim()
                        if(!v) dispatch(setDaoFilter(daoList))
                        else {
                            let curData
                            if(checkAddress(v))  curData=daoList.filter(o=>o.manager.toLowerCase()===v)
                            else curData=daoList.filter(o=>(o.dao_name.toLowerCase().includes(v)||o.actor_name.toLowerCase().includes(v)))
                            dispatch(setDaoFilter(curData))
                        }
                    }
                }  />
           </div>
}
