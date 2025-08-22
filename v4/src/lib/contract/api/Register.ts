import { type Contract, type ContractTransactionResponse,type Signer, ethers } from "ethers";
import abi from '../data/SCRegistrar_abi.json';
export default class Register {
  private contract?: Contract;
  private signer: Signer;
  private address: string;
  private abi:string[];

  constructor( _signer: Signer, _address: string) {
    this.signer = _signer;
    this.address = _address;
    this.abi =[
        "function toProxy(uint256) view returns (address)",
        "function createSC((string,string,string,address,uint16,string),address[],uint16[],uint16,uint32,uint32,(string,string),bytes) returns (uint256)",
        "function proposeUpdate(uint256,address)"
    ];
  }

  private genegateContract(): Contract {
    if (!this.contract) {
      this.contract = new ethers.Contract(this.address, this.abi, this.signer);
    }
    return this.contract;
  }

  async createSC(scInfo: SCInfo,members: string[],dividendRights: number[],strategy: number,lifetime: number,
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
  async proposeUpdate(dao_id: number, newCreator: string): Promise<ContractTransactionResponse> {
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
