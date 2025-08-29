import withSession from "../../../lib/session";
import formidable from 'formidable';
import {getClientIp} from '../../../lib/utils'

import { createWriteStream,createReadStream } from 'node:fs';
import { mkdir, access } from 'node:fs/promises';
import path from 'node:path';

export const config = {
    api: {
      bodyParser: false,
      sizeLimit: '10mb',   // 👈 必须加这个
    },
  };



const ensureUploadDirExists = async (uploadDir) => {
    try {
        await access(uploadDir);
    } catch (error) {
        if (error.code === 'ENOENT') {
            await mkdir(uploadDir, { recursive: true });
        } else {
            throw error;
        }
    }
};



export default withSession(async (req, res) => {
    if (req.method.toUpperCase() !== 'POST') return res.status(405).json({ errMsg: 'Method Not Allowed' })
    const sessionUser = req.session.get('user');
    const currentIp = getClientIp(req);
    if (!sessionUser || sessionUser.ip !== currentIp || sessionUser.userAgent !== req.headers['user-agent'])
        return res.status(406).json({errMsg:'No wallet signature login'})
    // if (!sessionUser) return res.status(406).json({ errMsg: 'No wallet signature login' })
    const _path=new Date().toLocaleDateString().replaceAll('/','')
    const uploadDir = path.join(process.cwd(), 'uploads',_path);
    await ensureUploadDirExists(uploadDir)

    const form = formidable({
        multiples: false,
        maxFileSize: 1 * 1024 * 1024, // 限制为 120MB
    });
    try {
       await new Promise((resolve, reject)=>{
           form.parse(req,async (err, fields, files) =>{
               if (err) {
                   reject(err)
                   return
               }
               const file =files['files[0]'][0]
               if(!file) {
                   reject('No file uploaded.')
                   return
               }
                const originalFilename = file.originalFilename;
                const fileExtension = path.extname(originalFilename).toLowerCase();
                const filename = `${Date.now()}${fileExtension}`;
                const filePath = path.join(uploadDir, filename);
                  const fileWriteStream = createWriteStream(filePath, {
                      flags: 'w',
                      encoding: 'binary',
                      autoClose: true
                  })
                fileWriteStream.on('error', err => {
                    reject(err)
                })
                const fileReadStream= createReadStream(file.filepath)
                fileReadStream.on('error', err =>{
                    reject(err)
                })
                fileReadStream.pipe(fileWriteStream)
                    fileWriteStream.on('finish', () =>{
                        resolve({
                            imageUrl: `https://${process.env.LOCAL_DOMAIN}/uploads/${_path}/${filename}`,
                            success: true
                        })
                    })


           });
       }).then(data =>{
            res.status(200).json(data)
       })
    } catch (error){
      console.error('file upload err', error)
         res.status(error.httpCode||500).json({ message: error.message || 'File upload failed' })
    }

});

