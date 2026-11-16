module.exports = (client, Module_Embed, Events) => {
    const { QIadmin } = require("./functions.js");    

    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isChatInputCommand()) return;
        if (QIadmin({ interaction, Module_Embed })) return;

        if (interaction.commandName === 'create') {
            const channel = interaction.options.getChannel('salon');
            const title = interaction.options.getString('titre');
            const content = interaction.options.getString('contenu');
            
            await interaction.reply(`test create ${channel}, ${title}, ${content}`);
        }

        if (interaction.commandName === 'antilink') {
            const domaine = interaction.options.getString('domaine');
            const bool = interaction.options.getBoolean('autorisation');
        
            await interaction.reply(`test antilink ${domaine}, ${bool}`);
        }

        if (interaction.commandName === 'antispam') {
            const msg = interaction.options.getInteger('nombre_message');
            const ms = interaction.options.getInteger('intervalle');
            
            await interaction.reply(`test antispam ${msg}, ${ms}`);
        }

    });
};