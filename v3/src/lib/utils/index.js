
const fs = require('node:fs');
const axios = require('axios');
const cheerio = require('cheerio');
import { getInboxFromAccount } from '../../lib/mysql/message'



// async function downloadRenderedPage(url, savePath) {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto(url, { waitUntil: 'networkidle0' });

//   const html = await page.content();
//   fs.writeFileSync(savePath, html, 'utf-8');

//   await browser.close();
//   console.log(`✅ 渲染后的 HTML 已保存到: ${savePath}`);
// }

// const url = 'https://example.com';
// const savePath = path.resolve(__dirname, 'rendered.html');

// downloadRenderedPage(url, savePath);


export async function saveHTML(actorName,content,title,mid,textContent,avatar)
{
 
  const filePath = `./enki/${mid.toLowerCase()}.html`  // 指定文件保存路径
  const MAX_DESCRIPTION_LENGTH = 160; // 按字节计算

  const truncatedDescription = textContent.slice(0, MAX_DESCRIPTION_LENGTH).replaceAll('<p>','').replaceAll('</p>','').replace(/\s+\S*$/, '') + '...';
  const url=`https://${process.env.LOCAL_DOMAIN}/enki/${mid.toLowerCase()}.html`
  // const browser = await puppeteer.launch();
  // const page = await browser.newPage();
  // await page.goto(url, { waitUntil: 'networkidle0' });

  // const html = await page.content();


  const html=`<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>${title}</title>
    <link rel="canonical" href="${url}" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous" />
    <meta content="${avatar}" property="og:image" />
    <meta name="description" content="${truncatedDescription}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${truncatedDescription}" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="/staticHTML.css" />
    <script type="application/ld+json">
      {
        "@context": "${url}",
        "@type": "Article",
        "headline": "${title}",
        "datePublished": "${new Date().toISOString()}",
        "author": { "@type": "Person", "name": "${actorName}" }
      }
    </script>
	</head>
	<body>
  <div class="container mt-3 mb-3">
  ${content}
  </div>
	</body>
</html>`
  fs.writeFile(filePath, html, 'utf8', (err) => {
    if (err) {
      console.error(`${actorName}写入失败:`, err);
    } else {
      console.log(`${actorName}文件写入成功`);
    }
  });


}

export function saveImage(files,fileType,actorName)
{
 
  if(files && files.image && files.image[0] && fileType) 
  {
    const directoryPath=actorName?`./uploads/${actorName}`:'./uploads';
    try {
      fs.accessSync(directoryPath, fs.constants.F_OK);
    } catch (err) {
      if (err.code === 'ENOENT') {
        try {
          fs.mkdirSync(directoryPath, { recursive: true });
        } catch (error123) {
          console.error("mkdir error>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",error123)
        }
      } else {
        console.error("mkdir error99999999999999999999999999999999999", err); 
      }
    }
    const filePath = `${directoryPath}/${files.image[0].newFilename}.${fileType}`  // 指定文件保存路径
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

//非a标签 img 标签中的第一个URI
export  function findFirstURI(code) {
  const regex = /(?<!<img[^>]*src=["'])(?<!<a[^>]*href=["'])(https?:\/\/[^\s"'<>)]+)\s*/i;
  const match = code.match(regex);
  return match ? match[0] : null;
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
      } catch (error) {
        console.error('get content from url error:', error.message);
        return null;
      }
    }
    

    