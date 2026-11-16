module.exports = (client, Module_Embed, Events) => {
    const { QIadmin, slashCreateCommand } = require("./functions.js");    

    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isChatInputCommand()) return;
        if (QIadmin({ interaction, Module_Embed })) return;

        if (interaction.commandName === 'create') {
            const pack = [
                channel = interaction.options.getChannel('salon', true),
                title = interaction.options.getString('titre', true),
                content = interaction.options.getString('contenu', true)
            ];

            if (await slashCreateCommand(Module_Embed, interaction, pack)) {
                await interaction.reply({
                    embeds: [
                        Module_Embed.newE({
                            success: true,
                            title: "Succès de l'opération",
                            desc: 'Message envoyé avec succès !'
                        })
                    ]
                });
            } else {
                await interaction.reply({
                    embeds: [
                        Module_Embed.newE({
                            success: false,
                            title: "Erreur",
                            desc: 'Un problème est survenu lors de l\'envoi du message personnalisé.'
                        })
                    ]
                });
            }
        }

        if (interaction.commandName === 'antilink') {
            const domaine = interaction.options.getString('domaine', true);
            const bool = interaction.options.getBoolean('autorisation', true);
        
            await interaction.reply(`test antilink ${domaine}, ${bool}`);
        }

        if (interaction.commandName === 'antispam') {
            const msg = interaction.options.getInteger('nombre_message', true);
            const ms = interaction.options.getInteger('intervalle', true);
            
            await interaction.reply(`test antispam ${msg}, ${ms}`);
        }

    });
};