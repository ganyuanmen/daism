
import { Button, Card } from 'react-bootstrap'
import UpBox from '../components/iadd/UpBox'
import DownBox from '../components/iadd/DownBox';
import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { ethers } from 'ethers';
import SubmitButton from '../components/iadd/SubmitButton';
import StatusBar from '../components/iadd/StatusBar';
import usePrice from "../hooks/usePrice";
import ShowErrorBar from "../components/ShowErrorBar";
import { useTranslations } from 'next-intl'
import PageLayout from '../components/PageLayout';
import DaismInputGroup from '../components/form/DaismInputGroup';

export default function FollowOther() {
   const accountRef=useRef()
   function fff()
   {
    let _account=accountRef.current.getData();
    console.log(_account)
    let str=_account.split('@')
    let _name=str[0]
    let _domain=str[1]
    fetch(`/api/followother?account=${_name}&domain=${_domain}`).then(e=>{
        console.log(e)
    })
    

   }

    return (
        <PageLayout>
           <div>
           <DaismInputGroup title='对方帐号：' defaultValue='gym@daotodon.me' ref={accountRef}  />
           <Button onClick={fff} >关注 </Button>
           </div>
        </PageLayout>
    )
    }

    
export const getStaticProps  = ({ req, res,locale }) => {
    return {
        props: {
            messages: {
            ...require(`../messages/shared/${locale}.json`),
            ...require(`../messages/iadd/${locale}.json`),
            }
            }
        }
    }
  

  

  