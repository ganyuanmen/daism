
import fs from 'fs';

const axios = require('axios');
const cheerio = require('cheerio');
import { getInboxFromAccount } from '../../lib/mysql/message'

export function saveImage(files,fileType)
{
 
  if(files && files.image && files.image[0] && fileType) 
  {
    
    const filePath = `./uploads/${files.image[0].newFilename}.${fileType}`  // 指定文件保存路径
    fs.copyFile(files.image[0].filepath, filePath, (error) => {console.error(error)})
    fs.unlink(files.image[0].filepath, (err) => {if (err) console.error('delete file error:', err)})
    return `${files.image[0].newFilename}.${fileType}`
  } else return ''
}


export function delUploadImge(files)
{
  
  if(files && files.image && files.image[0])
  {
    fs.unlink(files.image[0].filepath, (err) => {if (err) console.error('delete file error:', err)})
  }
}

export function delOldImage(path)
{
  fs.unlink(`./uploads/${path}`, (err) => {if (err) console.error('delete file error:', err)})
}


export function readImg(path,res){
        fs.readFile(`./uploads/${path}`,'binary',function(err,file){
            if(err){
                console.error(err);
                return;
            }else{
                res.write(file,'binary');
                res.end();
            }
        });
    }

//非a标签中的第一个URI
export  function findFirstURI(html) {
      // 正则表达式匹配非 a 标签中的 URI
      const uriRegex = /(?!<a[^>]*href=["'])(https?:\/\/|www\.)(?:[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)?)/g;
    
      // 查找第一个匹配的 URI
      const match = uriRegex.exec(html);
    
      if (match) {
        return match[0];
      } else {
        return null;
      }
    }


    
  export  async function getTootContent(tootUrl,domain) {
      try {
         const myURL = new URL(tootUrl);
         let targetDomain = myURL.hostname;
        const response = await axios.get(tootUrl);
        const html = response.data;
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
          let actor=await getInboxFromAccount(name); 
          image=actor.avatar;

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
        const uc=`<a href="${tootUrl}" target="_blank" style="align-items:center;border:1px solid #ccc;font-size:1rem; color: currentColor;border-radius:8px;display:flex;text-decoration:none" >
        <div style="aspect-ratio:1;flex:0 0 auto;position:relative;width:120px;border-radius:8px 0 0 8px;" >
            <img src='${image?image:localimg}' alt="" style="background-position:50%;background-size:cover;display:block;height:100%;margin:0;object-fit:cover;width:100%;border-radius:8px 0 0 8px;">
        </div>
        <div  >
            <div style="padding:2px 8px 2px 8px" >${targetDomain}</div>
            <div style="padding:2px 8px 2px 8px;display:-webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 1;overflow: hidden;" >${user?user:title}</div>
            <div style="padding:2px 8px 2px 8px;display:-webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden;" > ${content?content:(desc?desc:targetDomain)}</div>	
        </div>
        </a>` ;

      

        return uc;
      } catch (error) {
        console.error('get content from url error:', error.message);
        return null;
      }
    }
    