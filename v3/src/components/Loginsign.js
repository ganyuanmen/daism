import { useRef } from 'react'
import LoginButton from './LoginButton'
import ShowErrorBar from './ShowErrorBar'
import { Button } from 'react-bootstrap'
import { useTranslations } from 'next-intl'
import { useSelector } from 'react-redux';

/**
 * 显示登录按钮
 * @param {*} param0 
 * @returns 
 */
export default function Loginsign({}) {
    const loginRef=useRef(null)
    const tc=useTranslations('Common')
    const user = useSelector((state) => state.valueData.user) //钱包登录用户信息
    return (<>{user.connected===1?
                <Button variant="primary"  onClick={()=>loginRef.current.siweLogin()} >
                  <img alt='' src='/loginbutton.svg' width={18} height={18} style={{color:'white'}} />  {'  '}
                  <LoginButton  ref={loginRef} />
                </Button>
                :<ShowErrorBar errStr={tc('noConnectText')} />
                }
            </>

       
    )
}

