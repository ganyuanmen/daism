

import ShowAddress from "../ShowAddress";
import TopSearch from "./TopSearch";
import parse, { Element } from "html-react-parser";
import { type HomeDataType } from '@/app/[locale]/set/page';


export interface DaoRecord {
  dao_id: number;
  dao_name: string;
  dao_symbol: string;
  dao_manager: string;
  creator: string;
  dao_logo?: string;
  dao_desc: string;
  block_num: number | string;
  utoken_cost: number | string;
  dao_ranking: number | string;
}

interface DaosPageProps {
  daosData: DaoRecord[];
  orderType: boolean;
  postStatus: string;
  orderIndex: number;
  setCurrentPageNum: React.Dispatch<React.SetStateAction<number>>;
  setOrderType: React.Dispatch<React.SetStateAction<boolean>>;
  setOrderField: React.Dispatch<React.SetStateAction<string>>;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  setOrderIndex: React.Dispatch<React.SetStateAction<number>>;
    locale:string;
    obj:HomeDataType;
}

export default function DaosPage({
  daosData,locale,obj,
  setCurrentPageNum,
  orderType,
  setOrderType,
  setOrderField,
  setSearchText,
  postStatus,
  orderIndex,
  setOrderIndex
}: DaosPageProps) {
  // const t = useTranslations('dao')


//   const row=`
//   <div class="card mb-2 daism-title">
//    <div class="card-header">
//     {{dao_name}}(Valuation Token: {{dao_symbol}})
//   </div>
//   <div class="card-body">
//   	<div class="mb-2" style="display: flex;justify-content: space-between;" >
// 		     <div > 管理员: <span data-address='{{dao_manager}}' > address</span> </div>
// 		     <div > Dapp 地址: <span data-address='{{creator}}' >address</span> </div>
// 		</div>
		   
// 		<div style="display:flex;gap:12px">
// 		     <div style="display:flex;align-items: center;justify-content: center;" >
// 		        <a href="/zh/workroom/{{dao_id}}" >
// 					<img style="width:64px;height:64px;" alt='' src="{{dao_logo}}" />
// 		        </a>
// 		      </div>
// 		      <div style="flex: 1;">
// 		      <div style="display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden;padding-right:0" >
// 				{{dao_desc}}</div> 
// 		      </div>
// 		</div>
		   
// 		<div class="mt-2" style="font-size:0.8rem;display: flex;justify-content: space-between;" >
// 			<div style="text-align:left" >区块高度： {{block_num}} </div>
// 			<div style="text-align:center" > 币价： {{utoken_cost}} jeedd </div>
// 			<div style="text-align:right" > 市值排名： {{dao_ranking}} </div>
// 		</div>

//     </div>

// </div>`;

const row=locale==='en'?obj.var_en:obj.var_zh;

const replaceRow= daosData.map(item => row.replaceAll("{{dao_ranking}}",item.dao_ranking.toString())
     .replaceAll("{{utoken_cost}}",item.utoken_cost.toString())
     .replaceAll("{{block_num}}",item.block_num.toString())
     .replaceAll("{{dao_logo}}",(item.dao_logo??'').toString())
     .replaceAll("{{dao_id}}",item.dao_id.toString())
     .replaceAll("{{dao_desc}}",item.dao_desc.toString())
     .replaceAll("{{dao_manager}}",item.dao_manager.toString())
     .replaceAll("{{creator}}",item.creator.toString())
     .replaceAll("{{dao_name}}",item.dao_name.toString())
     .replaceAll("{{dao_symbol}}",item.dao_symbol.toString())).join(""); 


     
      const Page = () => {
      return parse(replaceRow, {
        replace: (domNode) => {
           if (domNode instanceof Element) {
          if (domNode?.name === "span") {
            return <ShowAddress address={domNode.attribs.address} />;
          }
        }},
      });
    }

  return (
    <>
      <TopSearch
        orderType={orderType}
        orderIndex={orderIndex}
        setOrderIndex={setOrderIndex}
        setOrderType={setOrderType}
        setOrderField={setOrderField}
        setCurrentPageNum={setCurrentPageNum}
        setSearchText={setSearchText}
        postStatus={postStatus}
      />

      <div>{Page()}</div>
{/* 
      {daosData.map((record, idx) =>
        <Card key={idx} className="mb-2 daism-title ">
          <Card.Header className="daism-title" >
            <h4>{record.dao_name}(Valuation Token: {record.dao_symbol})</h4>
          </Card.Header>
          <Card.Body >
            <Row className="mb-2" >
              <Col className="Col-auto me-auto">
                {t('managerText')}:{' '}<ShowAddress address={record.dao_manager} />
              </Col>
              <Col className="col-auto">
                {t('execText')}:{' '}<ShowAddress address={record.creator} />
              </Col>
            </Row>

            <Row className="mb-3" >
              <Col className='col-auto d-flex align-items-center'>
                <Link
                  className='daism-a'
                  href={`/${locale}/workroom/[id]`}
                  as={`/${locale}/workroom/${record.dao_id}`}
                >
                  <ImageWithFallback
                    alt=""
                    width={64}
                    height={64}
                    src={!record.dao_logo || record.dao_logo.length < 12 ? '/logo.svg' : record.dao_logo}
                  />
                </Link>
              </Col>

              <Col className='Col-auto me-auto'>
                <div style={{display:'-webkit-box',WebkitBoxOrient:'vertical',WebkitLineClamp:3,overflow:'hidden',paddingRight:0}} >{record.dao_desc}</div>
              </Col>
            </Row>

            <Row style={{ fontSize: '0.8rem' }}>
              <Col style={{ textAlign: 'left' }} className='col-auto'>
                {t('createTimeText')}： {record.block_num}
              </Col>
              <Col style={{ textAlign: 'center' }} className='Col-auto me-auto'>
                {t('coinPriceText')}： {record.utoken_cost} jeedd
              </Col>
              <Col style={{ textAlign: 'right' }} className='col-auto'>
                {t('rankingText')}： {record.dao_ranking}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )} */}

    
    </>
  )
}
