
import Loadding from '../../components/Loadding';
import ShowErrorBar from '../../components/ShowErrorBar';
import useMyTemplate from '../../hooks/useMyTemplate';
import TempList from './tempList';


export default function Mytemplate({user,t,tc,showError,closeTip,showTip}) {
    
    const tempData =useMyTemplate(user.account)
   
    return ( <>
            {tempData.data.length?<TempList tempData={tempData.data} user={user} showError={showError} closeTip={closeTip} showTip={showTip} t={t} tc={tc} />
            :tempData.status==='failed'?<ShowErrorBar errStr={tempData.error} />
            :tempData.status==='succeeded' && !tempData.data.length ? <ShowErrorBar errStr={tc('noDataText')}  />
            :<Loadding />
            }   
        </>
    );
}

