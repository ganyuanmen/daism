import {Modal } from 'react-bootstrap';

export default function Preview({show,setShow,nftText,t}) {
      
    return (
        <Modal className='daism-title' show={show} onHide={(e) => {setShow(false)}}>
        <Modal.Header closeButton>NFT {t('previewText')} </Modal.Header>
        <Modal.Body className='d-flex justify-content-center align-items-center'  >
        <div dangerouslySetInnerHTML={{__html: nftText}}></div>
        </Modal.Body>
        </Modal>
    );
  }
  

