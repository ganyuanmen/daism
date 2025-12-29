
import Clienwindow from "./Clienwindow";
import { getOne } from "@/lib/mysql/message";



export default async function Comment() {

    const obj=await  getOne({id:'07e7888a76234abe9b3f88ff128e5f5d',sctype:'sc'}) as EnkiMessType;
  
    return ( <Clienwindow enkiMessObj={obj} />);
}

