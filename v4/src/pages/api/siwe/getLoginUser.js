
import withSession from "../../../lib/session";
import {getClientIp} from '../../../lib/utils'
//'../../../lib/utils'

export default withSession(async (req, res) => {
    let state=0;
    try {
        const sessionUser = req.session.get('user');
        const currentIp = getClientIp(req);
        if (sessionUser && sessionUser.ip === currentIp && sessionUser.userAgent === req.headers['user-agent']) state=1;
    } catch (error) {
        console.error(error)
    }
  
    res.status(200).json({state});   
});