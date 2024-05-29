

export default function Tokens1({t}) {


    return ( 
     <div>
        <h3><strong> IADD交易网络</strong></h3>
        <p className='fs-5 mt-4 mb-3' >
        UTO 是道易程的通用数字货币，可用于与各类由 Smart Common 发行的代币进行兑换。它充当了道易程内部各种代币的价值提现媒介。
        </p>
        <h4><strong>IADD网络兑换种类 </strong></h4>
        <ul  className='fs-5' >
            <li>ETH 兑换 UTO</li>
            <li>ETH 兑换 token</li>
            <li>UTO 兑换 token</li>
            <li>token 兑换 UTO</li>
            <li>token 兑换 token</li>
        </ul>


        <h4><strong> Smart Common 代币价值 </strong>    </h4>
        <p  className='fs-5 mt-4 mb-3' >
        代币单价的单位是vita, 表示为1代币相当于多少utoken
        </p>
        <h4><strong> 授权管理</strong> </h4>
        <p  className='fs-5 mt-4 mb-3' >
        道易程提供两种授权方式：第一种是将 uToken 授权给 IADD 网络，允许 IADD 网络对用户的 uToken 数字货币进行操作；第二种是将 token 授权给 IADD 网络，允许 IADD 网络对用户的 token 数字货币进行操作。见下图
        </p>
        <img src="/dist/images/iadd1.png"  alt="" style={{ border:'2px solid gray',margin:'12px'}}   /> 
        <p  className='fs-5 mt-4 mb-3' >
        用户可以取消授权，在“我的钱包” 中进行操作,见下图
        </p>
        <img src="/dist/images/iadd2.png"  alt="" style={{ border:'2px solid gray',margin:'12px'}}   /> 
        <img src="/dist/images/iadd3.png"  alt="" style={{ border:'2px solid gray',margin:'12px'}}   /> 
     </div>

    );
}


  
    
