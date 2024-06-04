

export default function PROFILE1({t,locale}) {


    return ( 
     <div>
        <h3><strong> {t('p0')}</strong></h3>
        <p className='fs-5 mt-1 mb-3' >
         {t('p1')}
        </p>
        <img src={`/dist_${locale}/images/p1.png`}  alt="" style={{ border:'2px solid gray',margin:'12px',marginBottom:'30px'}}   />  
        <h4><strong>{t('p2')} </strong></h4>
        <p className='fs-5 mt-1 mb-3' >
         {t('p3')}
        </p>
        <img src={`/dist_${locale}/images/p2.png`}  alt="" style={{ border:'2px solid gray',margin:'12px',marginBottom:'30px'}}   /> 

        <h4><strong> {t('p4')}</strong>    </h4>
        <p  className='fs-5 mt-1 mb-3' >
        {t('p5')}
        </p>
        <img src={`/dist_${locale}/images/p3.png`}  alt="" style={{ border:'2px solid gray',margin:'12px',marginBottom:'30px'}}   /> 
        <h4><strong> {t('p6')}</strong> </h4>
        <p  className='fs-5 mt-1 mb-3' >
        {t('p7')} 
        </p>
        <img src={`/dist_${locale}/images/p4.png`}  alt="" style={{ border:'2px solid gray',margin:'12px',marginBottom:'30px'}}   /> 
      
        <h4><strong> {t('p8')}</strong> </h4>
        <p  className='fs-5 mt-1 mb-3' >
            {t('p9')}
        </p>
     
      

     </div>

    );
}


  
    
