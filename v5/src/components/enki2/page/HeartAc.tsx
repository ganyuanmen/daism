import Loadding from "@/components/Loadding";
import ShowErrorBar from "@/components/ShowErrorBar";
import { useFetch } from "@/hooks/useFetch";
import { Heart } from "@/lib/jssvg/SvgCollection";
import { HeartMyAccount } from "@/lib/mysql/daism";



interface EnKiHeartProps {
  currentObj: EnkiMessType;

}

export default function HeartAc({ currentObj }: EnKiHeartProps) {


  const getSctype = () => {
    return  currentObj?.dao_id && currentObj.dao_id > 0
          ? 'sc'
          : '';
  };


  const {data,status,error,refetch} = useFetch<HeartMyAccount>(`/api/getData?pid=${currentObj.message_id}&table=${getSctype()}`,
  'getMyHeart',[]);


  return ( <>
    {
      status==='loading'?<Loadding isImg={true} spinnerSize="sm" />
      :(status==='failed' || !data)? <ShowErrorBar errStr={error??'get data err'} />
      :  data.username? <div style={{borderBottom:'1px solid #D2D2D2',textAlign:'center'}} > <Heart size={20} /> : { data.username}</div>:''
    }
  </>
   
  );
}
