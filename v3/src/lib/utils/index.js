
const fs = require('node:fs');
const axios = require('axios');
const cheerio = require('cheerio');
import { getInboxFromAccount } from '../../lib/mysql/message'

export async function saveHTML(actorName,content,title,mid,textContent,avatar,account,manager,avatar1)
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
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
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
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
		  <div class="container-fluid">
		     <a href="/" class="navbar-brand"><img src="/logo.svg" alt="daism Logo" width="32" height="32"></a>
		    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
		      <span class="navbar-toggler-icon"></span>
		    </button>
		    <div class="collapse navbar-collapse" id="navbarSupportedContent">
		      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
		        <li class="nav-item"><a class="nav-link" href="/">Home</a></li>
		        <li class="nav-item"><a class="nav-link" href="/deval">DeVal</a></li>
				<li class="nav-item"><a class="nav-link" href="/smartcommons">Smart Commons</a></li>
				<li class="nav-item"><a class="nav-link" href="/honortokens">Honor Tokens</a></li>
				<li class="nav-item"><a class="nav-link" href="/workroom">My Workroom</a></li>
		        <li class="nav-item dropdown">
		          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">Social</a>
		          <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
		            <li><a class="dropdown-item" href="/communities/enki">My Community</a></li>
		            <li><a class="dropdown-item" href="/communities/SC">Public Communities</a></li>
		            <li><a class="dropdown-item" href="/communities/enkier">Personal Socia</a></li>
		          </ul>
		        </li>
				<li class="nav-item dropdown">
				  <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">College</a>
				  <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
				    <li><a class="dropdown-item" href="https://learn.daism.io/">Overview</a></li>
				    <li><a class="dropdown-item" href="https://learn.daism.io/docs.html">Documentation</a></li>
				  </ul>
				</li>
		      </ul>
		    </div>
		  </div>
		</nav>

    <div class=" mt-2 mb-3 card">
      <div class="card-header">
        <div class="d-inline-flex align-items-center">
        <a href="/smartcommons/actor/${account}" class="daism-a"><img src="${avatar1}" alt="" width="48" height="48" style="border-radius:10px"></a>
        <div style="padding-left:2px;width:100%">
          <div>${account}</div> 
          <div>${manager}</div>
        </div>
      </div>
      </div>
      <div class="card-body">
        <div class="daismCard">
        ${content}
        </div>
      </div>
    </div>
  </div>
	</body>
</html>`
  fs.writeFile(filePath, html, 'utf8', (err) => {
    if (err) {
      console.error(`${actorName}写入失败:`, err);
    } else {
      console.info(`${actorName}文件写入成功`);
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
    

    