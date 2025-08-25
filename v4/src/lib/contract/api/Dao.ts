import {type Contract, type ContractTransactionResponse,type ContractRunner, ethers } from "ethers";
import abi from '../data/SC_abi.json'

export default class Dao {
  private signer: ContractRunner;
  private abi: any;

  constructor( _signer: ContractRunner) {
    this.signer = _signer;
    // const SC_ABI =
    //  [
    //     "function addProposal((string desc, address account, uint16 dividendRights, uint8 proposalType, uint32 createTime, uint16 rights, uint16 antirights) _proposal, (string fileType, string fileContent) _logo) returns (bool)",
    //     "function vote(bool isAnti) returns (bool)",
    //     "function getDividend(address owner) returns (uint amount)",
    //     "function dividend(address owner) view returns (uint amount)",
    //     "function isVotable() view returns (bool)"
    //   ] as const;
    this.abi =abi;
  }

  private genegateContract(address: string): Contract {
    return new ethers.Contract(address, this.abi, this.signer);
  }

  // 添加提案
  async addProposal(delegator: string,proposal: Proposal,file: SCFile = { fileType: "svg", fileContent: "0x54" }
  ): Promise<ContractTransactionResponse> {
    const contract = this.genegateContract(delegator);
    const tx: ContractTransactionResponse = await contract.addProposal(proposal, file);
    await tx.wait();
    return tx;
  }

  // 投票
  async vote(delegator: string, flag: boolean): Promise<ContractTransactionResponse> {
    const contract = this.genegateContract(delegator);
    const tx: ContractTransactionResponse = await contract.vote(flag);
    await tx.wait();
    return tx;
  }

   // 查询分红
  async dividend(delegator: string, _address: string): Promise<bigint> {
    const contract = this.genegateContract(delegator);
    return await contract.dividend(_address);
  }

  //领取分红
  async getDividend(delegator: string, _address: string): Promise<ContractTransactionResponse> {
    const contract = this.genegateContract(delegator);
    const tx: ContractTransactionResponse = await contract.getDividend(_address);
    await tx.wait();
    return tx;
  }

//   是否可投票
  async isVotable(delegator: string): Promise<boolean> {
    const contract = this.genegateContract(delegator);
    return await contract.isVotable();
  }
}
