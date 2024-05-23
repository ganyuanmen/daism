// pages/api/upload.js
import nextConnect from 'next-connect';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const apiRoute = nextConnect({
  onError(error, req, res) {
    console.error(error);
    res.status(500).json({ error: `Server error: ${error.message}` });
  },
});

apiRoute.use(upload.single('file'));

apiRoute.post((req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  // 获取服务器上的目录路径
  const serverDirectory = path.join(process.cwd(), 'uploads');

  // 确保目录存在，如果不存在则创建
  if (!fs.existsSync(serverDirectory)) {
    fs.mkdirSync(serverDirectory);
  }

  // 将文件保存到服务器目录
  const filePath = path.join(serverDirectory, file.originalname);
  fs.writeFileSync(filePath, file.buffer);

  // 返回上传成功的信息
  const result = {
    originalname: file.originalname,
    size: file.size,
    mimetype: file.mimetype,
    path: filePath,
  };

  res.status(200).json({ file: result });
});

export default apiRoute;
