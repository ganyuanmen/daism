
import IADD from '@/lib/contract/api/IADD';
import Commulate from '@/lib/contract/api/Commulate';
import UnitToken from '@/lib/contract/api/UnitToken';
import Donate from '@/lib/contract/api/Donate';
import Register from '@/lib/contract/api/Register';
import Mynft from '@/lib/contract/api/Mynft';
import Dao from '@/lib/contract/api/Dao';
import Domain from '@/lib/contract/api/Domain';
import IADD_EX from '@/lib/contract/api/IADD_EX';
import SingNft from '@/lib/contract/api/SingNft';
import  DaoToken  from '@/lib/contract/api/DaoToken';
import type { Signer } from 'ethers';



export interface DaismContract {
  UnitToken: UnitToken;
  Commulate:Commulate;
  IADD:IADD;
  Donate:Donate;
  Register:Register;
  Mynft:Mynft;
  Dao:Dao;
  DaoToken:DaoToken;
  Domain:Domain;
  IADD_EX:IADD_EX;
  SingNft:SingNft;
  signer:Signer;
}

  const daismObj: { instance?: DaismContract } = {};

  export function setDaismContract(obj: DaismContract|undefined) {daismObj.instance = obj;}
  export function getDaismContract() { return daismObj.instance;}

  