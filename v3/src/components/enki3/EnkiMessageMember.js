import EnkiMember from "../enki2/form/EnkiMember";
import { useState,useEffect } from "react";
import { client } from "../../lib/api/client";

export default function EnkiMessageMember({t,messageObj,locale})
{
    const [honor,setHonor]=useState([])

    useEffect(()=>{
        const fetchData = async () => {
            try {
                const res = await client.get(`/api/getData?did=${messageObj.manager}`,'getMynft');
                if(res.status===200){
                    if(Array.isArray(res.data)){
                      setHonor(res.data)
                    }
                } 
            } catch (error) {
                console.error(error);
            } 
        };

        if(messageObj.dao_id==0 && messageObj?.manager){
            fetchData()
        }
    },[messageObj])

    const svgToBase=(svgCode)=> {
	    const utf8Bytes = new window.TextEncoder().encode(svgCode);
	    return 'data:image/svg+xml;base64,' +window.btoa(String.fromCharCode.apply(null, utf8Bytes));
	  }

      const geneHonor=()=>{
        if(honor.length>3){
            return <>
            <img src={svgToBase(honor[0].tokensvg)} className="honor"  />
            <img src={svgToBase(honor[1].tokensvg)} className="honor"  />
            <img src={svgToBase(honor[2].tokensvg)} className="honor"  />
            <a className="daism-a btn"  href={`/${locale}/honortokens/${messageObj.manager}`} >{t('moreText')}...</a>
            </>
        }
        else {
            return honor.map((obj,idx)=>(<img key={idx} src={svgToBase(obj.tokensvg)} className="honor"  />));
        }

    }

    return( 
  
        <div className="d-inline-flex align-items-center" >
           
           <EnkiMember messageObj={messageObj} locale={locale} isLocal={messageObj?.actor_id>0} />
            <div > {geneHonor()}   </div>
        </div>
   
    );
}

