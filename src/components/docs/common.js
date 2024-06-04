import { useSelector } from 'react-redux';


export default function Common1({t,locale}) {
    const daismAddress=useSelector((state) => state.valueData.daoAddress)

    return ( 
     <div>
        <h3><strong>{t('s0')}  </strong></h3>
        <p className='fs-5 mt-1 mb-3' >{t('s1')} </p>
       

        <h5><strong>{t('s2')} </strong></h5>
       <pre className="mb-3 mt-3" style={{overflowX:'auto',whiteSpace:'pre-wrap' }} > {` {
            {
            string name; // ${t('s3')}
            string symbol; // ${t('s4')}
            string desc; // ${t('s5')}
            address manager; // ${t('s6')}
            uint16 version; // ${t('s7')}
            }，
            address[] calldata _members, //${t('s8')}
            uint16[] calldata _dividendRights, // ${t('s9')}
            uint16 _strategy,  //${t('s10')}
            uint32 _lifetime, //${t('s11')}
            uint32 _coolingPeriod // ${t('s12')}
    }`}
        
       </pre>
        

        <h4><strong>{t('s13')}</strong>    </h4>
        <p  className='fs-5 mt-1 mb-3' > {t('s14')}    </p>
        <p  className='fs-5 mt-1 mb-3' >{t('s15')}    </p>
        <h4><strong> {t('s16')}</strong> </h4>
        <pre className="mb-3 mt-3" style={{overflowX:'auto',whiteSpace:'pre-wrap' }} > {`//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
struct DaoInfo {
   string name; // The name of the DAO.
   string symbol; // The symbol of the DAO.
   string desc; // The description of the DAO.
   address manager; // The address of the DAO manager.
   uint16 version; // The version of the DAO.
}
interface IDAismDaoRegistrar{
       function createDao(
       DaoInfo memory _daoInfo,
       address[] calldata _members,
       uint16[] calldata _dividendRights,
       uint16 _strategy,
       uint32 _lifetime,
       uint32 _coolingPeriod
   ) external returns (uint);
}
contract ForDaoRegister{

   address public daoRegistrar;
   address public owner;

   constructor(address dao_registrar){
       daoRegistrar = dao_registrar;
       owner = msg.sender;
   }

//${t('s17')}
   function ownerOf() public view returns(address){
       return owner;
   }

  function createDao(
       DaoInfo memory _daoInfo,
       address[] calldata _members,
       uint16[] calldata _dividendRights,
       uint16 _strategy,
       uint32 _lifetime,
       uint32 _coolingPeriod
   ) external returns(uint) {
       return IDAismDaoRegistrar(daoRegistrar).createDao(_daoInfo, _members, _dividendRights, _strategy, _lifetime, _coolingPeriod);
   }
}
`}
        
       </pre>

       <h4><strong> {t('s18')}</strong> </h4>
       <pre className="mb-3 mt-3" style={{overflowX:'auto',whiteSpace:'pre-wrap' }} > {`   // ${t('s19')}
    
    const dAismDaoRegistrar_address='0x0000000000000....'  //${t('20')}

    const [owner] = await ethers.getSigners();

    const name = 'ForDaoRegister' //${t('21')}

    const factory = await ethers.getContractFactory(name,owner)
    const product = await factory.deploy(dAismDaoRegistrar_address)  //${t('s22')}
    await product.waitForDeployment()
    const address=await product.getAddress()
    console.info('publish: ',name,address)

    //${t('s23')}
    const contractObj= ethers.getContractAt(name,address,owner) 


    // ${t('s24')}
    const res= await contractObj.createDao(
      [${t('s25')}, owner.address, 1],
      [owner.address],  //${t('s8')}
      [10],   // ${t('s26')}
      (2 ** 16-1), //${t('s27')}
      7 * 24 * 3600,  //${t('s28')}
      9 * 24 * 3600,  //${t('s29')}
      {
          fileType: 'zip',
          fileContent: '0x504b03040a00000008008d34a9583d2ffab314010000b4010000070000007a69702e7376675551db6e83300c7def575879c7e44282a90089ed793fb0b7943240ca4a05acf4f3e7c0a46a4a6239f6b18f4f522e8f1e9edfe1b6546258d7fb394db76dc3cde034f7a99652a68c10b08dd775a884d102866eec87f5f0bfc6102ad1fecc73775bdfa730cd02dae017ee7619e132263e744f2fe03176dbdbf4ac840409caf116f509a0bcfb75806b253e722c0a07b22120907f8bfcebe6b030c020f348143a65bc42c96da2d90109e62ae79494d4587410cfce051a332e24673966e930478650da2ce6fdff0a8698882615126ea851668e1da551153a462cd32acf90a38043c6a0a62cc2e348d426e8c8428656b9c4a1757104268b3ecbcc23a68992090e7b8854962f1a085ebaf777614af529d2fa54c6cfa87f01504b010214000a00000008008d34a9583d2ffab314010000b40100000700000000000000000000000000000000007a69702e737667504b0506000000000100010035000000390100000000'
      },
    )
    
    await res.wait()`}
        
       </pre>
       <p>
        {t('s30')}
       </p>

       <pre className="mb-3 mt-3" style={{overflowX:'auto',whiteSpace:'pre-wrap' }} > {` reader.addEventListener('loadend', function (e) {
                    let mbytes = '0x';
                    for (let j = 0; j < e.target.result.length; j++) {
                        let _a = e.target.result[j].valueOf().charCodeAt(0).toString(16);
                        mbytes = mbytes + (_a.length === 1 ? ('0' + _a) : _a);
                    }
                    binaryRef.current=mbytes
                 });
                reader.readAsBinaryString(file);`}
      </pre>

       <h4><strong>{t('s31')}</strong> </h4>
        <p>{t('s32')}</p>
        <p>{t('s33')}</p>
        <img src={`/dist_${locale}/images/s1.png`}  alt="" style={{ border:'2px solid gray',margin:'12px'}}   /> 
        <img src={`/dist_${locale}/images/s2.png`}  alt="" style={{ border:'2px solid gray',margin:'12px'}}   /> 

        <div>
        <hr/>
         {t("s34")}:{daismAddress['SCRegistrar']}
        </div>
     </div>

    );
}


  
    
//   在“我” 中进行操作,见下图
// <img src="/dist/images/iadd2.png"  alt="" style={{ border:'2px solid gray',margin:'12px'}}   /> 