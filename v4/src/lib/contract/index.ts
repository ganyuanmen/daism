'use client';

import IADD from './api/IADD';
import Commulate from './api/Commulate';
import UnitToken from './api/UnitToken';
import Donate from './api/Donate';
import Register from './api/Register';
import Mynft from './api/Mynft';
import Dao from './api/Dao';
import Domain from './api/Domain';
import IADD_EX from './api/IADD_EX';
import SingNft from './api/SingNft';
import  DaoToken  from './api/DaoToken';
import type { Signer } from 'ethers';


export default class DaoApi {
    public signer: Signer;
    private account: string;

    private dao_uToken_obj?: UnitToken;
    private dao_commulate_obj?: Commulate;
    private dao_iadd_obj?: IADD;
    private dao_Donate_obj?:Donate;
    private dao_register_obj?:Register;
    private mynft_obj?:Mynft;
    private dao_obj?:Dao;
    private dao_token_obj?:DaoToken;
    private dao_domain_obj?:Domain;
    private iaddex_obj?:IADD_EX;
    private SingNft_obj?:SingNft;

    constructor(_signer: Signer, _account: string) {
        this.signer = _signer;
        this.account = _account;
    }

    get UnitToken(): UnitToken {
        if (!this.dao_uToken_obj) {
            this.dao_uToken_obj = new UnitToken(
                this.signer,
                process.env.NEXT_PUBLIC_UNITTOKEN as string
            );
        }
        return this.dao_uToken_obj;
    }

    get Commulate(): Commulate {
        if (!this.dao_commulate_obj) {
            this.dao_commulate_obj = new Commulate(this.signer,process.env.NEXT_PUBLIC_COMMULATE as string);
        }
        return this.dao_commulate_obj;
    }

    get IADD(): IADD {
        if (!this.dao_iadd_obj) {
            this.dao_iadd_obj = new IADD(
                this.signer,
                this.account,
                this.Commulate,
                this.UnitToken,
                process.env.NEXT_PUBLIC_IADD as string
            );
        }
        return this.dao_iadd_obj;
    }
    
    get Donate() { 
        if (!this.dao_Donate_obj) { this.dao_Donate_obj = new Donate(this.signer,process.env.NEXT_PUBLIC_DONATION as string); }
        return this.dao_Donate_obj; 
    }

    get Register() { 
        if (!this.dao_register_obj) {this.dao_register_obj = new Register(this.signer,process.env.NEXT_PUBLIC_SCREGISTRAR as string); }
        return this.dao_register_obj; 
    }

    get Mynft() { 
        if (!this.mynft_obj) {this.mynft_obj = new Mynft(this.signer,  process.env.NEXT_PUBLIC_DAISMNFT as string); }
        return this.mynft_obj; 
    }

    get Dao() {
        if (!this.dao_obj)  { this.dao_obj = new Dao(this.signer); }
        return this.dao_obj;
    }

    get DaoToken() { 
        if (!this.dao_token_obj) {this.dao_token_obj = new DaoToken(this.signer, process.env.NEXT_PUBLIC_SCTOKEN as string); }
        return this.dao_token_obj; 
    }

    get Domain() { 
        if (!this.dao_domain_obj) this.dao_domain_obj = new Domain(this.signer,process.env.NEXT_PUBLIC_DAISMDOMAIN as string); 
        return this.dao_domain_obj; 
    }

    get IADD_EX() { 
        if (!this.iaddex_obj) 
           { this.iaddex_obj = new IADD_EX(this.signer, process.env.NEXT_PUBLIC_DAiSMIADDPROXY as string
                ,this.UnitToken,this.DaoToken     ); 
           }
        return this.iaddex_obj; 
    }

    get SingNft() { 
        if (!this.SingNft_obj) { this.SingNft_obj = new SingNft(this.signer, process.env.NEXT_PUBLIC_DAISMSINGLENFT as string,this.UnitToken);} 
        return this.SingNft_obj; 
    }

}
