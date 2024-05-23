import { getJsonArray } from "../../lib/mysql/common"

export default async function handler(req, res) {
    let para=req.query
    let re=await getJsonArray('checkdao',[para.daoName,para.daoSymbol,para.creator],true)
    res.status(200).json(re)
  }
  