
import { getData,execute } from "../../lib/mysql/common";
const fs = require('node:fs');
const path = require('node:path');
const { parse } = require('node-html-parser');


export default async function handler(req, res) {
  
    
    const data=await getData("select id,content from a_message",[]);
  

    data.forEach(async element => {

        try {

            const root = parse(element.content);
        
            const imgElements = root.querySelectorAll('img[src^="data:image/"]');
            if(imgElements)   
            for (const img of imgElements) {
              const base64Data = img.getAttribute('src').split(',')[1];
              const contentType = img.getAttribute('src').split(';')[0].split(':')[1];
                
              // Crucial:  Validate that you have a Base64 string.  An empty or incorrect value will cause errors.
              if (!base64Data) {
                console.error(`Invalid Base64 data for image: ${img.getAttribute('src')}`);
                continue;  // Skip to the next image if invalid
              }
        
        
              const decoded = Buffer.from(base64Data, 'base64');
               let rx= contentType.split('/')[1];
               if(rx.startsWith('svg')) rx='svg'
              const fileName = `image_${Date.now()}.${rx}`;
            //   const filePath = path.join("./uploads/q1", fileName);
        
              // Write the decoded data to a file.  Critical error handling.
              try {
                await fs.promises.writeFile(`./uploads/q1/${fileName}`, decoded);
                console.log(`Image saved to: ${fileName}`);
                img.setAttribute('src', `https://daism.io/uploads/q1/${fileName}`); // Use file:// for correct handling
              } catch (err) {
                console.error(`Error saving image to ${fileName}:`, err);
              }
        
            
        
            // Write the modified HTML back to file.  Critical error handling.
                try {
                    const newHTML = root.toString();
                    await execute("update a_message set content=? where id=?",[newHTML,element.id])
                    
                } catch (err) {
                    console.error('Error writing modified HTML back:', err);
                }
            }
          } catch (err) {
            console.error('Error processing HTML file:', err);
          }
        
        
    });

    res.status(200).json({ping:'ok'});  
}

 