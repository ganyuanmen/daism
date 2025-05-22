import withSession from "../../../lib/session";
import formidable from "formidable";
const fs = require('node:fs');
import path from 'node:path';

export const config = {
  api: {
    bodyParser: false, // 禁用默认 body 解析器
  },
};


export default withSession(async (req, res) => {
    if (req.method.toUpperCase() !== 'POST') return res.status(405).json({ errMsg: 'Method Not Allowed' })
    const sessionUser = req.session.get('user');
    if (!sessionUser) return res.status(406).json({ errMsg: 'No wallet signature login' })
    const _path=new Date().toLocaleDateString().replaceAll('/','')
    const uploadDir = path.join(process.cwd(), 'uploads',_path);

  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 100 * 1024 * 1024, // 限制为 100MB
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: "Upload failed" });
    }

    const file = files.video;
    const mimetype = file[0]?.mimetype || file.mimetype;
    if (!mimetype.startsWith("video/")) {
      return res.status(400).json({ message: "Only supports uploading video files" });
    }
    const videName=file[0]?.newFilename || file.newFilename;

    return res.status(200).json({ message: "Upload successful", path: `https://${process.env.LOCAL_DOMAIN}/uploads/${_path}/${videName}` });
  });
})
