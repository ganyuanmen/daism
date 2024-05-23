import { handleEnv } from "../../../lib/utils/handleEnv"

export default async function handler(req, res) {
      try{
        if(!process.env.DAIMADDRESS) handleEnv()
        if( process.env.IS_DEBUGGER==='1') console.log(process.env.DAIMADDRESS)
           //administrator 已插入 DAIMADDRESS
            res.status(200).json(JSON.parse(process.env.DAIMADDRESS))
      }
      catch(err)
      {
            console.error(`get: /api/siwe/daoaddress:`,err)
            res.status(500).json({errMsg: 'fail'});
      }  
}