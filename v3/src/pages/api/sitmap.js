
const fs = require('node:fs');
import { getData } from "../../lib/mysql/common";


export default async function handler(req, res) {

    const data=await getData("SELECT message_id FROM a_message WHERE send_type=0 AND NOT(title IS NULL)",[])

    const datasc=await getData("SELECT message_id FROM a_messagesc WHERE NOT(title IS NULL)",[])

    const d=new Date().toISOString()

    let txt=`<?xml version="1.0" encoding="UTF-8"?>
        <urlset
        xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
        <url>
        <loc>https://daism.io/</loc>
        <lastmod>${d}</lastmod>
        </url>
        <url>
        <loc>https://daism.io/deval</loc>
        <lastmod>${d}</lastmod>
        </url>
        <url>
        <loc>https://daism.io/smartcommons</loc>
        <lastmod>${d}</lastmod>
        </url>
        <url>
        <loc>https://daism.io/honortokens</loc>
        <lastmod>${d}</lastmod>
        </url>
        <url>
        <loc>https://daism.io/workroom</loc>
        <lastmod>${d}</lastmod>
        </url>
        <url>
        <loc>https://daism.io/zh</loc>
        <lastmod>${d}</lastmod>
        </url>
        <url>
        <loc>https://daism.io/zh/deval</loc>
        <lastmod>${d}</lastmod>
        </url>
        <url>
        <loc>https://daism.io/zh/smartcommons</loc>
        <lastmod>${d}</lastmod>
        </url>
        <url>
        <loc>https://daism.io/zh/honortokens</loc>
        <lastmod>${d}</lastmod>
        </url>
        <url>
        <loc>https://daism.io/zh/workroom</loc>
        <lastmod>${d}</lastmod>
        </url>
        <url>
        <loc>https://daism.io/communities/enki</loc>
        <lastmod>${d}</lastmod>
        </url>
        <url>
        <loc>https://daism.io/communities/enkier</loc>
        <lastmod>${d}</lastmod>
        </url>
        <url>
        <loc>https://daism.io/communities/SC</loc>
        <lastmod>${d}</lastmod>
        </url>
        `
    let content='';
    data.forEach(element => {
        if(!element.message_id.startsWith('http'))
        content=`${content}<url><loc>https://daism.io/communities/enkier/${element.message_id}</loc><lastmod>${d}</lastmod></url>`
    });
    datasc.forEach(element => {
        if(!element.message_id.startsWith('http'))
        content=`${content}<url><loc>https://daism.io/communities/enki/${element.message_id}</loc><lastmod>${d}</lastmod></url>`
    });

    const filePath = `./uploads/sitemap.xml`  // 指定文件保存路径
    fs.writeFile(filePath, `${txt}${content}</urlset>`, 'utf8', (err) => {
        if (err) {
          console.error(`${actorName}写入失败:`, err);
        } else {
          console.log(`${actorName}文件写入成功`);
        }
      });
  
   
      res.json({msg:'ok'});
    
  }
  