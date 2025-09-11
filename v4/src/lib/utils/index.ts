import { NextRequest } from 'next/server';
// import axios from 'axios';
// import cheerio from 'cheerio';
import * as cheerio from 'cheerio';
import { getInboxFromAccount } from '../mysql/message'
import path from 'node:path';
import * as fs from "node:fs/promises"; 


export async function saveImage(file:File)
{

  if (!(file instanceof File)) {
    console.error("no file object:", file);
    return '';
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = path.extname(file.name); // 原始扩展名
    const randomName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const _path=new Date().toISOString().slice(0, 10);
    const uploadDir = path.join(process.cwd(), `${process.env.IMGDIRECTORY}/${_path}` );
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, randomName);
    await fs.writeFile(filePath, buffer);
    return `https://${process.env.NEXT_PUBLIC_DOMAIN}/${process.env.IMGDIRECTORY}/${_path}/${randomName}`;
  } catch (error) {
   console.error(error);
   return  '';
  }
}

// export function delUploadImge(files)
// {
  
//   if(files && files.image && files.image[0])
//   {
//     fs.unlink(files.image[0].filepath, (err) => {if (err) console.error('delete file error:', err)})
//   }
// }

// export function delOldImage(path)
// {
//   fs.unlink(`./uploads/${path}`, (err) => {if (err) console.error('delete file error:', err)})
// }

// export function readImg(path,res){
//         fs.readFile(`./uploads/${path}`,'binary',function(err,file){
//             if(err){
//                 console.error(err);
//                 return;
//             }else{
//                 res.write(file,'binary');
//                 res.end();
//             }
//         });
// }

//非a标签 img 标签中的第一个URI
export  function findFirstURI(code:string) {
  const regex = /(?<!<img[^>]*src=["'])(?<!<a[^>]*href=["'])(https?:\/\/[^\s"'<>)]+)\s*/i;
  const match = code.match(regex);
  return match ? match[0] : null;
}

export  async function getTootContent(tootUrl:string,domain:string) {
    try {
        const myURL = new URL(tootUrl);
        const targetDomain = myURL.hostname;

        const response = await fetch(tootUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text(); 


        const $ = cheerio.load(html);
        const localimg=`https://${domain}/article.svg`
  
      // 获取 meta 标签中的信息
      const title = $('title').text();
      const user = $('meta[property="og:title"]').attr('content');
      let image = $('meta[property="og:image"]').attr('content');
      const desc = $('meta[name="description"]').attr('content');
      let content = $('meta[property="og:description"]').attr('content'); //.replaceAll('\n','  ');
      const name=$('meta[property="profile:username"]').attr('content');
      if(!image && name){
        const actor=await getInboxFromAccount(name); 
        image=actor?.avatar;

      }
      // 
      if(content){
        let temp=content.split('\n');
        if(temp.length>0) { 
          if(temp[0].startsWith('Attached:'))
          {
            temp=temp.slice(1);
          }
          
          content=temp.join(' ');
    
        }
      }
      const uc=`<a href="${tootUrl}" target="_blank" class="daism-a daism-linka" >
      <div class="daism-image"  >
          <img src='${image?image:localimg}' alt="" class='daism-linkimg' >
      </div>
      <div  >
          <div class='daism-line0' >${targetDomain}</div>
          <div class='daism-line1' >${user?user:title}</div>
          <div class='daism-line2' > ${content?content:(desc?desc:targetDomain)}</div>	
      </div>
      </a>` ;

    

      return uc;
    } catch (error:any) {
      console.error('get content from url error:', error.message);
      return null;
    }
}
  


export function getClientIp(req: NextRequest): string | undefined {
  // 从 headers 中获取 x-forwarded-for
  const xForwardedFor = req.headers.get('x-forwarded-for');
  
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0]?.trim();
  }

  // 检查其他可能的 IP 头
  const otherHeaders = ['x-real-ip', 'x-client-ip', 'cf-connecting-ip'];
  for (const header of otherHeaders) {
    const value = req.headers.get(header);
    if (value) {
      return value.trim();
    }
  }

  // 在 Next.js 的 serverless 环境中，通常无法获取到 connection.remoteAddress
  // 所以主要依赖 headers
  return undefined;
}