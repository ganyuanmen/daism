import { ethers, type Contract, type ContractTransactionResponse } from "ethers";
import abi from '../data/DAismDomain_abi.json'
export interface DomainInfo {
  domain: string;
  name: string;
}

export default class Domain {
  private signer: ethers.Signer;
  private address: string;
  private abi: any;
  private contract?: Contract;

  constructor( signer: ethers.Signer, address: string ) {
    this.signer = signer;
    this.address = address;
    this.abi = abi;
    // [
    //     "function record(uint256 _scId, string _domain) public returns (bool)",
    //     "function recordInfo(string _name, string _domain) public returns (bool)",
    //     "function scId2Domain(uint256) public view returns (string)",
    //     "function addr2Info(address) public view returns (tuple(string domain, string name))",
    //     "function ownerOf() public view returns (address)",
    // ];
  }

  private genegateContract() {
    if (!this.contract) {
      this.contract = new ethers.Contract(this.address, this.abi, this.signer);
    }
  }

  async record(_id: number | string, _domain: string): Promise<ContractTransactionResponse> {
    this.genegateContract();
    const tx = await this.contract?.record(_id, _domain);
    await tx.wait();
    return tx;
  }

  async recordInfo(_name: string, _domain: string): Promise<ContractTransactionResponse> {
    this.genegateContract();
    const tx = await this.contract?.recordInfo(_name, _domain);
    await tx.wait();
    return tx;
  }

  // ----------------- view functions -----------------

  async daoId2Domain(_id: number | string): Promise<string> {
    this.genegateContract();
    const result: string = await this.contract?.scId2Domain(_id);
    return result;
  }

  async addr2Info(_address: string): Promise<DomainInfo> {
    this.genegateContract();

    const result = await this.contract?.addr2Info(_address);
    return {
      domain: result.domain,
      name: result.name,
    };
  }
}
