
import Loadding from '../../components/Loadding';
import ShowErrorBar from '../../components/ShowErrorBar';
import getMynft from '../../hooks/useMynft';
import Nftmint from './Nftmint';
import dynamic from 'next/dynamic';
import { useSelector,useDispatch } from 'react-redux';
import { useTranslations } from 'next-intl'

const Nftlist = dynamic(() => import('../enki3/Nftlist'), { ssr: false });
/**
 * 荣誉通证列表
 */
export default function Mynft({}) {
    const t = useTranslations('nft')
    const tc = useTranslations('Common')
    const user = useSelector((state) => state.valueData.user) //钱包用户信息
    const dispatch = useDispatch();
    function showError(str){dispatch(setMessageText(str))}
    function showTip(str){dispatch(setTipText(str))}
    function closeTip(){dispatch(setTipText(''))}

    const mynftData =getMynft(user.account) 

    return ( <>
            <Nftmint showError={showError} closeTip={closeTip} showTip={showTip} t={t} tc={tc} user={user} />
            {mynftData.data.length?<Nftlist mynftData={mynftData.data} />
            :mynftData.status==='failed'?<ShowErrorBar errStr={mynftData.error} />
            :mynftData.status==='succeeded' && !mynftData.data.length ? <ShowErrorBar errStr={tc('noDataText')}  />
            :<Loadding />
            }   
        </>
    );
}
