
import { Button } from 'react-bootstrap'
import { ethers } from 'ethers';
import PageLayout from '../components/PageLayout';





export default function Aaa() {

    async function show()
    {
   
        const ZERO_UINT128 = "00000000000000000000000000000000"
     
        let het_str =ethers.toBeHex(7)
        het_str += ZERO_UINT128;
        let v1= BigInt(het_str)
        console.info(v1)

        const provider=new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/2e68e4d6017344cd89bab57981783954')
        const result = await provider.send('eth_chainId', []);
        console.info(result)
        console.info("------ooooooooooooooooooo--------")
    }
  
    return (
        <PageLayout>
            <div style={{maxWidth:'800px',margin:'8px auto'}} className='mt-1' > 
               <Button onClick={e=>{show()}} >aaaaaaaaaaaaaa </Button>
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
  

  

  