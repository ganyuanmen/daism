import { type Contract, type ContractTransactionResponse,type Signer, ethers } from "ethers";
import abi from '../data/SCRegistrar_abi.json';
export default class Register {
  private contract?: Contract;
  private signer: Signer;
  private address: string;
  private abi:any;

  constructor( _signer: Signer, _address: string) {
    this.signer = _signer;
    this.address = _address;
    this.abi =abi;
    // [
    //     "function toProxy(uint256) view returns (address)",
    //     "function createSC((string,string,string,address,uint16,string),address[],uint16[],uint16,uint32,uint32,(string,string),bytes) returns (uint256)",
    //     "function proposeUpdate(uint256,address)"
    // ];
  }

  private genegateContract(): Contract {
    if (!this.contract) {
      this.contract = new ethers.Contract(this.address, this.abi, this.signer);
    }
    return this.contract;
  }

//   async createSC(daoinfo:SCInfo, memberAr:string[],voteAr:string[],_src:string,_type:string
//     ,_bytes:string // bytes 类型，传 "" 或 "0x" 表示空
//     ,s:number,life:number,cool:number): Promise<ContractTransactionResponse> {
//       const contract = this.genegateContract();
//     let result = await contract.createSC(daoinfo, memberAr,voteAr
//         ,s,life * 24 * 3600,cool * 24 * 3600,[_type,_src],_bytes);
//     await result.wait()
//     return result
// }

  async createSC(scInfo: SCInfo,members: string[],dividendRights: string[],strategy: number,lifetime: number,
    coolingPeriod: number,logo: SCFile,data: string // bytes 类型，传 "" 或 "0x" 表示空
  ): Promise<ContractTransactionResponse> {
    const contract = this.genegateContract();
    const result =  await contract.createSC(
      scInfo,
      members,
      dividendRights,
      strategy,
      lifetime * 24 * 3600,
      coolingPeriod* 24 * 3600,
      logo,
      data
    );
    await result.wait();
    return result;
  }

  //修改dap 地址， 必须是dapp 地址
  async proposeUpdate(dao_id: number|string, newCreator: string): Promise<ContractTransactionResponse> {
    const contract = this.genegateContract();
    const result = await contract.proposeUpdate(dao_id, newCreator);
    await result.wait();
    return result;
  }

  async toProxy(_id: number): Promise<string> {
    const contract = this.genegateContract();
    return await contract.toProxy(_id);
  }
}
