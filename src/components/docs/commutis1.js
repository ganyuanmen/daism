

export default function Commutis1({t,locale}) {
    

    return ( 
     <div>
          <h3><strong> {t('c0')}</strong></h3>
        <p className='fs-5 mt-1 mb-3' >{t('c1')} </p>

        <h3><strong> {t('c2')}</strong></h3>
        <p className='fs-5 mt-1 mb-3' > {t('c3')}       </p>
        <h4><strong>{t('c4')}  </strong></h4>
        <ul  className='fs-5' >
            <li>{t('c5')}</li>
            <li>{t('c6')}</li>
          
        </ul>


        <h4><strong> {t('c7')} </strong>    </h4>
        <ul  className='fs-5' >
            <li>{t('c8')}</li>
            <li>{t('c9')}<br/>
            <img src={`/dist_${locale}/images/r01.png`}  alt="" style={{ border:'2px solid gray',margin:'12px'}}   /> 
            <img src={`/dist_${locale}/images/r02.png`}   alt="" style={{ border:'2px solid gray',margin:'12px'}}   /> 
          
            </li>
            <li>{t('c10')}<br/>
            <img src={`/dist_${locale}/images/r03.png`}   alt="" style={{ border:'2px solid gray',margin:'12px'}}   /> 
            </li>
        </ul>

        <p  className='fs-5 mt-1 mb-3' >
        {t('c11')}
        </p>

        <h4><strong> {t('c12')} </strong>    </h4>
        <img src={`/dist_${locale}/images/info2.png`}   alt="" style={{ border:'2px solid gray',margin:'12px'}}   /> 
        <p  className='fs-5 mt-1 mb-3' >
        {t('c13')}
        </p>
        <img src={`/dist_${locale}/images/info3.png`}   alt="" style={{ border:'2px solid gray',margin:'12px'}}   /> 
     </div>

    );
}


  
    
