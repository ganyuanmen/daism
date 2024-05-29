
import { getData,execute } from './common'

export async function updateActor({actorName,actorDesc,selectImg,did,fileType} )
{
    return await execute("call i_actor(?,?,?,?,?)",
    [did,selectImg,actorDesc,actorName,fileType]);
}

export async function getUser (findFiled,findValue,selectFields) {
  let re=await getData(`select ${selectFields} from v_account where ${findFiled}=?`,
  [findValue]);
  return re.length?re[0]:{};
}


export async function getActor (did) {
  let re=await getData(`select * from a_actor where member_address=?`, [did]);
  return re.length?re[0]:{member_address:did,member_icon:'',member_nick:'',member_desc:''};
}
