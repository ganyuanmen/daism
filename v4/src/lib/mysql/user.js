
import { getJsonArray, getData,execute } from './common'

export async function updateActor({account,actorDesc,path} )
{
    return await execute("update a_account set actor_desc=?,avatar=? where actor_account=?",
    [actorDesc,path,account]);
}

export async function getUser(findFiled,findValue,selectFields) {
  let re=await getData(`select ${selectFields} from a_account where LOWER(${findFiled})=?`,
  [(findValue+'').toLowerCase()]);
  return re.length?re[0]:{};
}



export async function getActor (did) {
  const _actor=await getJsonArray('actor',[did],true)
  return _actor.manager?_actor:{manager:did,avatar:'',actor_name:'',actor_desc:'',actor_account:'',actor_url:''};
}
