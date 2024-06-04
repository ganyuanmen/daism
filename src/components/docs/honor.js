

export default function HONOR1({t,locale}) {


    return ( 
     <div>
        <h3><strong> {t('h0')}</strong></h3>
        <p className='fs-5 mt-1 mb-3' > {t('h1')}  </p>
        <p className='fs-5 mt-1 mb-3' >{t('h2')}    </p>
       
        <h4><strong>{t('h3')} </strong></h4>
        <p className='fs-5 mt-1 mb-3' > {t('h4')}    </p>
        <img src={`/dist_${locale}/images/h1.png`}  alt="" style={{ border:'2px solid gray',margin:'12px',marginBottom:'30px'}}   />  

        <h4><strong> {t('h5')}</strong>    </h4>
        <p  className='fs-5 mt-1 mb-3' > {t('h6')}    </p>
        
        <h4><strong> {t('h7')}</strong> </h4>
        <p  className='fs-5 mt-1 mb-3' >
            {t('h8')}
        
        </p>
        <img src={`/dist_${locale}/images/h2.png`}  alt="" style={{ border:'2px solid gray',margin:'12px',marginBottom:'30px'}}   /> 
      
       

     </div>

    );
}


  
    
