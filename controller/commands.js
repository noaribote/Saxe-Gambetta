module.exports = (client, prefix, Module_Embed, Enabler, userMessages) => {
    client.on('messageCreate', (message) => {

        if (message.content === prefix + `help` || message.content === `<@${client.user.id}>`) {
            message.channel.send({
                embeds: [
                    Module_Embed.newE({
                        title: "Commandes & informations",
                        desc: "Vous arrivez à destination de Saxe Gambetta.",
                        image: 'https://cdn.discordapp.com/banners/1568150259761291306/3b4f1239ec9b931e4252e93375291208?size=1024',
                        fields: [
                            { name: '\u200B', value: '\u200B' },
                            { name: 'Commande ``?help``', value: '> Permet de visualiser toutes les commandes et informations concernant le bot Saxe Gambetta.', inline: false },
                            { name: 'Commande ``?clear (0-100)``', value: '> Permet la suppression d\'un nombre défini de messages.', inline: false },
                            { name: 'Commande ``?set-welcome (on/off) (ID du salon)``', value: '> Permet de définir les messages de bienvenue pour les nouveaux membres.', inline: false },
                            { name: '\u200B', value: '\u200B' },
                            { name: 'Code source du bot Saxe Gambetta :', value: 'https://github.com/noaribote/Saxe-Gambetta', inline: false }
                        ]
                    })
                ]
            });
        }

    });
    client.on("messageCreate", async (message) => {


        if (message.author.bot) return;
        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        const welcome = Enabler.find(item => item.name === "welcome");

        if (command === "set-welcome") {
            if (args[0] === "on") {
                if (args[1]) {
                    const channelId = args[1];
                    if (message.guild.channels.cache.has(channelId)) {
                        userMessages.set("welcome-channel-id", channelId);
                        welcome.stat = true;
                        message.channel.send({
                            embeds: [
                                Module_Embed.newE({
                                    success: true,
                                    title: "Succès de l'opération",
                                    desc: `Les messages de bienvenue sont désormais activés dans le salon <#${channelId}>.`
                                })
                            ]
                        });
                    } else {
                        message.channel.send({
                            embeds: [
                                Module_Embed.newE({
                                    success: false,
                                    title: "Erreur",
                                    desc: "L'ID fourni ne correspond à aucun salon visible."
                                })
                            ]
                        });
                    }
                } else {
                    message.channel.send({
                        embeds: [
                            Module_Embed.newE({
                                success: false,
                                title: "Erreur",
                                desc: "Afin d'activer les messages de bienvenue correctement, un ID de salon est requis pour identifier le salon à utiliser."
                            })
                        ]
                    });
                }
            } else if (args[0] === "off") {
                welcome.stat = false;
                message.channel.send({
                    embeds: [
                        Module_Embed.newE({
                            success: true,
                            title: "Succès de l'opération",
                            desc: "Les messages de bienvenue sont désormais désactivés."
                        })
                    ]
                });
            } else {
                message.channel.send({
                    embeds: [
                        Module_Embed.newE({
                            success: false,
                            title: "Erreur",
                            desc: "Veuillez utiliser les arguments `on` ou `off` afin d'activer ou de désactiver les messages de bienvenue."
                        })
                    ]
                });
            }
        }


    });
};