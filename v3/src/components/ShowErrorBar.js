import Alert from 'react-bootstrap/Alert';

export default function ShowErrorBar({errStr}) {
  return ( 
    <Alert variant='danger' style={{ margin:'10px auto' }} >{errStr}</Alert>
  )
  }
  