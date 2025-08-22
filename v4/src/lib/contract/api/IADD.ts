import { ethers,type Contract,type ContractTransactionResponse,type Signer } from "ethers";

// 引入类作为类型
import UnitToken from "./UnitToken";
import  Commulate  from "./Commulate";
interface Pool {
  eip3712_supply: bigint;
  unit_token_supply: bigint;
}

/**
 * IADD 网络兑换
 */
export default class IADD {
  private utoken: UnitToken;
  private commulate: Commulate;
  private signer: Signer | ethers.Provider;
  private address: string;
  private abi: string[];
  private contract?: Contract;
  private account: string;


  constructor(
    _signer: Signer,
    _account: string,
    _commulate: Commulate,
    _utoken: UnitToken,
    _address: string
  ) {
    this.utoken = _utoken;
    this.commulate = _commulate;
    this.signer = _signer;
    this.account = _account;
    this.address = _address;
    this.abi = [
        "function ethToSCToken(uint256,uint256,uint256,address) payable returns(uint256)",
        "function unitTokenToSCToken(uint256,uint256,uint256,address) returns(uint256)",
        "function SCTokenToUnitToken(uint256,uint256,uint256,address) returns(uint256)",
        "function SCTokenToSCToken(uint256,uint256,uint256,uint256,uint256,address) returns(uint256)",
        "function pools(uint256) view returns(uint112 eip3712_supply,uint112 unit_token_supply)",
      ];
  }

  /** eth-->token */
  async ethToDaoToken(_eth: number|string, _id: number, _minRatio: number): Promise<ContractTransactionResponse> {
    this.genegateContract();
    const _amount = ethers.parseEther(String(_eth));
    const minUtoken = await this.utoken.getOutputAmount(_amount);
    const minDaotoken = await this.commulate.unitTokenToDaoToken(minUtoken[0],_id);
    const temp = parseFloat(ethers.formatEther(minDaotoken));
    const minratio = ethers.parseEther(String(temp * (1 - _minRatio / 100)));
    const tx = await this.contract!["ethToSCToken"](minUtoken[0].toString(),minratio,_id,this.account,{ value: _amount });
    await tx.wait();
    return tx;
  }

  /** utoken-->token */
  async unitTokenToDaoToken(_value: number,_id: number,_minRatio: number): Promise<ContractTransactionResponse> {
    this.genegateContract();
    const _amount = ethers.parseUnits(String(_value), 8);
    const min_amount = await this.commulate.unitTokenToDaoToken(_amount, _id);
    const temp = parseFloat(ethers.formatEther(min_amount));
    const minratio = ethers.parseEther(
      String(temp * (1 - _minRatio / 100))
    );
    const tx = await this.contract!["unitTokenToSCToken"](
      minratio,
      _amount,
      _id,
      this.account
    );
    await tx.wait();
    return tx;
  }

  /** token-->utoken */
  async daoTokenToUnitToken(_value: number,_id: number, _minRatio: number): Promise<ContractTransactionResponse> {
    this.genegateContract();
    const _amount = ethers.parseEther(String(_value)).toString();
    const min_amount = await this.commulate.daoTokenToUnitToken(_amount, _id);
    const temp = parseFloat(ethers.formatEther(min_amount));
    const minratio = ethers.parseEther(
      String(temp * (1 - _minRatio / 100))
    );
    const tx = await this.contract!["SCTokenToUnitToken"](
      minratio,
      _amount,
      _id,
      this.account
    );
    await tx.wait();
    return tx;
  }

  /** token-->token */
  async DaoTokenToDaoToken(_value: number,_id1: number,_id2: number, _minRatio: number): Promise<ContractTransactionResponse> {
    this.genegateContract();
    const _amount = ethers.parseEther(String(_value)).toString();
    const min_amount = await this.commulate.DaoTokenToDaoToken(
      _amount,
      _id1,
      _id2
    );
    const temp = parseFloat(ethers.formatEther(min_amount[0]));
    const minratio = ethers.parseEther(
      String(temp * (1 - _minRatio / 100))
    );
    const tx = await this.contract!["SCTokenToSCToken"](
      0,
      minratio,
      _amount,
      _id1,
      _id2,
      this.account
    );
    await tx.wait();
    return tx;
  }

  async getPool(_id: number ): Promise<{ utoken: number; token: number; price: number }> {
    this.genegateContract();
    const result:Pool = await this.contract!["pools"](_id);
    const utoken = parseFloat(
      ethers.formatUnits(result.unit_token_supply, 8)
    );
    const token = parseFloat(
      ethers.formatEther(result.eip3712_supply)
    );
    const price = utoken / token - 0.01;
    return { utoken, token, price };
  }

  private genegateContract(): Contract {
    if (!this.contract) {
      this.contract = new ethers.Contract( this.address, this.abi,  this.signer );
    }
    return this.contract;
  }
}
