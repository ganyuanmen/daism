import { Alert } from "react-bootstrap"


export default function My1({t}) {


    return ( 
     <div>
     
        <ul  className='fs-5' >
            <li><Alert> 我的估值通证：具有的代币种类和数量</Alert>
                <div>
                <img src="/dist/images/my3.png"  alt="" style={{ border:'2px solid gray',margin:'12px'}}   /> 
                </div>
            </li>

            <li><Alert>交易记录：在IADD网络中进行交易的记录</Alert>
            <div>
                <img src="/dist/images/my4.png"  alt="" style={{ border:'2px solid gray',margin:'12px'}}   /> 
            </div>
            <p  >
            可以通过点击hash 码查看该交易的详情
            </p>
            
            </li>
            <li><Alert>我的智能公器：参与的所有智能公器以及对智能公器的管理</Alert>
            <div>
                <img src="/dist/images/my5.png"  alt="" style={{ border:'2px solid gray',margin:'12px'}}   /> 
            </div>
            <p  className='fs-5 mt-4 mb-3' >
            智能公器可以进行8种操作，其中7种是以提案的方式进行。
            </p>
            <ol>
                <li>修改logo提案</li>
                <li>修改Smart Common的管理员</li>
                <li>修改Smart Common的描述</li>
                <li>修改Smart Common投票通过率(百分之百(全票) 的值为2的16次方减1（65535）)</li>
                <li>增加Smart Common成员</li>
                <li>修改Smart Common成员的票权(分红权)(票权的值为4到65535间的数值，不能是1，2，3)</li>
                <li>删除Smart Common成员(不能删除管理员)</li>
                <li>修改创建者(Dapp地址)</li>
            </ol>
            见下图：
            <img src="/dist/images/my7.png"  alt="" style={{ border:'2px solid gray',margin:'12px'}}   /> 
            </li>
            <li><Alert>提案： 参与的所有已经完成或未完成的提案</Alert>
            <div>
                <img src="/dist/images/my6.png"  alt="" style={{ border:'2px solid gray',margin:'12px'}}   /> 
            </div>
            <p  className='fs-5 mt-4 mb-3' >
            提案是由 Smart Common 成员发起的一种行为，旨在协调成员对于 Smart Common 管理事务的共同决策。提案的流程包括以下步骤：
            </p>
            <ol>
                <li>创建提案</li>
                <li>成员对提案进行投票，以决定是否执行该提案</li>
            </ol>
            <br/>
            <div>
                注：每个智能公器上只允许存在一个活跃的提案，即在当前提案未完成之前或已经完成但未过 “冷却”期的，不能发起新的提案。
            </div>
            <br/>
            <div>
            投票规则: <br/>
投赞成票：当投票率达到设定的通过率之后，提案会自动执行。在冷却时间过后，可以建新的提案。<br/>

投反对票：当反对票使提案无法达到通过率之后，提案会自动作废。在冷却时间过后，可以建新的提案。
            </div>
            </li>
            
        </ul>


     </div>

    );
}


  
    
