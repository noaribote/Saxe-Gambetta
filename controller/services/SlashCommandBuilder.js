const { SlashCommandBuilder } = require("discord.js");

    const slashCreate = new SlashCommandBuilder()
        .setName('create')
        .setDescription('Créer un message Embed personnalisé.')

        .addChannelOption((o) => o.setName('salon').setDescription('Salon où l\'Embed sera envoyé.').setRequired(true))
        .addStringOption((o) => o.setName('titre').setDescription('Le titre de l\'Embed.').setRequired(true))
        .addStringOption((o) => o.setName('contenu').setDescription('Le contenu de l\'Embed.').setRequired(true))
    ;

    const slashAntilink = new SlashCommandBuilder()
        .setName('antilink')
        .setDescription('Envoie un message à quelqu\'un')

        .addStringOption((o) => o.setName('domaine').setDescription('Le domaine à paramétrer dans l\'antilink.').setRequired(true))
        .addBooleanOption((o) => o.setName('autorisation').setDescription('"true" si le domaine est autorisé sur le serveur, "false" si non.').setRequired(true))
    ;

    const slashAntispam = new SlashCommandBuilder()
        .setName('antispam')
        .setDescription('Envoie un message à quelqu\'un')

        .addIntegerOption((o) => o.setName('nombre_message').setDescription('Le nombre de messages comptés par Saxe Gambetta avant le banissement de l\'utilisateur.').setRequired(true))
        .addIntegerOption((o) => o.setName('intervalle').setDescription('L\'intervalle en millisecondes dans lequel le nombre de messages est compté.').setRequired(true))
    ;

module.exports = { slashCreate, slashAntilink, slashAntispam };