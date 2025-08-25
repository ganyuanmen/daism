
import { ChangeEvent, useRef } from "react";
import iaddStyle from '@/styles/iadd.module.css'
import { Modal,Button,Row,Col,CloseButton} from "react-bootstrap";
import { useSelector,useDispatch } from 'react-redux';
import { useTranslations } from 'next-intl'
import Image from "next/image";
import {type RootState, type AppDispatch, setTokenFilter} from '@/store/store';

interface SwapWindowProps {
    workspace: string;
    show: boolean;
    setShow: (show: boolean) => void;
    selectToken:(obj:DaismToken)=>void; //设置 inObj 或outObj
  }

/**
 * @setShow 隐藏窗口
 * @show 上层窗口控制显示
 * @param {int} workIndex  表示从哪里打开窗口，-2:上，-1:下
 * @returns 
 */
export default function SwapWindow({ workspace, show, setShow,selectToken }: SwapWindowProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const tokenFilter = useSelector((state: RootState) => state.valueData.tokenFilter);
    const tokenList = useSelector((state: RootState) => state.valueData.tokenList);
    const dispatch = useDispatch<AppDispatch>();
    const ethObj:DaismToken={dao_id:-2,dao_logo:'/eth.png',dao_name:'ETH',dao_symbol:'ETH',delegator:'',token_cost:0,token_id:-2}
    const utokenObj:DaismToken={dao_id:-1,dao_logo:'/vita.svg',dao_name:'UTO',dao_symbol:'UTO',delegator:'',token_cost:0,token_id:-1}
    const t = useTranslations('iadd')
  
    //选择 token 后处理
    const clickSelect = (obj:DaismToken) => {  
      selectToken(obj);
      setShow(false);
    
    }
   
    return ( 
        <Modal show={show} scrollable={true} className="daism-title" 
            onShow={() => {
                if (inputRef.current) inputRef.current.value = '';
                if (tokenList.length !== tokenFilter.length) dispatch(setTokenFilter(tokenList));
            }}
            onHide={() => {setShow(false)}}>

            <Modal.Header style={{padding:0,margin:0}} >
                <div style={{width:'100%'}} >
                    <div className="mb-2 mt-2 d-flex justify-content-between align-items-center" style={{padding:'4px 18px 4px 18px'}}  >
                        <div> Token {t('selectText')} </div>
                        <CloseButton onClick={e=>{setShow(false)}} />
                    </div>
                    <div style={{backgroundColor:'white',width:'100%',padding:'10px'}} >
                        <TopSearch tokenList={tokenList} dispatch={dispatch} inputRef={inputRef}  />
                        <div>
                        {/* 上层窗口打开多显示eth */}
                        {workspace==='up' && <Button className={iaddStyle.iadd_btn} variant="outline-secondary"  onClick={()=>clickSelect(ethObj)}>
                            <img alt='' width={24} height={24}  src='/eth.png' />
                            <span className={iaddStyle.iadd_text} >ETH</span>
                        </Button>
                        }{'   '}
                        <Button className={iaddStyle.iadd_btn} variant="outline-secondary"  onClick={()=>clickSelect(utokenObj)} >
                            <img alt='' width={24} height={24}  src='/vita.svg' />
                            <span  className={iaddStyle.iadd_text}>UTO</span>
                        </Button> 
                        </div>
                    </div>
                </div>
            </Modal.Header>
            <Modal.Body>
              
             {tokenFilter.map((obj, idx) =>                 
               <Row key={idx} className={`mb-1 ${iaddStyle.iadd_tokenlist}`}  onClick={()=>{clickSelect(obj)}} >
                    <Col className="Col-auto me-auto d-flex  align-items-center" >
                        <img width={36} height={36}  alt="" src={obj.dao_logo ? obj.dao_logo : '/logo.svg'}  />
                        <div style={{paddingLeft:'12px'}} >
                            <div style={{color:'#0D111C',fontSize:'16px'}} >{obj.dao_name}</div>
                            <div style={{color:'#98AEC0',fontSize:'12px'}} >{obj.dao_symbol}</div>
                        </div>

                    </Col>
                    <Col className="col-auto" >
                        <span style={{color:'#0D111C',fontSize:'1.2rem'}} >{obj.token_cost}</span>
                    </Col>
               </Row>            
                )
             }
            </Modal.Body>
            </Modal> ) 
}


interface TopSearchProps {
    tokenList: DaismToken[];
    dispatch: AppDispatch;
    inputRef: React.RefObject<HTMLInputElement | null>;
}
  
  function TopSearch({ tokenList, dispatch, inputRef }: TopSearchProps) {
    const checkAddress = (v: string) => /^0x[0-9a-fA-F]{40}$/.test(v);
  
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const v = e.currentTarget.value.toLowerCase().trim();
      if (!v) {
        dispatch(setTokenFilter(tokenList));
      } else {
        let curData: DaismToken[];
        if (checkAddress(v)) curData = tokenList.filter(o => o.delegator.toLowerCase() === v);
        else curData = tokenList.filter(o => o.dao_name.toLowerCase().includes(v));
        dispatch(setTokenFilter(curData));
      }
    };
  
    return (
      <div className="d-flex mb-2" style={{ paddingLeft: '16px', paddingRight: '6px' }}>
        <Image
          alt=""
          width={20}
          height={20}
          className={iaddStyle.iadd_find_img}
          src="/find.svg"
        />
        <input
          ref={inputRef}
          autoComplete="off"
          className={`form-control form-control-lg ${iaddStyle.iadd_find_input}`}
          placeholder="Search name or paste address"
          onChange={handleChange}
        />
      </div>
    );
  }