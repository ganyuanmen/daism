

export default function IADDS1({t,locale}) {

    return ( 
     <div>
        <h3><strong>{t('i0')} </strong></h3>
        <p className='fs-5 mt-1 mb-3' > {t('i1')}</p>
        <h4><strong>{t('i2')} </strong></h4>
        <ul  className='fs-5' >
            <li>ETH {t('i3')} UTO</li>
            <li>ETH {t('i3')} token</li>
            <li>UTO {t('i3')} token</li>
            <li>token {t('i3')} UTO</li>
            <li>token {t('i3')} token</li>
        </ul>


        <h4><strong> Smart Common {t('i4')} </strong>    </h4>
        <p  className='fs-5 mt-1 mb-3' > {t('i5')} </p>
        <h4><strong>{t('i6')} </strong> </h4>
        <p  className='fs-5 mt-1 mb-3' >{t('i7')}</p>
        <img src={`/dist_${locale}/images/iadd1.png`}  alt="" style={{ border:'2px solid gray',margin:'12px'}}   /> 
        <p  className='fs-5 mt-1 mb-3' >{t('i8')}  </p>
        <img src={`/dist_${locale}/images/iadd2.png`}  alt="" style={{ border:'2px solid gray',margin:'12px'}}   /> 
        <img src={`/dist_${locale}/images/iadd3.png`}  alt="" style={{ border:'2px solid gray',margin:'12px'}}   /> 
     </div>

    );
}


  
    
