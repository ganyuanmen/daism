
import {toUtf8Bytes,ethers,type Contract,type ContractTransactionResponse} from 'ethers';
import UnitToken from './UnitToken';

export default class SingNft {
  private signer: ethers.Signer;
  private address: string;
  private abi: string[];
  private utoken: UnitToken;
  private contract?: Contract;

  constructor(signer: ethers.Signer,address: string,utoken: UnitToken) {
    this.signer = signer;
    this.address = address;
    this.abi = [
        "function getNFT(uint256 tokenId) view returns ((string scType,address owner,string name,uint256 blockNum,string mark,uint256 ethBurn),(string name,string desc,string logo))",
        "function mintByBurnETH(address recipient,bool isMintNFT) payable returns (uint256)",   
        "function mintForAddressByTipUTokenCallBack(uint256 _utokenAmount,address _recipient,address _nftRecipient,bool _isMintNFT,bytes _data) returns (uint256)" 
    ];
    this.utoken = utoken;
  }

  private genegateContract() {
    if (!this.contract) {
      this.contract = new ethers.Contract(this.address, this.abi, this.signer);
    }
  }

  /**
   * 通过 ETH 销毁铸造 NFT
   * @param _to 接收地址
   * @param _ethValue ETH 数量（字符串）
   * @param isNft 是否铸造 NFT
   */
  async mintByBurnETH(_to: string,_ethValue: string|number,isNft: boolean): Promise<ContractTransactionResponse> {
    this.genegateContract();
    const ethValue = ethers.parseEther(_ethValue+'');
    const tx = await this.contract!['mintByBurnETH'](_to,isNft,{ value: ethValue });
    await tx.wait();
    return tx;
  }

  /**
   * 打赏并可选铸造 NFT
   * @param _utokenAmount UToken 数量（字符串）
   * @param _recipient 接收打赏的地址
   * @param _nftRecipient mint NFT 接收地址
   * @param _isMintNFT 是否 mint NFT
   * @param _id 附加 ID
   */
  async mintTip(_utokenAmount: string|number,_recipient: string, _nftRecipient: string, _isMintNFT: boolean, _id: string): Promise<ethers.TransactionReceipt> {
    this.genegateContract();
    const _amount = ethers.parseUnits(String(_utokenAmount), 8);

    const ifa = new ethers.Interface(this.abi);
    const functionData = ifa.encodeFunctionData('mintForAddressByTipUTokenCallBack',
      [_amount, _recipient, _nftRecipient, _isMintNFT, toUtf8Bytes(_id)]
    );

    const abicoder = new ethers.AbiCoder();
    const paras = abicoder.encode(
      ['address', 'bytes'],
      [this.address, functionData]
    );

    const res = await this.utoken.transferWithCallback(this.address, _amount,paras);
    // await res.wait();
    return res;
  }

  /**
   * 获取 NFT 信息
   * @param _id tokenId
   */
  async getNFT(_id: bigint) {
    this.genegateContract();
    return await this.contract!['getNFT'](_id);
  }
}
