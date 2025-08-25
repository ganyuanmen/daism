
import { getData } from '../mysql/common';
import crypto from 'crypto';
import request from 'request';

export async function signAndSend(url: any, name: any, domain: any, message: any, privkey: any): Promise<void> {
    if (process.env.IS_DEBUGGER === '1') {
        console.info(`${new Date().toLocaleString()}: signAndSend --->`, [url, name, domain, message]);
    }

    const myURL: any = new URL(url);
    const targetDomain: any = myURL.hostname;
    const inboxFragment: any = url.replace('https://' + targetDomain, '');

    const digestHash: any = crypto.createHash('sha256').update(JSON.stringify(message)).digest('base64');
    const signer: any = crypto.createSign('RSA-SHA256');

    const d: any = new Date();
    const stringToSign: any = `(request-target): post ${inboxFragment}\nhost: ${targetDomain}\ndate: ${d.toUTCString()}\ndigest: SHA-256=${digestHash}\ncontent-type: application/activity+json`;

    signer.update(stringToSign);
    signer.end();

    const signature: any = signer.sign(privkey);
    const signature_b64: any = signature.toString('base64');

    const header: any = `keyId="https://${domain}/api/activitepub/users/${name}",algorithm="rsa-sha256",headers="(request-target) host date digest content-type",signature="${signature_b64}"`;

    request({
        url,
        headers: {
            'Host': targetDomain,
            'Date': d.toUTCString(),
            'Digest': `SHA-256=${digestHash}`,
            'Signature': header,
            'content-type': 'application/activity+json'
        },
        method: 'POST',
        json: true,
        body: message
    }, (error: any, response: any) => {
        if (error) {
            console.error('signAndSend Error:', error, (response && response.body) ? response.body : '');
        } else {
            if (process.env.IS_DEBUGGER === '1') {
                console.info(`signAndSend Info: Code:${response?.statusCode}, Response:${response?.body?.error}`);
            }
        }
    });
}


export type HttpHeaders = HeadersInit & Record<string, string>;

export async function httpGet<T = any>(
  url: string,
  headers: HttpHeaders = {}
): Promise<T | null> {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!res.ok) {
      console.error(`httpGet failed: ${res.status} ${res.statusText}`);
      return null;
    }

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return (await res.json()) as T;
    } else {
      return (await res.text()) as unknown as T;
    }
  } catch (err) {
    console.error(`httpGet error: ${err}`);
    return null;
  }
}



export function broadcast({ type, domain, user, actor, followId }: { type: any; domain: any; user: any; actor: any; followId: any }): void {
    getData('SELECT DISTINCT domain FROM a_account WHERE domain<>?', [domain]).then((data: any) => {
        data.forEach((element: any) => {
            try {
                const url: any = `https://${element.domain}/api/broadcast`;
                let message: any;

                if (type === 'follow') {
                    if (user?.domain === element.domain || actor?.domain === element.domain) return;
                    message = { type, domain, user, actor, followId };
                } else if (type === 'removeFollow') {
                    message = { type, followId }; // 取消关注
                } else if (type === 'addType') {
                    message = { type, _desc: actor?._desc, _type: actor?._type };
                } else if (type === 'recover') {
                    message = { type, user, actor }; // 转移关注
                } else {
                    return;
                }

                if (user?.domain !== element.domain) {
                    request(
                        {
                            url,
                            headers: { 'content-type': 'application/activity+json' },
                            method: 'POST',
                            json: true,
                            body: message
                        },
                        (error: any, response: any) => {
                            if (error) {
                                console.error('broadcast follow Error:', error, (response && response.body) ? response.body : '');
                            } else {
                                if (process.env.IS_DEBUGGER === '1') {
                                    console.info(`broadcast follow Code:${response?.statusCode}, Response:${response?.body?.error}`);
                                }
                            }
                        }
                    );
                }
            } catch (e1) {
                console.error('broadcast follow', e1);
            }
        });
    });
}
