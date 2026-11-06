module.exports = (client, prefix, Module_Embed) => {
    client.on('messageCreate', (message) => {


        if (message.content === prefix + `help` || message.content === `<@${client.user.id}>`) {
            message.channel.send({
                embeds: [
                    Module_Embed.newE({
                        title: "Commandes & informations",
                        desc: "Bot open-source développé par RIBOTE--MORAL Noa.",
                        image: 'https://cdn.discordapp.com/banners/1568150259761291306/3b4f1239ec9b931e4252e93375291208?size=1024',
                        fields: [
                            { name: '\u200B', value: '\u200B' },
                            { name: 'Commande ``?help``', value: '> Permet de visualiser toutes les commandes et informations concernant le bot Saxe Gambetta.', inline: false },
                            { name: 'Commande ``?clear (0-100)``', value: '> Permet la suppression d\'un nombre défini de messages.', inline: false },
                            { name: 'Commande ``?set-welcome (id du salon)``', value: '> Permet de définir les messages de bienvenue pour les nouveaux membres.', inline: false },
                            { name: '\u200B', value: '\u200B' },
                            { name: 'Code source du bot Saxe Gambetta :', value: 'https://github.com/noaribote/Saxe-Gambetta', inline: false }
                        ]
                    })
                ]
            });
        }


    });
};