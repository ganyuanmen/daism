import { readImg } from "../../lib/utils";
import fs from 'fs'
export default async function handler(req, res) {

   const {path}= req.query

   if(path.endsWith('.svg')) {
    const base64str = fs.readFileSync(`./uploads/${path}`).toString('base64');
    res.writeHead(200,{'Content-Type':'html/text;charset=utf-8'});
    res.write(`data:image/svg+xml;base64,${base64str}`,'utf8');
    res.end();
   } 
   else 
   {
    res.writeHead(200,{'Content-Type':'image/jpeg'});
    readImg(path,res); 
   }

    
  }
  