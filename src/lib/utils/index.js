
import fs from 'fs';

export function saveImage(files,fileType)
{
 
  if(files && files.image && files.image[0] && fileType) //fileType='' 表示删除图片
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
