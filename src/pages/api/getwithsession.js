import withSession from "../../lib/session";
import {discussionPageData} from '../../lib/mysql/discussion'
import {newsPageData} from '../../lib/mysql/news'
import { eventsPageData } from "../../lib/mysql/events";
import {getSource} from '../../lib/mysql/dao'

const methods={
    discussionPageData, //discussion 分页
    newsPageData,
    eventsPageData,
    getSource, //获取我的资源

}

export default withSession(async (req, res) => {
    if (req.method.toUpperCase()!== 'GET')  return res.status(405).json({errMsg:'Method Not Allowed'})
    const sessionUser = req.session.get('user');
    if (!sessionUser) return res.status(406).json({errMsg:'No wallet signature login'})

    try{
    
        res.status(200).json(await methods[req.headers.method](req.query))
    }
    catch(err)
    {
        console.error('post:/api/getwithsession:',req.headers.method,req.query,err)
        res.status(500).json({errMsg: 'fail'});
    }  

});

