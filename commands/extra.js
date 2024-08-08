/*
 *
 ██╗███████╗██╗   ██╗██╗  ██╗██╗   ██╗    ███╗   ███╗██████╗ 
██║╚══███╔╝██║   ██║██║ ██╔╝██║   ██║    ████╗ ████║██╔══██╗
██║  ███╔╝ ██║   ██║█████╔╝ ██║   ██║    ██╔████╔██║██║  ██║
██║ ███╔╝  ██║   ██║██╔═██╗ ██║   ██║    ██║╚██╔╝██║██║  ██║
██║███████╗╚██████╔╝██║  ██╗╚██████╔╝    ██║ ╚═╝ ██║██████╔╝
╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝     ╚═╝     ╚═╝╚═════╝ 
                                                            
 Copyright (C) 2022.
 Licensed under the  GPL-3.0 License;
 You may not use this file except in compliance with the License.
 It is supplied in the hope that it may be useful.
 * @project_name : Secktor-Md
 * @author : SamPandey001 <https://github.com/SamPandey001>
 * @description : Secktor,A Multi-functional whatsapp bot.
 * @version 0.0.6
 *
 */

const {cmd} = require('../lib')
const PastebinAPI = require("pastebin-js");
pastebin = new PastebinAPI("EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL");
 
const axios = require('axios');
cmd({
        pattern: "pastebin",
        desc: "To check ping",
        category: "extra",
        filename: __filename,
    },
    async(Void, citel) => {
        if(!citel.quoted) return citel.reply('Please quote any text to get link.')
        let data = await pastebin.createPaste(citel.quoted.text, "Cetino-Pastebin")
        citel.reply('_Here is your link._\n'+data)
    }
);



 


cmd({
    pattern: "wabetainfo",
 category: "tech",
    desc: "Get details about the latest WhatsApp beta news.",
},
async (Void, citel) => {
    try {
        let apiUrl = "https://api.maher-zubair.tech/details/wabetainfo";
        let response = await axios.get(apiUrl);
        let data = response.data;

        if (data && data.result) {
            let { title, date, image, subtitle, link, desc, QandA } = data.result;

            let thumbnail = await axios.get(image, { responseType: 'arraybuffer' });
            let thumbnailBuffer = Buffer.from(thumbnail.data);

            let message = `*${subtitle}:*\n\n*Title:* ${title}\n*Date:* ${date}\n\n*Description:* ${desc}\n\n*Q&A:*\n`;
            for (let qa of QandA) {
                message += `\n*Q:* ${qa.question}\n*A:* ${qa.answer}\n`;
            }

            const contextInfo = {
                externalAdReply: {
                    title: title,
                    body: subtitle,
                    renderLargerThumbnail: true,
                    thumbnail: thumbnailBuffer,
                    thumbnailUrl: image,
                    mediaType: 1,
                    mediaUrl: link,
                    sourceUrl: link,
                },
            };

            await Void.sendMessage(citel.chat, { text: message, contextInfo: contextInfo });
        } else {
            citel.reply("*No details found.*");
        }
    } catch (error) {
        console.error(error);
        citel.reply(`*An error occurred while processing your request:* ${error.message || error}`);
    }
});

//---------------------------------------------------------------------------

