
/**
 * 转换成html展示
 */
export  function convertHTML(obj) {  
  //推送过来的不处理
  if(obj.message_id.startsWith('http')) return obj.content;

  const strs=obj.actor_account.split('@');

  const regex = /@[\w\u4e00-\u9fa5-]+/g; // 正则表达式匹配以 @ 开头，后跟字母、汉字、数字、短横线或下划线的关键字
  const replacementTemplate = `<a href='https://${strs[1]}/smartcommons/actor/{keyword}'>{keyword}</a>`;
  let text=obj.content.replace(regex, match => {
      // 使用替换模板替换匹配的关键字
      return replacementTemplate.replaceAll("{keyword}", match);
  });
  text=text.replaceAll('/actor/@','/actor/')
  return `<p>${text.replaceAll("\r\n",'</p><p>')}</p>`
  
}

