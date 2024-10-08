/**
 Copyright (C) 2022.
 Licensed under the  GPL-3.0 License;
 You may not use this file except in compliance with the License.
 It is supplied in the hope that it may be useful.
 * @project_name : Secktor-Md
 * @author : SamPandey001 <https://github.com/SamPandey001>
 * @description : Secktor,A Multi-functional whatsapp bot.
 * @version 0.0.6
 **/

const { tlang, botpic, cmd, prefix, runtime, Config , sleep } = require('../lib')
const axios = require('axios')
const speed = require('performance-now')
const fetch = require('node-fetch');
//---------------------------------------------------------------------------
cmd({
    pattern: "chat",
    alias :['gpt'],
    desc: "chat with an AI(GPT)",
    category: "AI",
    use: '<Hii,Secktor>',
    filename: __filename,
},
async(Void, citel,text) => {
    let zx = text.length;
    if (zx < 8) {
        let {data} = await axios.get(`http://api.brainshop.ai/get?bid=167991&key=aozpOoNOy3dfLgmB&uid=[${citel.sender.split("@")[0]}]&msg=[${text}]`);
        return citel.reply(data.cnt);  
    }
    if (!text) return citel.reply(`Hey there! ${citel.pushName}. How are you doing these days?`);
    // const { Configuration, OpenAIApi } = require("openai");
    // const configuration = new Configuration({
    //     apiKey: Config.OPENAI_API_KEY || "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",
    // });
    // const openai = new OpenAIApi(configuration);
    // const completion = await openai.createCompletion({
    //     model: "text-davinci-002",
    //     prompt: text,
    //     temperature: 0.5,
    //     max_tokens: 80,
    //     top_p: 1.0,
    //     frequency_penalty: 0.5,
    //     presence_penalty: 0.0,
    //     stop: ['"""'],
    // });
    // citel.reply(completion.data.choices[0].text);
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Config.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo", 
      messages: [{ role: "system", content: "You" }, { role: "user", content: text }],
    }),
  });

  const data = await response.json();
  console.log("GPT REPONCE : ",data); 
  if (!data.choices || data.choices.length === 0) {citel.reply("*Invalid ChatGPT API Key, Please Put New Key*"); }
  return await  citel.reply(data.choices[0].message.content)
	
}
)

cmd({
    pattern: "dalle",
    alias : ['dall','dall-e'],
    desc: "Create Image by AI",
    category: "AI",
    use: '<an astronaut in mud.>',
    filename: __filename,
},
async(Void, citel,text,{isCreator}) => 
{
//if (!isCreator) return citel.reply(tlang().owner)
if (Config.OPENAI_API_KEY=='') return citel.reply('You Dont Have OPENAI_API_KEY \nPlease Create OPEN API KEY from Given Link \nhttps://platform.openai.com/account/api-keys');
if (!text) return citel.reply(`*Give Me A Query To Get Dall-E Reponce ?*`); 
const imageSize = '256x256'
const apiUrl = 'https://api.openai.com/v1/images/generations';
const response = await fetch(apiUrl, {
method: 'POST',
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${Config.OPENAI_API_KEY}`
},
body: JSON.stringify({
  model: 'image-alpha-001',
  prompt: text,
  size: imageSize ,
  response_format: 'url'
})
});

const data = await response.json();
let buttonMessage = {
    image:{url:data.data[0].url},
    caption : '*---Your DALL-E Result---*'

}

Void.sendMessage(citel.chat,{image:{url:data.data[0].url}})
}
)

//---------------------------------------------------------------------------
cmd({
        pattern: "repo",
        alias: ["git", "sc", "script"],
        desc: "Sends info about repo.",
        category: "general",
        filename: __filename,
    },
    async(Void, citel) => {
        let { data } = await axios.get('https://api.github.com/repos/DigitalCen/Centio-Bot')
        let cap = `Hey ${citel.pushName}\n
╭┈─────────────────────○
│*⭐ Total Stars:* ${data.stargazers_count} stars
│*🍴 Forks:* ${data.forks_count} forks
│*📡 Repo:* https://github.com/DigitalCen/Centio-Bot
Group: https://chat.whatsapp.com/Gm1ZM1vrQFI3UCOtgPtasH
│*🧑‍💻Deploy Centio-bot*:https://github.com/DigitalCen/Centio-Bot
╰────────────────────●`
        let buttonMessaged = {
            image: { url: await botpic() },
            caption: cap,
            footer: tlang().footer,
            headerType: 4,
            contextInfo: {
                externalAdReply: {
                    title: "Cetino-Repo",
                    body: "Easy to Use",
                    thumbnail: ,
                    mediaType: 4,
                    mediaUrl: '',
                    sourceUrl: ``,
                },
            },
        };
        return await Void.sendMessage(citel.chat, buttonMessaged, {
            quoted: citel,
        });

    }
)
//--------------------------------------------------------------------------
cmd({
  pattern: "photoleap",
  desc: "Fetch AI generated image",
  category: "AI",
  filename: __filename
},
async (Void, citel, match) => {
  try {
    let query = match.trim();
    if (!query) {
      return citel.reply('Please provide a query for the AI.');
    }

    let apiUrl = `https://api.maher-zubair.tech/ai/photoleap?q=${encodeURIComponent(query)}`;
    let response = await axios.get(apiUrl);
    let data = response.data;

    if (data && data.result) {
      let imageUrl = data.result;

      await Void.sendMessage(citel.chat, {
        image: { url: imageUrl },
        caption: `*Generated Image for:* ${query}`,
        contextInfo: {
          externalAdReply: {
            title: "AI Generated Image",
            body: "Powered by IZUKU-MD",
            renderLargerThumbnail: true,
            thumbnailUrl: "https://telegra.ph/file/4acb84ceefff1c9410aca.jpg",
            mediaType: 1,
            mediaUrl: imageUrl,
            sourceUrl: imageUrl
          }
        }
      });
    } else {
      await Void.sendMessage(citel.chat, { text: '*No result found.*', options: { isBold: true } });
    }
  } catch (error) {
    await Void.sendMessage(citel.chat, { text: `*An error occurred:* ${error.message || error}`, options: { isBold: true } });
  }
});

//------------------------------------
cmd({
        pattern: "status",
        alias: ["about"],
        desc: "To check bot status",
        category: "general",
        filename: __filename,
    },
    async(Void, citel) => {
        const uptime = process.uptime();
        timestampe = speed();
        latensie = speed() - timestampe;
        let ter = `
ㅤ ────────────────────────── .°୭̥ ❁ 	
╰─➤｡･:*˚:✧｡ *${tlang().title}* ｡･:*˚:✧｡
╰─➤*🌟Description:* A WhatsApp bot  with rich features, build in NodeJs to make your WhatsApp enjoyable.
╰─➤*⚡️Speed:* ${latensie.toFixed(4)} ms
╰─➤*⏱Uptime:* ${runtime(process.uptime())}
╰─➤*📡Version:* 0.0.8
╰─➤*👤Owner:*  ${Config.ownername}
╰─➤*Powered by ${tlang().title}*
°୭̥ ❁ ───────────────────────── .°୭̥ ❁ `;
        let buttonMessaged = {
            image: {
                url: await botpic(),
            },
            caption: ter,
            footer: tlang().footer,
            headerType: 4,
            contextInfo: {
                externalAdReply: {
                    title: tlang().title,
                    body: `Bot-Status`,
                    thumbnail: log0,
                    mediaType: 2,
                    mediaUrl: ``,
                    sourceUrl: ``,
                },
            },
        };
        return await Void.sendMessage(citel.chat, buttonMessaged, {
            quoted: citel,
        });

    }
)

//---------------------------------------------------------------------------
cmd({
    pattern: "theme",
    desc: "To find all themes",
    category: "general",
    filename: __filename,
},
async(Void, citel,text,{isCreator}) => {

if(!isCreator) return citel.reply(tlang().owner);
let str="*All available themes in IZUKU *"
str+=`1. IZUKU\n2. ADAM\n3. AYANOKOJI\n4. EDITH\n5. FRIDAY\n6. GENOS\n7. GIDEON\n8. GOKU\n9. LUFFY\n10. NARUTO\n11. NEZUKO\n12. PARKER\n13. GARENA\n14. SECKTOR\n15 Eren Jeager\n\n 16.CETINO these are the themes of IZUKU Userbot.\_Reply ${prefix}setvar THEME:CENTIO`
return citel.reply(str)
    
}
)
//----------------------------------------------------------------
cmd({
  pattern: "gpt4",
  desc: "Interact with CHATGPT4",
  category: "AI",
  filename: __filename,
},
async (Void, citel, match) => {
  try {
    let query = match.trim();
    if (!query) {
      return citel.reply('Please provide a query for the AI.');
    }

    let apiUrl = `https://api.maher-zubair.tech/ai/chatgpt4?q=${encodeURIComponent(query)}`;
    let response = await axios.get(apiUrl);
    let data = response.data;

    if (data && data.result) {
      let aiResponse = data.result;
      let imageUrl = "https://telegra.ph/file/500f5ad11c3c31060fd01.jpg";

      await Void.sendMessage(citel.chat, {
        text: aiResponse,
        contextInfo: {
          externalAdReply: {
            title: "AI Response",
            body: aiResponse,
            renderLargerThumbnail: true,
            thumbnail: await (await axios.get(imageUrl, { responseType: 'arraybuffer' })).data,
            mediaType: 1,
            sourceUrl: '',
          }
        }
      });
    } else {
      await Void.sendMessage(citel.chat, { text: '*No response from AI.*', options: { isBold: true } });
    }
  } catch (error) {
    await Void.sendMessage(citel.chat, { text: `*An error occurred:* ${error.message || error}`, options: { isBold: true } });
  }
});