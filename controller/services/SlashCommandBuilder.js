const { SlashCommandBuilder } = require("discord.js");

    const slashCreate = new SlashCommandBuilder()
        .setName('create')
        .setDescription('Permet de créer un message embarqué personnalisé.')

        .addChannelOption((o) => o.setName('salon').setDescription('Salon où l\'Embed sera envoyé.').setRequired(true))
        .addStringOption((o) => o.setName('titre').setDescription('Le titre de l\'Embed.').setRequired(true))
        .addStringOption((o) => o.setName('contenu').setDescription('Le contenu de l\'Embed.').setRequired(true))
    ;

    const slashAntilink = new SlashCommandBuilder()
        .setName('antilink')
        .setDescription('Permet de paramétrer l\'anti-link du serveur.')

        .addStringOption((o) => o.setName('domaine').setDescription('Le domaine à paramétrer dans l\'antilink.').setRequired(true))
        .addBooleanOption((o) => o.setName('autorisation').setDescription('"true" si le domaine est autorisé sur le serveur, "false" si non.').setRequired(true))
    ;

    const slashAntispam = new SlashCommandBuilder()
        .setName('antispam')
        .setDescription('Permet de paramétrer l\'anti-spam du serveur.')

        .addIntegerOption((o) => o.setName('nombre_message').setDescription('Messages avant une mise en sourdine de 5 minutes (3 a 100).').setMinValue(3).setMaxValue(100).setRequired(true))
        .addIntegerOption((o) => o.setName('intervalle').setDescription('Fenetre de detection en millisecondes (1000 a 60000).').setMinValue(1000).setMaxValue(60000).setRequired(true))
    ;

module.exports = { slashCreate, slashAntilink, slashAntispam };