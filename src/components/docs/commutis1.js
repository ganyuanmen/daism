

export default function Commutis1({t}) {
    

    return ( 
     <div>
          <h3><strong> 概述</strong></h3>
        <p className='fs-5 mt-4 mb-3' >
        Smart Common 可以创建一个社区，进行相关的宣传。支持与其它activityPub 协议的联邦软件通讯。社区具备发布新闻、进行内部讨论以及组织线上线下活动的功能。其他支持activityPub的软件或网站能够订阅社区帐号的最新动态。社区所在的网站会主动向订阅用户推送相关信息，成为一种宣传的有效途径。

        </p>

        <h3><strong> 创建社区帐号</strong></h3>
        <p className='fs-5 mt-4 mb-3' >
        Smart Common 创建社区，就是把提供社区管理的网站（统称节点）域名绑定到smart common 上，这是一个保存到链上的操作。之后就可以在任何一个节点上登录。
        </p>
        <h4><strong>创建社区有两种方式  </strong></h4>
        <ul  className='fs-5' >
            <li>自建节点： 从github上下载源码。自已构建服务并发布网站。</li>
            <li>托管到别的节点： 从网站上查看哪些节点可以托管。然后登录到哪个节点上进行托管。</li>
          
        </ul>


        <h4><strong> 创建社区帐号的步骤 </strong>    </h4>
        <ul  className='fs-5' >
            <li>登录到要建社区帐号的节点上;</li>
            <li>从登录后菜单中 “我的社区” 找到要创建社区帐号的smart common,见下图;
            <img src="/dist/images/r01.png"  alt="" style={{ border:'2px solid gray',margin:'12px'}}   /> 
            <img src="/dist/images/r02.png"  alt="" style={{ border:'2px solid gray',margin:'12px'}}   /> 
          
            </li>
            <li>绑定域名:<br/>
            <img src="/dist/images/r03.png"  alt="" style={{ border:'2px solid gray',margin:'12px'}}   /> 
            </li>
        </ul>

        <p  className='fs-5 mt-4 mb-3' >
        域名可多次绑定或修改。但只以最后一次绑定的域名为准。
        </p>

        <h4><strong> 社区主界面见下图 </strong>    </h4>
        <img src="/dist/images/info2.png"  alt="" style={{ border:'2px solid gray',margin:'12px'}}   /> 
        <p  className='fs-5 mt-4 mb-3' >
        发布新闻、进行内部讨论以及组织线上线下活动所用到的图片，先在图片资源管理界面中上传，形成图片的URI，在插入图片时，用图片URI代替即可。
        </p>
     </div>

    );
}


  
    
