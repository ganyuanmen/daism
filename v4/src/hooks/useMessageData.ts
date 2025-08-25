
import { useFetch } from './useFetch';

  

export function useFollow(account: string,method:string) {
    return useFetch<ActorInfo[]>(`/api/getData?account=${account}` ,method);
  }

  export function useTip(manager: string,method:string) {
    return useFetch<DaismTipType[]>(`/api/getData?manager=${manager}` ,method);
  }

 export interface EipTypes{
    type_name:string;
    type_desc:string;
 }
 export function useEipTypes() {
    return useFetch<DaismTipType[]>(`/api/getData` ,'getEipTypes');
  }


  export interface HeartAndBookType{
    total:number;
    pid:string;
  }
  
  //点赞或收藏
  export function useGetHeartAndBook(account:string|undefined,pid:string|undefined,refresh:boolean,table:string,sctype:string) {
    return useFetch<HeartAndBookType>(`/api/getData?account=${account}&pid=${pid}&table=${table}&sctype=${sctype}` ,'getHeartAndBook',[refresh]);
  }


