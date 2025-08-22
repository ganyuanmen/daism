import { type Contract, type Signer, type BigNumberish, type ContractTransactionResponse, ethers } from "ethers";
import UnitToken from "./UnitToken";
import DaoToken from "./DaoToken";

export default class IADD_EX {
  signer: Signer;
  address: string;
  abi: string[];
  contract?: Contract;
  utoken: UnitToken; // ERC20 UnitToken 合约实例
  token: DaoToken;  // ERC20 / EIP-3712 合约实例

  constructor( _signer: Signer, _address: string, _utoken: UnitToken, _token: DaoToken  ) {
    this.signer = _signer;
    this.address = _address;
    this.abi = [
         // ETH -> DAO Token
        "function ethToSCTokenByTip(uint256,uint256,address,uint256,uint256,bool,bool,address) payable returns (bool)",
        "function estimateEthToSCTokenByTip(uint256,uint256,uint256) view returns (uint256)",

        // UnitToken -> DAO Token
        "function unitTokenToSCTokenByTip(uint256,uint256,address,uint256,uint256,bool,address) returns (bool)",
        "function estimateUnitTokenToSCTokenByTip(uint256,uint256) view returns (uint256)",

        // DAO Token -> UnitToken
        "function SCTokenToUnitTokenByTip(uint256,uint256,uint256,address,uint256,uint256,bool,address) returns (bool)",
        "function estimateSCTokenToUnitTokenByTip(uint256,uint256,uint256) view returns (uint256)",

        // DAO Token -> DAO Token
        "function SCTokenToSCTokenByTip(uint256,uint256,uint256,uint256,uint256,address,uint256,uint256,bool,address) returns (bool)",
        "function estimateSCTokenToSCTokenByTip(uint256,uint256,uint256,uint256) view returns (uint256,uint256)",

    ];
    this.utoken = _utoken;
    this.token = _token;
  }

  private genegateContract(): void {
    if (!this.contract) {
      this.contract = new ethers.Contract(this.address, this.abi, this.signer);
    }
  }

  // ======================== ETH -> DAO Token ========================
  async ethToDaoToken(
    _eth: string | number,
    _id: BigNumberish,
    _uto: string | number,
    _minRatio: number,
    recipient: string,
    _isMintNFT: boolean,
    _isBurnNFT: boolean,
    _nftRecipient: string
  ): Promise<ContractTransactionResponse> {
    this.genegateContract();
    const _amount = ethers.parseEther(_eth.toString());
    const _utotip = ethers.parseUnits(_uto.toString(), 8);
    const min_amount: BigNumberish = await this.contract!.estimateEthToSCTokenByTip(_amount, _id, _utotip);
    const temp = parseFloat(ethers.formatEther(min_amount));
    const minratio = ethers.parseEther((temp * (1 - _minRatio / 100)).toString());

    const tx = await this.contract!.ethToSCTokenByTip(
      minratio,
      _id,
      recipient,
      _id,
      _utotip,
      _isMintNFT,
      _isBurnNFT,
      _nftRecipient,
      { value: _amount }
    );
    await tx.wait();
    return tx;
  }

  async estimateEthToDaoToken(ethAmount: string | number,poolId: BigNumberish,tipUtokenAmount: string | number): Promise<bigint> {
    this.genegateContract();
    const _ethAmount = ethers.parseEther(ethAmount.toString());
    const _tip = ethers.parseUnits(tipUtokenAmount.toString(), 8);
    return await this.contract!.estimateEthToSCTokenByTip(_ethAmount, poolId, _tip);
  }

  // ======================== UnitToken -> DAO Token ========================
  async unitTokenToDaoToken(
    _value: string | number,
    _id: BigNumberish,
    _minRatio: number,
    _uto: string | number, //打赏数量
    recipient: string,
    _isMintNFT: boolean,
    _nftRecipient: string
  ):Promise<ethers.TransactionReceipt> {
    this.genegateContract();
    const _amount = ethers.parseUnits(_value.toString(), 8);
    const _utotip = ethers.parseUnits(_uto.toString(), 8);
    const min_amount: BigNumberish = await this.contract!.estimateUnitTokenToSCTokenByTip(_amount, _id);
    const temp = parseFloat(ethers.formatUnits(min_amount, 8));
    const minratio = ethers.parseUnits((temp * (1 - _minRatio / 100)).toString(), 8);

    const iface = new ethers.Interface(this.abi);
    const functionData = iface.encodeFunctionData('unitTokenToSCTokenByTip', [
      minratio,
      _id,
      recipient,
      _id,
      _utotip,
      _isMintNFT,
      _nftRecipient
    ]);
    const abicoder = new ethers.AbiCoder();
    const paras = abicoder.encode(["address", "bytes"], [this.address, functionData]);
    const totalAmount = BigInt(_amount) + BigInt(_utotip);

    const res = await this.utoken.transferWithCallback(this.address, totalAmount, paras);
    
    // await res.wait();

    return res;
  }

  async estimateUnitTokenToDaoToken(_value: string | number, poolId: BigNumberish): Promise<bigint> {
    this.genegateContract();
    const _amount = ethers.parseUnits(_value.toString(), 8);
    return await this.contract!.estimateUnitTokenToSCTokenByTip(_amount, poolId);
  }

  // ======================== DAO Token -> UnitToken ========================
  async daoTokenToUnitToken(
    _value: string | number,
    _id: number|bigint,
    _minRatio: number,
    _uto: string | number,
    recipient: string,
    _isMintNFT: boolean,
    _nftRecipient: string
  ): Promise<ethers.TransactionReceipt> {
    this.genegateContract();
    const _amount = ethers.parseEther(_value.toString());
    const _utotip = ethers.parseUnits(_uto.toString(), 8);
    const min_amount: BigNumberish = await this.contract!.estimateSCTokenToUnitTokenByTip(_amount, _id, _utotip);
    const temp = parseFloat(ethers.formatUnits(min_amount, 8));
    const minratio = ethers.parseUnits((temp * (1 - _minRatio / 100)).toFixed(6), 8);

    const iface = new ethers.Interface(this.abi);
    const functionData = iface.encodeFunctionData('SCTokenToUnitTokenByTip', [
      minratio,
      _amount,
      _id,
      recipient,
      _id,
      _utotip,
      _isMintNFT,
      _nftRecipient
    ]);
    const abicoder = new ethers.AbiCoder();
    const paras = abicoder.encode(["address", "bytes"], [this.address, functionData]);

    const res = await this.token.transferWithCallback(_id, this.address, _amount, paras);
    // await res.wait();
    return res;
  }

  async estimateDaoTokenToUnitToken(_value: string | number, poolId: BigNumberish, tipUtokenAmount: string | number): Promise<bigint> {
    this.genegateContract();
    const _amount = ethers.parseEther(_value.toString());
    const _tip = ethers.parseUnits(tipUtokenAmount.toString(), 8);
    return await this.contract!.estimateSCTokenToUnitTokenByTip(_amount, poolId, _tip);
  }

  // ======================== DAO Token -> DAO Token ========================
  async daoTokenToDaoToken(
    _value: string | number,
    _id1: number|bigint,
    _id2: number|bigint,
    _minRatio: number,
    _uto: string | number,
    recipient: string,
    _isMintNFT: boolean,
    _nftRecipient: string,
    flag: boolean
  ): Promise<ethers.TransactionReceipt> {
    this.genegateContract();
    const _amount = ethers.parseEther(_value.toString());
    const _utotip = ethers.parseUnits(_uto.toString(), 8);

    const min_amount: [BigNumberish, BigNumberish] = await this.contract!.estimateSCTokenToSCTokenByTip(_amount, _id1, _id2, _utotip);
    const temp = parseFloat(ethers.formatEther(min_amount[0]));
    const minratio = ethers.parseEther((temp * (1 - _minRatio / 100)).toFixed(6));

    const iface = new ethers.Interface(this.abi);
    const functionData = iface.encodeFunctionData('SCTokenToSCTokenByTip', [
      0,
      minratio,
      _amount,
      _id1,
      _id2,
      recipient,
      flag ? _id2 : _id1,
      _utotip,
      _isMintNFT,
      _nftRecipient
    ]);

    const abicoder = new ethers.AbiCoder();
    const paras = abicoder.encode(["address", "bytes"], [this.address, functionData]);

    const res = await this.token.transferWithCallback(_id1, this.address, _amount, paras);
    // await res.wait();
    return res;
  }

  async estimateDaoTokenToDaoToken(
    _value: string | number,
    _id1: BigNumberish,
    _id2: BigNumberish,
    tipUtokenAmount: string | number
  ): Promise<[bigint, bigint]> {
    this.genegateContract();
    const _amount = ethers.parseEther(_value.toString());
    const _tip = ethers.parseUnits(tipUtokenAmount.toString(), 8);
    return await this.contract!.estimateSCTokenToSCTokenByTip(_amount, _id1, _id2, _tip);
  }
}
