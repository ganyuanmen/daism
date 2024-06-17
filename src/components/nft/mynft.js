
import Loadding from '../../components/Loadding';
import { Card } from 'react-bootstrap';
import ShowErrorBar from '../../components/ShowErrorBar';
import getMynft from '../../hooks/useMynft';
import Nftmint from './Nftmint';
import ShowAddress from '../ShowAddress';


export default function Mynft({user,t,tc,showError,closeTip,showTip}) {
    const mynftData =getMynft(user.account) 

    return ( <>
            <Nftmint showError={showError} closeTip={closeTip} showTip={showTip} t={t} tc={tc} user={user} />
            {mynftData.data.length?<Nftlist mynftData={mynftData}  />
            :mynftData.status==='failed'?<ShowErrorBar errStr={mynftData.error} />
            :mynftData.status==='succeeded' && !mynftData.data.length ? <ShowErrorBar errStr={tc('noDataText')}  />
            :<Loadding />
            }   
        </>
    );
}


function Nftlist({mynftData})
{
   
    function svgToBase(svgCode) {
	    const utf8Bytes = new window.TextEncoder().encode(svgCode);
	    return 'data:image/svg+xml;base64,' +window.btoa(String.fromCharCode.apply(null, utf8Bytes));
	  }

    
    return ( 
            <>  
          <div className='d-flex flex-wrap justify-content-start align-items-center' style={{width:'100%'}}  >
                     {mynftData.data.map((obj,idx)=>(
                           <Card key={`c_${idx}`}  style={{margin:'10px'}}> 
                          
                           <Card.Body>
                           {/* <div className='d-flex justify-content-center align-items-center' style={{width:"30px",height:"160px"}}  dangerouslySetInnerHTML={{__html: obj.tokensvg}}></div> */}
                           <img src={svgToBase(obj.tokensvg)} style={{width:'260px',height:'260px',borderRadius:'50%'}} />
                            <div>owner: <ShowAddress address={obj.to_address} isb={true} /> </div> 
                            <div>ID:<b> {obj.token_id}</b></div> 
                            <div>blockNumber:<b>{obj.block_num}</b></div> 
                            <div>contract:<ShowAddress address={obj.contract_address} isb={true} /></div> 
                            <div>time:<b>{obj._time}(UTC+8)</b></div> 
                            <div>issue: <b>{obj._type!==1?obj.dao_name:'daism.io'}</b></div>
                            
                           </Card.Body>
                           </Card>
                        ))
                        }

                 
            </div>
                
               
           </>
    )

}
