'use client';

import React from 'react';
import Loddingwin from './Loddingwin';
import ShowNotice from './ShowNotice';
import ShowTip from './ShowTip';
import ShowErrWin from './ShowErrWin';


export default function InitComponent() {
  return (
   <>
   <Loddingwin />
    <ShowTip />
    <ShowNotice />
    <ShowErrWin />
   </>
  );
}


