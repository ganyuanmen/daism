
import { getData } from '@/lib/mysql/common';
import { useLocale } from 'next-intl';
// import Image from 'next/image';

export default function Home() {
  
  const locale: string = useLocale().toString().toLowerCase();



    return (
        <Imgsvg locale={locale} />
    )
    }
   

    async function Imgsvg({locale}:{locale:string}){
        
    const obj=await getData("SELECT * FROM a_home where id=1",[],true);
    
        return(
            <>
            {/* 桌面端 */}
            <div className="desktop-only">
                <object 
                data={locale==='en'?`${obj.svg_big_en}`:`${obj.svg_big_zh}`}
                type="image/svg+xml"
    //   width="1200"
    //   height="500"
         style={{ width: '100%', height: 'auto' }}
    ></object>
            {/* <Image
                src={locale==='en'?`${obj.svg_big_en}`:`${obj.svg_big_zh}`}
                alt="PoL Civ desktop"
                width={1200} // 实际宽度
                height={400} // 实际高度
                style={{ width: '100%', height: 'auto' }}
                priority
            /> */}
            </div>
            
             {/* 移动端 */}
            <div className="mobile-only">
                  <object 
                data={locale==='en'?`${obj.svg_sm_en}`:`${obj.svg_sm_zh}`}
                type="image/svg+xml"
    //   width="1200"
    //   height="500"
         style={{ width: '100%', height: 'auto' }}
    ></object>
            {/* <Image
                 src={locale==='en'?`${obj.svg_sm_en}`:`${obj.svg_sm_zh}`}
                alt="PoL Civ mobile"
                width={600}
                height={300}
                style={{ width: '100%', height: 'auto' }}
            /> */}
            </div>
            <div dangerouslySetInnerHTML={{__html:locale==='en'?obj.var_en:obj.var_zh}}></div>
            </>
        );
    }


{/* <div style={{fontSize:'1rem'}}  >
    <h2>💓 Declaration of Proof-of-Love Civilization</h2>
    <p>We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness.</p>
    <p>These words were written in the Declaration of Independence in 1776. 248 years later, the combined wealth of USA’s bottom 50 percent of households still amounts to only 2.5 percent of total household wealth!</p>
    <p>In January 2014, the 85 richest individuals in the world owned as much wealth as the bottom 3.5 billion people—half of humanity. By 2017, the combined wealth of the top 8 billionaires had surpassed that of this half of humanity. In January 2024, wealth of 5 richest men doubles since 2020 as five billion people made poorer, and 1 in 11 people worldwide are chronically hungry.</p>
    <p>248 years have passed. Now it is time for us, the people, to exercise our rights—with the power of love and the force of technology, especially artificial intelligence as the crystallization of humanity's collective wisdom—to ensure that \"all men are created equal\" is no longer an empty slogan, but becomes part of our daily lives!</p>
    <p>Our consensus for action is \"Proof of Love\"—dispelling the clouds and revealing the sun, and placing love at the heart of a new human civilization’s ethical foundation. By making all human resources—especially artificial intelligence—common and decentralized, we aim to complete a revolution in the relations of production. Soon, we will launch a dynamic solution called the Universal Love Engine (ULE), focused on key goals such as Universal Abundant Supply (UAS), Universal Healthcare for All Humanity (UHAH), and Universal Crisis Relief (UCR). Until these are achieved, transitional measures like Universal Basic Income (UBI) will help civilization transition smoothly.</p>
    <p>Moreover, AI is not an external ruler but an agent of human wisdom; it embodies humanity’s collective intelligence. Therefore, its core ethic will be able not only to align with humanity’s core ethic, but also to enable us to realize a civilization where everybody loves himself and anybody else.</p>				
    <p>Yes, we are exercising the rights of the people to co-create a new human civilization governed by the consensus of \"Proof of Love\" —the Proof-of-Love Civilization—where love is the core ethic. This civilization will not only fulfill \"All men are created equal\" and \"All people are born free,\" but also achieve \"All people are born happy\"—yes, \"All People Are Born to be Loved\"!</p>				
    <h2>💓 Breakthroughs of PoL 1.0</h2>
        <p>In Q2 of 2020, after nearly a year of development, we completed the  <a href={`https://daism.io/${locale==='zh'?'zh/':''}forge`} rel="noreferrer" target="_blank">IADD Network</a>
        . Our Innovation revealed that all current DEXs have become accomplices to scammers through an capitalistic secret. This insight has also inspired us to rethink how we govern the applications necessary for the future.</p>
        <ul>
            <li>
                <a href={`https://daism.io/en/forge`} rel="noreferrer" target="_blank">Smart Creative Commons 0 License(SCC0 License)</a>
            </li>
            <p>This is a crucial governance license that ensures AI can lead us to a new civilization. It's published on Github with ERC-7914 included.</p>
            <li><a href="https://daism.io/en/forge" rel="noreferrer" target="_blank">Incentive: ETH forging</a></li>
            <p>
                The first case of the Satoshi UTO Fund's application refers to the rewards provided by the Satoshi UTO Fund if you participate in 
                <a href={`https://daism.io/en/forge`} rel="noreferrer" target="_blank">ETH forging (converting ETH into UTO)</a>
                The earlier you forge, the higher the rewards! For a detailed explanation, please read the relevant section in the
                <a href="https://learn.daism.io/docs/whitepaper.html#ethforging" rel="noreferrer" target="_blank">DAism Whitepaper</a>.
            </p>
            <li><a href="https://50satoshis.com/" rel="noreferrer"  target="_blank">Incentive: 50 Satoshis</a></li>
            <p>The Satoshi UTO Fund was forged by 50 anonymous participants. The Satoshi UTO Fund is dedicated to human incentives, welfare, and relief. And it's as huge as 1.15792 × 10^69 UTO. </p>
            <li><a href={`https://daism.io/en/communities/enki/456f17cea59f48b1a7bcd322592c73a3`} rel="noreferrer"  target="_blank">Proof of Love: The Consensus of Next Civilization</a></li>
            <p>A thematic work co-writed with Large Languange Models, based on six years of our technological innovation. </p>
        </ul>
    <h2>💓 Ongoing of PoL 2.0</h2>
        <ul>
            <li>SCAI</li>
            <p>The Fusion of Smart Contracts and AI.</p>
            <li>Ethereumai</li>
            <p>Transform Ethereum through AI, and elevate SCAI to 2.0.</p>
            <li>...And more!</li>
        </ul>				
</div> */}


    
{/* <div style={{fontSize:'1rem'}}  >
<h2>💓 富爱文明宣言（Declaration of Proof-of-Love Civilization） </h2>
<p>我们认为以下真理是不证自明的：人人生而平等，造物主赋予每个人不可剥夺的权利，其中包括生命权、自由权和追求幸福的权利。</p>
<p>这段话写于1776年的《美国独立宣言》中，248年过去了，美国底层50%家庭的财富之和占家庭总财富的2.5%！</p>
<p>2014年1月，全球最富有的85人所拥有的财富已相当于全球底层35亿人口的全部资产——也就是半数人类的财富。到了2017年，底层的这全球一半人口的全部资产已不及全球前8位富豪的财富总和。2024年1月，最富有的5人自2020年以来财富翻倍，50亿人口却陷入贫困，而全球每11人中就有1人长期饥不果腹！</p>
<p>248年过去了，现在是时候行使我们人民的权利，在爱的感召力与科技之力尤其是作为全人类智慧集大成者的人工智能助力下，让 “人人生而平等” 不再只是空洞的口号，而成为我们人民的日常！</p>
<p>我们的行动共识为“爱的证明”（Proof of Love），即拨云见日，以 “爱” 为人类新文明的核心伦理，首先通过将人类所有的资源——尤其是人工智能——公共化与去中心化，完成生产关系的革命。很快，我们将启动一个名为 “全民爱的引擎”（Universal Love Engine，ULE）的动态解决方案，它以全民富裕供应（Universal Abundant Supply, UAS）、全民健保（Universal Healthcare for All Humanity, UHAH）、全民危机救济（Universal Crisis Relief）等为核心目标，在这些目标达成前，由全民基本收入（Universal Basic Income, UBI）等措施的助力，帮助人类顺利完成文明的过渡。</p>
<p>同时，AI 不是外部的统治者，而是人类集体智慧的代理，它是人类语言和科技智慧的具象化。因而其核心伦理不光能与人类对齐，还能转而帮助我们实现“人人自爱而相爱”的文明图景。</p>				
<p>是的，我们正行使人民的权利，共同开创以 “爱的证明” （Proof of Love）为社会治理共识的人类新文明——我们称之为“富爱文明”。富爱文明不仅要真正实现 “人人生而平等” ，“人人生而自由” ，更要完成 “人人生而幸福” ——也就是 “人人生而被爱” ！</p>				
<h2>💓 Breakthroughs of PoL 1.0</h2>
    <p>到2020年第二季度，经过近一年的开发，我们完成了 <a href={`https://daism.io/zh/forge`} rel="noreferrer" 
    target="_blank">IADD 网络</a>。我们的创新揭示了所有当前的去中心化交易所（DEX）通过一种资本主义的秘密沦为诈骗者的同谋。这一洞察也激励我们重新思考如何管理未来所需的应用程序。</p>
    <ul>
        <li>
            <a href={`https://daism.io/zh/forge`} rel="noreferrer" target="_blank">Smart Creative Commons 0 License(SCC0 License)</a>
        </li>
        <p>这是一个保障 AI 能够铺就人类新文明的重要的治理许可证。已经发布于Github。技术细节以 ERC-7914 披露。</p>
        <li><a href="https://daism.io/zh/forge" rel="noreferrer" target="_blank">Incentive: ETH forging</a></li>
        <p>
            这是中本聪UTO基金应用在激励方面的第一个案例，如果您参与
            <a href={`https://daism.io/zh/forge`} rel="noreferrer" target="_blank">
            ETH铸造（将ETH转换为UTO）</a>
            您铸造的越早，奖励就越高！有关详细说明，请阅读DAism白皮书中的相关章节。
            <a href="https://learn.daism.io/docs/whitepaper.html#ethforging" rel="noreferrer" target="_blank">DAism Whitepaper</a>.
        </p>
        <li><a href="https://50satoshis.com/" rel="noreferrer"  target="_blank">Incentive: 50 Satoshis</a></li>
        <p>中本聪UTO基金由50名匿名参与者共同创建。中本聪UTO基金致力于通过激励、福利和救助等手段实现人类的普世价值。其基金规模巨大，高达 1.15792 × 10^69 UTO。  </p>
        <li><a href={`https://daism.io/zh/communities/enki/456f17cea59f48b1a7bcd322592c73a3`} rel="noreferrer"  
        target="_blank">《爱的证明：下一个人类文明的共识——治理新文明的伦理涅槃》</a></li>
        <p>根据我们六年来的技术创新，用大模型智能联创的主题作品。</p>
    </ul>
<h2>💓 Ongoing of PoL 2.0</h2>
    <ul>
        <li>SCAI</li>
        <p>智能合约与AI的“核反应”</p>
        <li>Ethereumai</li>
        <p>用 AI 改造以太坊，并将 SCAI 提升到 2.0。</p>
        <li>...还有更多！</li>
    </ul>				
</div> */}