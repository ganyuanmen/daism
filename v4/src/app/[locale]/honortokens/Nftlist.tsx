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
                <div className="daism-nowrap">owner: <ShowAddress address={obj.to_address} isb={true} /></div>
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
                <div className="daism-nowrap">blockNumber: <b>{obj.block_num}</b></div>
                <div className="daism-nowrap">
                  contract: <ShowAddress address={obj.contract_address} isb={true} />
                </div>
                <div className="daism-nowrap">time: <b>{obj._time}(UTC+8)</b></div>
                <div className="daism-nowrap">
                  issue: <b>{obj._type === 0 ? 'daism.io' : obj._type === 5 ? 'Enki' : obj.dao_name}</b>
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
                      <td style={{ textAlign: 'right' }}>owner</td>
                      <td><b>{nftObj.to_address}</b></td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: 'right' }}>ID</td>
                      <td><b>{nftObj.token_id}</b></td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: 'right' }}>blockNumber</td>
                      <td><b>{nftObj.block_num}</b></td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: 'right' }}>contract address</td>
                      <td><b>{nftObj.contract_address}</b></td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: 'right' }}>nft time</td>
                      <td><b>{nftObj._time}(UTC+8)</b></td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: 'right' }}>issue</td>
                      <td>
                        <b>{nftObj._type === 0 ? 'daism.io' : nftObj._type === 5 ? 'Enki' : nftObj.dao_name}</b>
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
