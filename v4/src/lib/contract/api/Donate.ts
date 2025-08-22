
import { ethers,type Contract,type ContractTransactionResponse, type Signer } from "ethers";

export default class Donate {
  private signer: Signer;
  private address: string;
  private abi: any;
  private contract?: Contract;

  constructor(_signer: Signer, _address: string) {
    this.signer = _signer;
    this.address = _address;
    this.abi = [ "function donate() payable"];
  }

  private genegateContract(): void {
    if (!this.contract) {
      this.contract = new ethers.Contract(this.address, this.abi, this.signer);
    }
  }

  /**
   * 调用 donate 方法并发送 ETH
   * @param v 捐赠 ETH 数量（例如 "0.5"）
   */
  async donate(v: string | number): Promise<ContractTransactionResponse> {
    this.genegateContract();
    const _amount = ethers.parseEther(String(v));
    const tx = await this.contract!.donate({ value: _amount });
    await tx.wait();
    return tx;
  }
}
