const { Configuration, OpenAIApi } = require("openai");
const { Client } = require('whatsapp-web.js');

const configuration = new Configuration({
  apiKey: "API_KEY", //Coloque a chave da API da OPENAI
});

const openai = new OpenAIApi(configuration);

const qrcode = require('qrcode-terminal');

const client = new Client();


/*
Funcao que utiliza a api da openai para retornar uma resposta do chatgpt, e recebe como parametro a mensagem do whatsapp
*/
async function resposta(mensagem) { 
    let response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: `Responda a seguinte mensagem: ${mensagem}` }],
      max_tokens: 2200,
      temperature: 0
    })
    return response
}

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('O cliente esta pronto!');
    client.on('message', async function (mensagem) {
      resposta(mensagem.body)
      .then(respostaDaAI => {
        client.sendMessage(mensagem.from, respostaDaAI.data.choices[0].message.content)
      })
      .catch(error => {
        console.error(error);
      });
  
        
    });
})

client.initialize();

