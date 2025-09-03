import { ethers,type Contract,type Signer } from "ethers";
// import commulate_abi from "../data/commulate.json";

/**
 * Commulate 合约前端调用封装
 * 用于查询代币兑换结果（不发交易，只读链上数据）
 */
export default class Commulate {
  private signer: Signer | ethers.Provider;
  private address: string;
  public abi: string[];
  private contract?: Contract;

  constructor(_signerOrProvider: Signer | ethers.Provider,_address: string) {
    this.signer = _signerOrProvider;
    this.address = _address;
    this.abi = [
      "function unitTokenToSCToken(uint256,uint256) view returns(uint256)",
      "function SCTokenToUnitToken(uint256,uint256) view returns(uint256)",
      "function SCTokenToSCToken(uint256,uint256,uint256) view returns(uint256,uint256)",
    ];
  }

  /** 初始化合约实例 */
  private genegateContract(): Contract {
    if (!this.contract) {
      this.contract = new ethers.Contract(this.address,this.abi,this.signer);
    }
    return this.contract;
  }

  /** utoken -> token */
  async unitTokenToDaoToken(_value: bigint | string, _id: number): Promise<bigint> {
    const contract = this.genegateContract();
    return await contract.unitTokenToSCToken(_value, _id);
  }

  /** token -> utoken */
  async daoTokenToUnitToken(_value: bigint | string, _id: number): Promise<bigint> {
    const contract = this.genegateContract();
    return await contract.SCTokenToUnitToken(_value, _id);
  }

  /** token -> token */
  async DaoTokenToDaoToken( _value: bigint | string, _id1: number, _id2: number): Promise<[bigint, bigint]> {
    const contract = this.genegateContract();
    return await contract.SCTokenToSCToken(_value, _id1, _id2);
  }

}
