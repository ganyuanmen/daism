
#  daism

DAism is a smart common to govern apps and tokenomics. The mission of DAism is to abandon the capitalist mode of production. We believe its governance consensus, Proof-of-Value, will help humanity move towards a new civilization.

## Website deployment

Deploy using Docker Composer 
```js

docker compose up -d

```

## setting

.env.product

```js
 
NODE_ENV=production

#domain
LOCAL_DOMAIN=your domain

#Blockchain Network 
BLOCKCHAIN_NETWORK=mainnet

#Connect account information
HTTPS_URL=https://${BLOCKCHAIN_NETWORK}.infura.io/v3/${your key}
WSS_URL=wss://${BLOCKCHAIN_NETWORK}.infura.io/ws/v3/${your key}
ETHERSCAN_URL=https://${BLOCKCHAIN_NETWORK}.etherscan.io/tx/

IS_DEBUGGER=1

# Number of registrations allowed for the Smart Commons community
SMART_COMMONS_COUNT=1004

IMGDIRECTORY=uploads

#administrator address (wallet address)
ADMINISTRUTOR_ADDRESS=0x49Fb974407707507f3549c38044924a64e0dA615

KEY=1d34a678S012A4567I90123m56789p1X
IV=7e465a0de91b295946ddbc0e5e72f056


```
