module.exports = (client, Module_Embed, getServerEnabler, getServerAntilink, FunctionsPack) => {
    const { Fantilink } = require("./functions.js");
    client.on('messageUpdate', async (oldMessage, newMessage) => {
        if (newMessage.author.bot || !newMessage.guild) return;
        const Enabler = getServerEnabler(FunctionsPack, newMessage.guild).enabler;
        const antilink = getServerAntilink(FunctionsPack, newMessage.guild);
        Fantilink(Module_Embed, Enabler, antilink, newMessage)
    });
};
