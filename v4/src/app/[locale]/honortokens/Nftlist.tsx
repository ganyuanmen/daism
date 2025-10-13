"use client";

import { Card, Row, Col, Modal, Table } from 'react-bootstrap';
import ShowAddress from '@/components/ShowAddress';
import { useState } from 'react';
import { SvgImage } from '@/components/SvgImage';

interface NftlistProps {
  mynftData: NftObjType[];
}

const Nftlist: React.FC<NftlistProps> = ({ mynftData }) => {
  const [show, setShow] = useState(false);
  const [nftObj, setNftObj] = useState<NftObjType | null>(null);

 const Tips=[,"DAism Deployment","Honor Tokens Deployment","ETH Forging","Love's Cowriting Plan",
  "EnKi Deployment",
  
  
  
  ]

  const geneTips=(nftObj:NftObjType)=>{
    if(nftObj._type===0) return "Issuance of Satoshi UTO Fund"; //50个中本聪
    if(nftObj._type===2) return "Tipping";  //兑换打赏 已丢弃
    if(nftObj._type===3) return "DAism Deployment"; // 建公器
    if(nftObj._type===4) return "ETH Forging"; // 锻造UTO
    if(nftObj._type===5) return "Love's Cowriting Plan"; // enki 中打赏给个人
    if(nftObj._type===1) 
    {
      if(nftObj.tips?.startsWith("Donation in support of Proof of Love")) return "Donation";  //捐赠
      else return nftObj.Tips  //
    }

     

  }
  const showwin = (obj: NftObjType) => {
    setNftObj(obj);
    setShow(true);
  };

  return (
    <>
      <div className="d-flex flex-wrap justify-content-start align-items-center mt-3" style={{ width: '100%' }}>
        {mynftData.map((obj, idx) => (
          <div key={idx} style={{ width: '320px', margin: '10px' }}>
            <Card>
              <Card.Body>
                  <SvgImage svgCode={obj.tokensvg} width={270} height={270} />
                <div className="daism-nowrap">Owner: <ShowAddress address={obj.to_address} isb={true} /></div>
                <Row>
                  <Col className="Col-auto me-auto">ID: <b>{obj.token_id}</b></Col>
                  <Col className="col-auto">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        showwin(obj);
                      }}
                    >
                      show more
                    </a>
                  </Col>
                </Row>
                <div className="daism-nowrap">BlockNumber: <b>{obj.block_num}</b></div>
                <div className="daism-nowrap">
                  Contract: <ShowAddress address={obj.contract_address} isb={true} />
                </div>
                <div className="daism-nowrap">Time: <b>{obj._time}(UTC+8)</b></div>
                <div className="daism-nowrap">
                Event: <b>{geneTips(obj)}</b>
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      <Modal className="daism-title" size="lg" show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          {nftObj && (
            <Card style={{ margin: '10px' }}>
              <Card.Body>
                <div style={{ textAlign: 'center' }}>
                  <SvgImage svgCode={nftObj.tokensvg} width={300} height={300} />
                 
                </div>
                <Table striped bordered hover style={{ width: '100%', marginTop: '4px' }}>
                  <tbody>
                    <tr>
                      <td style={{ textAlign: 'right' }}>Owner</td>
                      <td><b>{nftObj.to_address}</b></td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: 'right' }}>ID</td>
                      <td><b>{nftObj.token_id}</b></td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: 'right' }}>BlockNumber</td>
                      <td><b>{nftObj.block_num}</b></td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: 'right' }}>Contract Address</td>
                      <td><b>{nftObj.contract_address}</b></td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: 'right' }}>NFT Time</td>
                      <td><b>{nftObj._time}(UTC+8)</b></td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: 'right' }}>Event</td>
                      <td>
                        <b>{geneTips(nftObj)}</b>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Nftlist;
