// DaoToken.ts
import type { Contract, ContractTransactionResponse, Signer } from 'ethers';
import { ethers } from 'ethers';


export default class DaoToken {
  private contract?: Contract;
  private signer: Signer;
  private address: string;
  private abi: string[];

  constructor(signer: Signer, address: string) {
    this.signer = signer;
    this.address = address;
    this.abi =[
        "function balanceOf(uint256,address) view returns (uint256)",
        "function transferWithCallback(uint256,address,uint256,bytes) returns (bool)"
    ];
  }

  /** 初始化或获取合约实例 */
  private genegateContract(): Contract {
    if (!this.contract) {
      this.contract = new ethers.Contract(this.address, this.abi, this.signer);
    }
    return this.contract;
  }

  /** 查询 token balance */
  async balanceOf(_id: number | bigint, _address: string): Promise<{ token: string; tokenWei: string }> {
    const contract = this.genegateContract();
    const result = await contract.balanceOf(_id, _address);
    return {
      token: ethers.formatEther(result),
      tokenWei: result.toString(),
    };
  }

  /** 转账并带回调 */
  async transferWithCallback(
    _id: number | bigint,
    _address: string,
    _amount: bigint | string,
    _data: string
  ): Promise<ethers.TransactionReceipt> {
    const contract = this.genegateContract();
    // 直接调用合约方法，ethers v6 不再使用 .send
    const tx: ContractTransactionResponse = await contract.transferWithCallback(_id, _address, _amount, _data);
    const receipt = await tx.wait();
    if (!receipt) throw new Error("UnitToken.transferWithCallback failed");
    return receipt;
    // await tx.wait();
    // return tx;
  }
}
