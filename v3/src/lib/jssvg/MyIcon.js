

 import { useState } from 'react';
import {DateSvg,DeleteSvg,EditSvg,EventsSvg,GroupsSvg,
  JoinSvg,NewsSvg,TimeSvg,WebsitSvg,LeaveSvg,AddSvg,UserSvg,UserAddSvg,
  UserVerifySvg,WalletSvg,ConnetctSvg,FindSvg,SendSvg,YesSvg,LocationSvg,
  ReplySvg,NoSvg,ChatSvg,MyWalletSvg,AccountSvg,Member,MemberVerify,
  ExitSvg,LoginSvg,User1Svg,GasTokenSvg,SwapSvg,TokenSvg,DaoSvg,AppSvg,
SwapTokenSvg,CheckSvg,SetLogoSvg,ExcuteSvg,ExitWalletSvg,ToolsSvg,UnlockSvg
,UploadSvg,LockSvg,MemberRemoveSvg,VitaSvg,Honor,Down,Up,Paperclip,Home,BookTap,Event,Follow,Heart
,Right,Left,PublicMess,SomeOne,BackSvg,BookSvg} from './SvgCollection';
  import { Button } from 'react-bootstrap';




export default function MyIcon() {
    const [color,setColor]=useState('')   
    const setC=()=>{
      if(color) setColor('')
      else setColor('daism-color')
    }

 
    return (
      <>
      <div>
      <Button onClick={setC} >上色</Button>
      </div>
       DateSvg ：<span className={color} ><DateSvg/></span><br/>
       DeleteSvg ：<span className={color} ><DeleteSvg/></span><br/>
  
       EditSvg ：<span className={color} ><EditSvg/></span><br/>
       EventsSvg ：<span className={color} ><EventsSvg/></span><br/>
       GroupsSvg ：<span className={color} ><GroupsSvg/></span><br/>
       JoinSvg ：<span className={color} ><JoinSvg/></span><br/>
       NewsSvg ：<span className={color} ><NewsSvg/></span><br/>
       TimeSvg ：<span className={color} ><TimeSvg/></span><br/>
       WebsitSvg ：<span className={color} ><WebsitSvg/></span><br/>
       LeaveSvg ：<span className={color} ><LeaveSvg/></span><br/>
       FindSvg ：<span className={color} ><FindSvg/></span><br/>
       AddSvg ：<span className={color} ><AddSvg/></span><br/>
       UserSvg :<span className={color} ><UserSvg/></span><br/>
        UserAddSvg ：<span className={color} ><UserAddSvg/></span><br/>
          UserVerifySvg :<span className={color} ><UserVerifySvg/></span><br/>
          WalletSvg ：<span className={color} ><WalletSvg/></span><br/>
          ConnetctSvg ：<span className={color} ><ConnetctSvg/></span><br/>
          SendSvg ：<span className={color} ><SendSvg/></span><br/>
          YesSvg ：<span className={color} ><YesSvg/></span><br/>
          LocationSvg ：<span className={color} ><LocationSvg/></span><br/>
          ReplySvg ：<span className={color} ><ReplySvg/></span><br/>
          NoSvg ：<span className={color} ><NoSvg/></span><br/>
          ChatSvg ：<span className={color} ><ChatSvg/></span><br/>
          MyWalletSvg ：<span className={color} ><MyWalletSvg/></span><br/>
          AccountSvg ：<span className={color} ><AccountSvg/></span><br/>
          Member ：<span className={color} ><Member/> </span><br/>
          MemberVerify ：<span className={color} ><MemberVerify/> </span><br/>
          ExitSvg ：<span className={color} ><ExitSvg/> </span><br/>
          LoginSvg ：<span className={color} ><LoginSvg/> </span><br/>
          User1Svg ：<span className={color} ><User1Svg/> </span><br/>
          GasTokenSvg ：<span className={color} ><GasTokenSvg/> </span><br/>
          SwapSvg ：<span className={color} ><SwapSvg/> </span><br/>
          TokenSvg ：<span className={color} ><TokenSvg/> </span><br/>
          DaoSvg ：<span className={color} ><DaoSvg/> </span><br/>
          AppSvg ：<span className={color} ><AppSvg/> </span><br/>
          SwapTokenSvg ：<span className={color} ><SwapTokenSvg/> </span><br/>
          CheckSvg ：<span className={color} ><CheckSvg/> </span><br/>
          SetLogoSvg ：<span className={color} ><SetLogoSvg/> </span><br/>
        
          ExcuteSvg ：<span className={color} ><ExcuteSvg/> </span><br/>
          ExitWalletSvg ：<span className={color} ><ExitWalletSvg/> </span><br/>
          ToolsSvg ：<span className={color} ><ToolsSvg/> </span><br/>
          UnlockSvg ：<span className={color} ><UnlockSvg/> </span><br/>
          UploadSvg ：<span className={color} ><UploadSvg/> </span><br/>
          LockSvg ：<span className={color} ><LockSvg/> </span><br/>
          MemberRemoveSvg ：<span className={color} ><MemberRemoveSvg/> </span><br/>
          vitaSvg ：<span className={color} ><VitaSvg/> </span><br/>

          Honor ：<span className={color} ><Honor/> </span><br/>
          Down ：<span className={color} ><Down/> </span><br/>
          Up ：<span className={color} ><Up/> </span><br/>
          Paperclip ：<span className={color} ><Paperclip/> </span><br/>
          Home ：<span className={color} ><Home/> </span><br/>
          BookTap ：<span className={color} ><BookTap/> </span><br/>
          Event ：<span className={color} ><Event/> </span><br/>
          Follow ：<span className={color} ><Follow/> </span><br/>
          Heart ：<span className={color} ><Heart/> </span><br/>
          Right ：<span className={color} ><Right/> </span><br/>
          Left ：<span className={color} ><Left/> </span><br/>
          PublicMess ：<span className={color} ><PublicMess/> </span><br/>
          SomeOne ：<span className={color} ><SomeOne/> </span><br/>
          BackSvg ：<span className={color} ><BackSvg/> </span><br/>
          BookSvg : <span className={color} ><BookSvg/> </span><br/>
      </>
    );
}
