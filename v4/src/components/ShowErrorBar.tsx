import Alert from 'react-bootstrap/Alert';

interface PropsType{
  errStr:string
}
export default function ShowErrorBar({errStr}:PropsType) {
  return ( 
    <Alert variant='danger' style={{ margin:'10px auto' }} >{errStr}</Alert>
  )
  }
  