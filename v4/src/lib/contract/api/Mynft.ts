import {type  Contract, type ContractTransactionResponse,type Signer, ethers } from "ethers";

export default class Mynft {
  private contract?: Contract;
  private signer: Signer;
  private address: string;
  private abi:any;

  constructor(_signer: Signer,_address: string) {
    this.signer = _signer;
    this.address = _address;
    const nft_min_sig = [
        "function mint(uint256 _scId,address _to,string[] _tips) returns(uint256)",
        "function mintBatch(uint256 _scId,address[] _to,string[] _tips,uint256 _num) returns(uint256[][])",
        "function getNFT(uint256 tokenId) view returns((string fileType,string fileContent),string[])"
      ] as const;
    this.abi = nft_min_sig;
  }

  private genegateContract() {
    if (!this.contract) {
      this.contract = new ethers.Contract(this.address,this.abi,this.signer);
    }
  }

  async mint(dao_id: bigint | number,_address: string,tipAr: string[]): Promise<ContractTransactionResponse> {
    this.genegateContract();
    const result = await this.contract!.mint(dao_id, _address, tipAr);
    await result.wait();
    return result;
  }

  async mintBatch( dao_id: bigint | number, _addressAr: string[], tipsAr: string[], num: bigint | number ): Promise<ContractTransactionResponse> {
    this.genegateContract();
    const result = await this.contract!.mintBatch(dao_id, _addressAr, tipsAr, num);
    await result.wait();
    return result;
  }

  async getNFT(_id: bigint | number): Promise<[{ fileType: string; fileContent: string }, string[]]> {
    this.genegateContract();
    const result = await this.contract!.getNFT(_id);
    return result;
  }
}
