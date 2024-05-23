'use strict';
import { ethers } from "ethers";
// const GetInfos = require('./api/GetInfos');
const DaoToken = require("./api/DaoToken");
const IADD = require("./api/IADD");
const DaoLogo = require("./api/DaoLogo");
const Commulate = require("./api/Commulate");
const UnitToken = require("./api/UnitToken");
const Dao = require("./api/Dao");
const Mynft=require("./api/Mynft")
const Domain=require("./api/Domain")
const Register=require("./api/Register")
 
export default class  DaoApi {

    get Register() { 
        if (!this.dao_register_obj) 
            this.dao_register_obj = new Register(
                this.ethers,this.signer,this.account,
                this.daismAddress['SCRegistrar']
            ); 
        return this.dao_register_obj; 
    }

    get Mynft() { 
        if (!this.mynft_obj) 
            this.mynft_obj = new Mynft(
                this.ethers,this.signer, this.account,
                this.daismAddress['DAismNFT']
            ); 
            return this.mynft_obj; 
        }

    get Commulate() { 
        if (!this.dao_commulate_obj) 
            this.dao_commulate_obj = new Commulate(
                this.ethers,this.signer,this.account,
                this.daismAddress['Commulate']
            ); 
        return this.dao_commulate_obj; 
    }
    get IADD() { 
        if (!this.dao_iadd_obj) 
            this.dao_iadd_obj = new IADD(
                this.ethers,this.signer, this.account, 
                this.Commulate,this.UnitToken,
                this.daismAddress['_IADD']
            ); 
        return this.dao_iadd_obj; 
    }
    // get GetInfos() { 
    //     if (!this.dao_getInfos_obj) 
    //         this.dao_getInfos_obj = new GetInfos(
    //             this.ethers,this.signer, this.account, 
    //             this.daismAddress['GetInfos']
    //         ); 
    //     return this.dao_getInfos_obj; 
    // }
    get DaoLogo() {
        if (!this.dao_logo_obj) 
            this.dao_logo_obj = new DaoLogo(
                this.ethers,this.signer,this.account,
                this.daismAddress['SCLogo']
            ); 
        return this.dao_logo_obj;
    }
    get Dao() {
        if (!this.dao_obj) 
            this.dao_obj = new Dao(
                this.ethers,this.signer,this.account
            ); 
        return this.dao_obj;
    }
    get DaoToken() { 
        if (!this.dao_token_obj) 
            this.dao_token_obj = new DaoToken(
                this.ethers,this.signer, this.account,
                this.daismAddress['SCToken']
            ); 
            return this.dao_token_obj; 
        }
    get UnitToken() { 
        if (!this.dao_uToken_obj) 
            this.dao_uToken_obj = new UnitToken(
                this.ethers,this.signer, this.account,
                this.daismAddress['UnitToken']
            ); 
        return this.dao_uToken_obj; 
    }
    get Domain() { 
        if (!this.dao_domain_obj) 
            this.dao_domain_obj = new Domain(
                this.ethers,this.signer, this.account,
                this.daismAddress['DAismDomain']
            ); 
        return this.dao_domain_obj; 
    }



    constructor(_signer, _account,_daismAddress) {
        this.ethers=ethers;
        this.signer = _signer;
        this.account = _account;
        this.daismAddress=_daismAddress;
    }
}
