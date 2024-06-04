import { Alert } from "react-bootstrap"


export default function My1({t,locale}) {


    return ( 
     <div>
     
        <ul  className='fs-5' >
            <li><Alert>{t('m0')}</Alert>
                <div>
                <img src={`/dist_${locale}/images/my3.png`}  alt="" style={{ border:'2px solid gray',margin:'12px'}}   /> 
                </div>
            </li>

            <li><Alert>{t('m1')}</Alert>
            <div>
                <img src={`/dist_${locale}/images/my4.png`}  alt="" style={{ border:'2px solid gray',margin:'12px'}}   /> 
            </div>
            <p  > {t('m2')}     </p>
            
            </li>
            <li><Alert>{t('m3')}</Alert>
            <div>
                <img src={`/dist_${locale}/images/my5.png`}  alt="" style={{ border:'2px solid gray',margin:'12px'}}   /> 
            </div>
            <p  className='fs-5 mt-1 mb-3' >{t('m4')} </p>
            <ol>
                <li>{t('m5')}</li>
                <li>{t('m6')}</li>
                <li>{t('m7')}</li>
                <li>{t('m8')}</li>
                <li>{t('m9')}</li>
                <li>{t('m10')}</li>
                <li>{t('m11')}</li>
                <li>{t('m12')}</li>
            </ol>
            {t('m13')}
            <img src={`/dist_${locale}/images/my7.png`}  alt="" style={{ border:'2px solid gray',margin:'12px'}}   /> 
            </li>
            <li><Alert>{t('m14')}</Alert>
            <div>
                <img src={`/dist_${locale}/images/my6.png`}  alt="" style={{ border:'2px solid gray',margin:'12px'}}   /> 
            </div>
            <p  className='fs-5 mt-1 mb-3' >  {t('m15')}         </p>
            <ol>
                <li>{t('m16')}</li>
                <li>{t('m17')}</li>
            </ol>
            <br/>
            <div>
                {t('m18')}
            </div>
            <br/>
            <div>
            {t('m19')} <br/>
{t('m20')}<br/>

{t('m21')}
            </div>
            </li>
            
        </ul>


     </div>

    );
}


  
    
