import { useState } from "react"

export default function ShowImg({path,alt,...props})
{
  const [isrc,setIsrc]=useState('')

  if(path) {
    if(path.endsWith('.svg')) {
      fetch(`/api/getimage?path=${path}`).then(async res=>{if(res.status===200) setIsrc(await res.text())})
      return <img alt={alt} src={isrc} style={props} />
    }
    else 
    return <img alt={alt} src={`/api/getimage?path=${path}`} style={props} />
  } else return <></>
}