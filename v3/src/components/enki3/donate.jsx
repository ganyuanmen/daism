import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSelector } from 'react-redux';

// 引入二维码生成库

import ShowErrorBar from '../ShowErrorBar';

const DonationPage = ({env}) => {
  const [donationAmount, setDonationAmount] = useState('');
  const [donationStatus, setDonationStatus] = useState('');
  const contractAddress = '0xdBAEECD7E8e5396B0c6aC74488f576ec3aA3DD9d'; 
  const user = useSelector((state) => state.valueData.user)

  let tc = useTranslations('Common')
  let t = useTranslations('ff')

  const handleConnectWallet = () => {
    // 此处添加连接钱包的逻辑（如使用MetaMask等）
    console.log('Connecting to wallet...');
  };

  const handleDonation = () => {
    // 此处添加捐赠逻辑，可能会调用合约或者其他API
    console.log(`Donating ${donationAmount} ETH to contract address: ${contractAddress}`);
    setDonationStatus('Donation Successful! Thank you for your support!');
  };

  return (
    <div className="donation-container">
      <div className="header">
        <img src="/path-to-your-logo.png" alt="道易程 Logo" className="logo" />
        <h1>Donation</h1>
      </div>

      <div className="intro">
        <p>Support Proof of Love (Support SCC0 License) – Make a Donation</p>
        <p>支持我们的开源项目 ，您的捐赠帮助我们维持项目的开发和维护，感谢您的支持</p>
        <p>By donating, you agree to our <a href="https://learn.daism.io/zh/blogcn/136-pol.html" target="_blank" rel="noopener noreferrer">Terms</a> which include experimental rewards.</p>
      </div>

      <div className="donation-form">
        <label htmlFor="donation-amount">捐赠数量 (ETH): </label>
        <input
          type="number"
          id="donation-amount"
          value={donationAmount}
          onChange={(e) => setDonationAmount(e.target.value)}
          placeholder="请输入捐赠数量"
        />

        <div className="contract-address">
          <p>捐赠合约地址: {contractAddress}</p>
        </div>

        {/* <button onClick={handleConnectWallet} className="connect-wallet-btn">
          连接钱包
        </button> */}

        {user.connected!==1?<ShowErrorBar errStr={tc('noConnectText')} />

        :<button onClick={handleDonation} className="donate-btn">
          捐赠
        </button>}

        <div className="qr-code">
          <p>扫描二维码直接向我们的合约地址捐赠ETH：</p>
          {/* <QRCode value={contractAddress} size={128} /> */}
        </div>
      </div>

      {donationStatus && (
        <div className="donation-feedback">
          <p>{donationStatus}</p>
          <p>荣誉通证已发放，感谢您的支持！</p>
          <p>奖励UTO信息：XXX</p>
          <p>引导注册enki账号以获取更多奖励。</p>
        </div>
      )}
    </div>
  );
};

export default DonationPage;
