import { saveFollow,removeFollow } from "../../lib/mysql/folllow"
import { addEipType } from "../../lib/mysql/daism";
import { execute } from "../../lib/mysql/common";

export default async function handler(req, res) {

	if (req.method.toUpperCase()!== 'POST')  return res.status(405).json({errMsg:'broadcast Method Not Allowed'})
	let postbody
	try {
	if(typeof req.body==='string') postbody=JSON.parse(req.body)
	else postbody=req.body 
	} catch (error) {
	console.error("broadcast inbox error ",error,req.body)
	console.error(error)
	}
	// if( process.env.IS_DEBUGGER==='1') { 
	// console.info("-----------broadcast inbox post infomation-----------------------------------------------")
	// console.info(postbody)
	// console.info("----------------------------------------------------------")
	// }
	if(typeof(postbody)!=='object' || !postbody.type) return res.status(405).json({errMsg:'broadcast body json error'})

    if(postbody.type==='follow')
    {
      await saveFollow({actor:postbody.actor,user:postbody.user,followId:postbody.followId})
    }
    else if(postbody.type==='addType')
    {
        await addEipType({_type:postbody._type,_desc:postbody._desc});
    }
	else if(postbody.type==='removeFollow') 
	{
		await removeFollow(postbody.followId);
	}
	else if(postbody.type==='recover')
	{
		let sql="call recover_follow(?,?)";
		let paras=[postbody.user.account,postbody.actor?.account];
		await execute(sql,paras);
	}
	res.status(200).json({msg:'ok'})


}