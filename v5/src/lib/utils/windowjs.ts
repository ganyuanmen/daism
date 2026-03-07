// import crypto from 'crypto';

// interface Env {
//   KEY: string;
//   IV: string;
// }

interface TFunction {
  (key: string): string;
}

// export function encrypt(text: string, env: Env): string {
//   const cipher = crypto.createCipheriv('aes-256-cbc', env.KEY, Buffer.from(env.IV, 'hex'));
//   let encrypted = cipher.update(text, 'utf8', 'hex');
//   encrypted += cipher.final('hex');
//   return encrypted;
// }

export function daism_getTime(seconds: number, t: TFunction): string {
  const days = Math.floor(seconds / (60 * 60 * 24));
  seconds %= (60 * 60 * 24);
  const hours = Math.floor(seconds / (60 * 60));
  seconds %= (60 * 60);
  const minutes = Math.floor(seconds / 60);
  
  let result = "";
  
  if (days > 0) {
    result += `${days}${t('days')} `;
  }
  
  if (hours > 0) {
    result += `${hours}${t('hours')} `;
  }
  
  if (minutes > 0) {
    result += `${minutes}${t('minutes')} `;
  }
  
  return result.trim();
}

  export function wrapLinksWithATag(html:string) {
    // 你的正则表达式
    const regex = /(?<!<(?:img|a|image|use|feimage|svg)[^>]*(?:src|href|xlink:href|xmlns)=["'])(?<!url\(["']?)(https?:\/\/[^\s"'<>)]+)(?!["']?\))/gi;
    
    // 替换匹配到的链接，添加a标签
    const processedHtml = html.replace(regex, (match) => {
        // 为链接添加a标签，可自定义target和rel属性提升安全性
        return `<a href="${match}" target="_blank" rel="noopener noreferrer">${match}</a>`;
    });
    
    return processedHtml;
}
