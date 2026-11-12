module.exports = (client, Events) => {
    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        if (interaction.commandName === 'salut') {
            const utilisateur = interaction.options.getUser('utilisateur');
            const message = interaction.options.getString('message');

            await interaction.reply(`TEST: ${utilisateur}, ${interaction.user} te dit : **${message}**`);
        }
    });
};