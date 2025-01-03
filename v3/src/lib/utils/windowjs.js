
const crypto = require('crypto');

export function encrypt(text,env){
    const cipher = crypto.createCipheriv('aes-256-cbc', env.KEY, Buffer.from(env.IV, 'hex'));
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }
  
  
       
  export  function daism_getTime(seconds,t){
    const days = Math.floor(seconds / (60 * 60 * 24));
    seconds %= (60 * 60 * 24);
    const hours = Math.floor(seconds / (60 * 60));
    seconds %= (60 * 60);
    const minutes = Math.floor(seconds / 60);
    // seconds %= 60;
      let result = "";
       if (days > 0) {
         result += `${days}${t('days')} `;
       }
       if(hours > 0){
          result += `${hours}${t('hours')} `;
       }
       if(minutes > 0){
          result += `${minutes}${t('minutes')} `;
       }
       return result.trim();
  }

