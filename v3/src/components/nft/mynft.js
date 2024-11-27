
import Loadding from '../../components/Loadding';
import ShowErrorBar from '../../components/ShowErrorBar';
import getMynft from '../../hooks/useMynft';
import Nftmint from './Nftmint';
import dynamic from 'next/dynamic';

const Nftlist = dynamic(() => import('../enki3/Nftlist'), { ssr: false });

export default function Mynft({user,t,tc,showError,closeTip,showTip}) {
    const mynftData =getMynft(user.account) 

    return ( <>
            <Nftmint showError={showError} closeTip={closeTip} showTip={showTip} t={t} tc={tc} user={user} />
            {mynftData.data.length?<Nftlist mynftData={mynftData.data} t={t} />
            :mynftData.status==='failed'?<ShowErrorBar errStr={mynftData.error} />
            :mynftData.status==='succeeded' && !mynftData.data.length ? <ShowErrorBar errStr={tc('noDataText')}  />
            :<Loadding />
            }   
        </>
    );
}
