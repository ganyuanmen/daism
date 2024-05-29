import { useSelector } from 'react-redux';


export default function Common1({t}) {
    const daismAddress=useSelector((state) => state.valueData.daoAddress)

    return ( 
     <div>
        <h3><strong>  智能公器</strong></h3>
        <p className='fs-5 mt-4 mb-3' >
        智能公器（Smart Common）是一个去中心化的组织，是道易程管理的基本元素。
        </p>
       

        <h5><strong>智能公器的构造 </strong></h5>
       <pre className="mb-3 mt-3" style={{overflowX:'auto',whiteSpace:'pre-wrap' }} > {` {
            {
            string name; // Smart Common 名称，唯一，不能与其它Smart Common同名.
            string symbol; // Smart Common 代币名称，唯一，不能与其它Smart Common代币同名
            string desc; // Smart Common 描述.
            address manager; // Smart Common 管理员，只有该管理员才能发起提案.
            uint16 version; // Smart Common 版本号，mint 时从1开始.
            }，
            address[] calldata _members, //成员列表.
            uint16[] calldata _dividendRights, //成员票权(分红权)，与_members 一一对应
            uint16 _strategy,  //提案投票通过率.百分之百（全票通过）是2的16次方减1(65535)， 可以通过提案更改此值
            uint32 _lifetime, //提案存活时间，以秒为单位，提案从创建开始计时，经过该时间后没有完成的就作废.
            uint32 _coolingPeriod //提案冷却时间，单位是秒，从提案创建开始计时，要经过该数值的时间后才能建新的提案.特别注意：冷却时间必须大于存活时间
    }`}
        
       </pre>
        

        <h4><strong>如何在道易程上mint一个智能公器</strong>    </h4>
        <p  className='fs-5 mt-4 mb-3' >
        只有Dapp 的所有者才能mint 智能公器, 所以mint 智能公器 前，先发布自己的Dapp。
        
        </p>
        <p  className='fs-5 mt-4 mb-3' >
        
        建立 Smart Common 的合约可以是嵌入在 dApp 中的智能合约，也可以是一个独立的合约。需要特别注意的是，每个合约地址仅有权限创建一个 智能公器。
        </p>
        <h4><strong> 智能公器的合约示例</strong> </h4>
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

//该合约必须用道易程的 DAismDaoRegistrar 合约地址初始化
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

       <h4><strong> 利用hardhat发布并 mint Smart Common 示例</strong> </h4>
       <pre className="mb-3 mt-3" style={{overflowX:'auto',whiteSpace:'pre-wrap' }} > {`   //hardhat环境下 发布mint Smart Common 的合约
    
    const dAismDaoRegistrar_address='0x0000000000000....'  //道易程的DAismDaoRegistrar合约发布地址

    const [owner] = await ethers.getSigners();

    const name = 'ForDaoRegister' //合约的名称

    const factory = await ethers.getContractFactory(name,owner)
    const product = await factory.deploy(dAismDaoRegistrar_address)  //传入道易程的合约地址
    await product.waitForDeployment()
    const address=await product.getAddress()
    console.info('部署: ',name,address)

    //创建对该合约的引用
    const contractObj= ethers.getContractAt(name,address,owner) 


    // mint 道易程的 Smart Common
    const res= await contractObj.createDao(
      ['名称', '昵称','描述', owner.address, 1],
      [owner.address],  //成员列表
      [10],   // 成员票权(分红权)，不能为1,2,3，因为这三个数有特殊用途
      (2 ** 16-1), //提案投票通过率，百分之分（全票）
      7 * 24 * 3600,  //寿命期，默认1 个星期
      9 * 24 * 3600,  //冷却期一天
      {
          fileType: 'zip',
          fileContent: '0x504b03040a00000008008d34a9583d2ffab314010000b4010000070000007a69702e7376675551db6e83300c7def575879c7e44282a90089ed793fb0b7943240ca4a05acf4f3e7c0a46a4a6239f6b18f4f522e8f1e9edfe1b6546258d7fb394db76dc3cde034f7a99652a68c10b08dd775a884d102866eec87f5f0bfc6102ad1fecc73775bdfa730cd02dae017ee7619e132263e744f2fe03176dbdbf4ac840409caf116f509a0bcfb75806b253e722c0a07b22120907f8bfcebe6b030c020f348143a65bc42c96da2d90109e62ae79494d4587410cfce051a332e24673966e930478650da2ce6fdff0a8698882615126ea851668e1da551153a462cd32acf90a38043c6a0a62cc2e348d426e8c8428656b9c4a1757104268b3ecbcc23a68992090e7b8854962f1a085ebaf777614af529d2fa54c6cfa87f01504b010214000a00000008008d34a9583d2ffab314010000b40100000700000000000000000000000000000000007a69702e737667504b0506000000000100010035000000390100000000'
      },
    )
    
    await res.wait()`}
        
       </pre>
       <p>
        上传的logo 需要转换成16进制，转换的方法如下：
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

       <h4><strong>网页 mint Smart Common 示例</strong> </h4>
        <p>首先发布包含mint Smart Common 接口的 Dapp。 并取提该Dapp 的发布地址。</p>
        <p>网页上填写相应信息并mint, 见下图：</p>
        <img src="/dist/images/s1.png"  alt="" style={{ border:'2px solid gray',margin:'12px'}}   /> 
        <img src="/dist/images/s2.png"  alt="" style={{ border:'2px solid gray',margin:'12px'}}   /> 

        <div>
        <hr/>
         道易程的DAismDaoRegistrar合约发布地址:{daismAddress['SCRegistrar']}
        </div>
     </div>

    );
}


  
    
//   在“我” 中进行操作,见下图
// <img src="/dist/images/iadd2.png"  alt="" style={{ border:'2px solid gray',margin:'12px'}}   /> 