const { SlashCommandBuilder } = require("discord.js");

    const slashAntilink = new SlashCommandBuilder()
        .setName('salut')
        .setDescription('Envoie un message à quelqu\'un')
        .addUserOption((option) =>
        option.setName('utilisateur').setDescription('La personne à saluer').setRequired(true)
        )
        .addStringOption((option) =>
        option.setName('message').setDescription('Le message à envoyer').setRequired(true)
        );

module.exports = { slashAntilink };