import crypto from 'crypto';

// 这里的 KEY 应该是 32 字节（256位），请保存在环境变量中
const SECRET_KEY = crypto.scryptSync('1d34a67867I90123m56789p1X', 'salt', 32); 
const ALGORITHM = 'aes-256-gcm';

/**
 * 加密对象
 */
export function encrypt(obj:any) {
    const iv = crypto.randomBytes(12); // GCM 推荐 12 字节 IV
    const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
    
    const jsonString = JSON.stringify(obj);
    let encrypted = cipher.update(jsonString, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    const tag = cipher.getAuthTag().toString('base64');
    
    // 返回格式：iv.密文.tag (全部用 base64 拼接)
    return `${iv.toString('base64')}.${encrypted}.${tag}`;
}

/**
 * 解密对象
 */
export function decrypt(encryptedData:string) {
    const [ivStr, encrypted, tagStr] = encryptedData.split('.');
    
    const iv = Buffer.from(ivStr, 'base64');
    const tag = Buffer.from(tagStr, 'base64');
    const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
    
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted);
}

// // --- 测试使用 ---
// const myObject = { id: 123, role: 'admin', secret: 'hello-world' };

// // 1. 后端加密
// const transportData = encrypt(myObject);
// console.log('传给前端的字符串:', transportData);

// // 2. 模拟从前端传回，后端解密
// const originalObject = decrypt(transportData);
// console.log('解密后的对象:', originalObject);