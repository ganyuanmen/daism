import withSession from "../../lib/session";
import {getClientIp} from '../../lib/utils'

const methods={

}

export default withSession(async (req, res) => {
    if (req.method.toUpperCase()!== 'GET')  return res.status(405).json({errMsg:'Method Not Allowed'})
    const sessionUser = req.session.get('user');
    const currentIp = getClientIp(req);
    if (!sessionUser || sessionUser.ip !== currentIp || sessionUser.userAgent !== req.headers['user-agent'])
         return res.status(406).json({errMsg:'No wallet signature login'})

    try{
    
        res.status(200).json(await methods[req.headers.method](req.query))
    }
    catch(err)
    {
        console.error('post:/api/getwithsession:',req.headers.method,req.query,err)
        res.status(500).json({errMsg: 'fail'});
    }  

});

