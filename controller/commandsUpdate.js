module.exports = (client, Module_Embed, Enabler, antilink) => {
    const { Fantilink } = require("./functions.js");
    client.on('messageUpdate', async (oldMessage, newMessage) => {
        if (newMessage.author.bot) return;
        Fantilink(Module_Embed, Enabler, antilink, newMessage)
    });
};