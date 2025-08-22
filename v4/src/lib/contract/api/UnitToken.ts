import { ethers, type Contract,type Signer } from "ethers";

export default class UnitToken {

    private signer: Signer | ethers.Provider;
    private address: string;
    public abi: string[];
    private contract?: Contract;

  constructor(_signerOrProvider: Signer | ethers.Provider,_address: string) {
    this.signer = _signerOrProvider;
    this.address = _address;
    this.abi =[
        "function balanceOf(address) view returns (uint256)",
        "function getOutputAmount(uint256) view returns(uint256,uint256,uint256)",
        "function swap(address) returns (uint256)",
        "function transferWithCallback(address,uint256,bytes) returns (bool)"
      ];
  }

 /** 初始化合约实例 */
 private genegateContract(): Contract {
    if (!this.contract) {
      this.contract = new ethers.Contract(this.address, this.abi, this.signer);
    }
    return this.contract;
  }

   /** 查询utoken余额
   * @param _address 查询人
   */
   async balanceOf(_address: string): Promise<{ utoken: string; utokenWei: string }> {
    this.genegateContract();
    const result: bigint = await this.contract?.balanceOf(_address);
    return {
      utoken: ethers.formatUnits(result, 8),
      utokenWei: result.toString(),
    };
     
  }

  async getOutputAmount(amount: bigint | string | number): Promise<[bigint, bigint, bigint]> {
    this.genegateContract();
    return await this.contract!['getOutputAmount'](amount);
      
  }

  
  async swap(to: string, ethValue: string|number): Promise<ethers.TransactionReceipt> {
    this.genegateContract();
    const value = ethers.parseEther(ethValue+'');
    const tx = await this.contract!['swap'](to, { value });
    const receipt = await tx.wait();
    if (!receipt) throw new Error("UnitToken.swap failed");
    return receipt;
     
  }

  async transferWithCallback(to: string, amount: bigint | string | number, data: string): Promise<ethers.TransactionReceipt> {
    this.genegateContract();
    const tx = await this.contract!['transferWithCallback'](to, amount, data);
    const receipt = await tx.wait();
    if (!receipt) throw new Error("UnitToken.transferWithCallback failed");
    return receipt;
       
  }
}
