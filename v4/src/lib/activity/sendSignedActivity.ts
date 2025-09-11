import https from 'https';
import crypto from 'crypto';

export interface SigneActor {
  privateKey: string;
  publicKeyId: string;
}


export async function sendSignedActivity(url: string, message: any, actor: SigneActor): Promise<void> {
  if (Number(process.env.IS_DEBUGGER??'0') === 1){
    console.info("message:",message);
    console.info("url:",url);
    console.info("actor:",actor);
    console.log("------------------------------------------------")
  }
  try {
    const messageString = JSON.stringify(message);
    const digest = crypto.createHash('sha256').update(messageString).digest('base64');
    const date = new Date().toUTCString();
    const urlObj = new URL(url);
    
    // 创建签名头
    const signatureHeaders = [
      '(request-target): post ' + urlObj.pathname,
      'host: ' + urlObj.host,
      'date: ' + date,
      'digest: SHA-256=' + digest
    ].join('\n');

    // 创建签名
    const signer = crypto.createSign('sha256');
    signer.update(signatureHeaders);
    signer.end();
    const signature = signer.sign(actor.privateKey, 'base64');

    const signatureHeader = `keyId="${actor.publicKeyId}",algorithm="rsa-sha256",headers="(request-target) host date digest",signature="${signature}"`;

    
    const headers = {
      'Content-Type': 'application/activity+json',
      'Host': urlObj.host,
      'Date': date,
      'Digest': `SHA-256=${digest}`,
      'Signature': signatureHeader
    };

    return new Promise((resolve, reject) => {
      const req = https.request(url, {
        method: 'POST',
        headers
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          console.info('发送成功:', data);
          resolve();
        });
      });

      req.on('error', (error) => {
        console.error('发送失败:', error);
        reject(error);
      });

      req.write(messageString);
      req.end();
    });
  } catch (error) {
    console.error('准备请求时出错:', error);
    throw error;
  }
}
