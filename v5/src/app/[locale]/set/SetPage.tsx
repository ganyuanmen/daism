"use client";

import {  Tab, Tabs } from "react-bootstrap";
import { type HomeDataType } from './page';
import HomePlugin from './HomePlugin';
import { useTranslations } from "next-intl";
import SmarcommonPlugin from "./SmarcommonPlugin";

interface PropsType{
    data:HomeDataType[]
}

export default function SetPage({data}:PropsType) {
    const t = useTranslations('Navigation');

   
  return (
    <Tabs
      defaultActiveKey="home"
      id="uncontrolled-tab-example"
      className="mb-3"
    >
      <Tab eventKey="home" title={t('home')}>
        <HomePlugin obj={data[0]} />
      </Tab>
      <Tab eventKey="smarcommon" title={t('smarcommon')}>
         <SmarcommonPlugin obj={data[1]} />
      </Tab>

    </Tabs>
  );
}
