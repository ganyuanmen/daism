import { useState } from 'react';
import ProsPage from '../pro/ProsPage';
import ProHistory from '../pro/ProHistory';
import { Form } from 'react-bootstrap';
import { useTranslations } from 'next-intl'


/**
 * 我的提案
 */
export default function Proposal({user,tc}) {
    const [showIndex,setShowIndex]=useState(true)
    const t = useTranslations('dao')  

    return ( 
        <>
           <Form>
                <Form.Check inline label={t('noCompletetext')} name="group1" type='radio' defaultChecked={showIndex} onClick={e=>setShowIndex(true)}  id='inline-2' />
                <Form.Check inline label={t('completeText')} name="group1" type='radio' defaultChecked={!showIndex} onClick={e=>{setShowIndex(false)}}  id='inline-1' />
            </Form>
    
            {!showIndex?<ProHistory user={user} t={t} tc={tc} />
                :<ProsPage  user={user} t={t} tc={tc} />
            }
        
      
        </>

    );
}


  
    
