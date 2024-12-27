import { useState } from 'react';
import ProsPage from '../pro/ProsPage';
import ProHistory from '../pro/ProHistory';
import { Form } from 'react-bootstrap';
import { useTranslations } from 'next-intl'


/**
 * 我的提案
 */
export default function Proposal({user,tc}) {
    const [st,setSt]=useState(0)  //0 未完成 ，1 已完成 2 过期 
    const t = useTranslations('dao')  

    return ( 
        <>
           <Form>
                <Form.Check inline label={t('noCompletetext')} name="group1" type='radio' defaultChecked={st===0} onClick={e=>
                    {if(e.target.checked) setSt(0)}}  id='inline-2' />
                <Form.Check inline label={t('completeText')} name="group1" type='radio' defaultChecked={st===1} onClick={e=>
                    {if(e.target.checked) setSt(1)}}  id='inline-1' />
                <Form.Check inline label={t('nocompleteText')} name="group1" type='radio' defaultChecked={st===1} onClick={e=>
                    {if(e.target.checked) setSt(2)}}  id='inline-1' />
                <Form.Check inline label={t('expireText')} name="group1" type='radio' defaultChecked={st===2} onClick={e=>
                    {if(e.target.checked) setSt(3)}}  id='inline-3' />
            </Form>
    
            {st>0 && <ProHistory user={user} t={t} tc={tc} st={st} />}
            {st===0 && <ProsPage  user={user} t={t} tc={tc} />}
        
      
        </>

    );
}


  
    
