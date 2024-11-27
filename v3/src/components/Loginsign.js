import { useRef } from 'react'
import LoginButton from './LoginButton'
import ShowErrorBar from './ShowErrorBar'
import { Button } from 'react-bootstrap'

export default function Loginsign({user,tc}) {
    const loginRef=useRef(null)
  
    return (<>{user.connected===1?
                <Button variant="primary" onClick={()=>loginRef.current.siweLogin()} >
                  <img alt='' src='/loginbutton.svg' width={18} height={18} style={{color:'white'}} />  {'  '}
                  <LoginButton  ref={loginRef} ></LoginButton>
                </Button>
                :<ShowErrorBar errStr={tc('noConnectText')} />
                }
            </>

       
    )
}

