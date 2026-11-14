module.exports = (client, prefix, Module_Embed, getServerEnabler, getServerAntilink, saveServerConfigs, FunctionsPack) => {
    const { Qadmin, Fantilink, erreurJSON } = require("./functions.js");    
    client.on('messageCreate', (message) => {
        if (message.author.bot || !message.guild) return;

        const serverConfig = getServerEnabler(FunctionsPack, message.guild);
        const Enabler = serverConfig.enabler;
        const antilink = getServerAntilink(FunctionsPack, message.guild);

        Fantilink(Module_Embed, Enabler, antilink, message);

        if (!message.content.startsWith(prefix)) return;

        if (message.content === prefix + `help` || message.content === prefix + `info` || message.content === `<@${client.user.id}>`) {
            message.reply({
                embeds: [
                    Module_Embed.newE({
                        title: "Commandes & informations",
                        desc: "Vous arrivez à destination de Saxe Gambetta.",
                        image: 'https://cdn.discordapp.com/banners/1568150259761291306/3b4f1239ec9b931e4252e93375291208?size=1024',
                        fields: [
                            { name: '\u200B', value: '**Pour tous les utilisateurs :**' },
                            { name: '``?help``', value: '> Permet de visualiser toutes les commandes et informations concernant le bot Saxe Gambetta.', inline: false },
                            { name: '``?info (@ utilisateur)``', value: '> Permet de visualiser toutes les informations concernant un utilisateur.', inline: false },
                            { name: '\u200B', value: '**Pour les administrateurs :**' },
                            // { name: '``/create``', value: '> Permet de créer un message embarqué personnalisé.', inline: false },
                            { name: '``?clear (0-100)``', value: '> Permet la suppression d\'un nombre défini de messages.', inline: false },
                            { name: '``?ban (@ utilisateur)``', value: '> Permet le banissement définitif d\'un utilisateur du serveur.', inline: false },
                            { name: '``?unban (ID utilisateur)``', value: '> Permet le débanissement d\'un utilisateur du serveur.', inline: false },
                            { name: '``?set-boost (on/off) (ID salon)``', value: '> Permet de remercier les utilisateurs qui boostent le serveur.', inline: false },
                            { name: '``?set-welcome (on/off) (ID salon)``', value: '> Permet de définir les messages de bienvenue pour les nouveaux membres.', inline: false },
                            { name: '``?set-autorole (on/off) (ID role)``', value: '> Permet de définir un rôle par défaut pour les nouveaux membres.', inline: false },
                            { name: '``?set-antilink (on/off)``', value: '> Permet de filtrer les liens parmis ceux autorisés sur le serveur.', inline: false },
                            // { name: '``/antilink``', value: '> Permet de paramétrer l\'antilink du serveur.', inline: false },
                            // { name: '``?set-antispam``', value: '> Permet d\'établir un anti-spam.', inline: false },
                            // { name: '``/antispam``', value: '> Permet d\'établir un anti-spam personnalisé.', inline: false },
                            { name: '\u200B', value: '\u200B' },
                            { name: 'Code source du bot Saxe Gambetta :', value: 'https://github.com/noaribote/Saxe-Gambetta', inline: false }
                        ]
                    })
                ]
            });
        };

        if (message.content.startsWith(prefix + 'set-antilink')) {
            const args = message.content.slice(prefix.length + "set-antilink".length).trim().split(/ +/);
            if (Qadmin({ message, Module_Embed })) return;
            if (args[0] === "on") {
                Enabler.find(item => item.name === "antilink").stat = true;
                if (!saveServerConfigs(FunctionsPack, message.guild, serverConfig, { enabler: { name: 'antilink', stat: true } })) return erreurJSON(message, Module_Embed);
                message.reply({
                    embeds: [
                        Module_Embed.newE({
                            success: true,
                            title: "Succès de l'opération",
                            desc: 'L\'antilink est désormais activé. Utilisez `/antilink` pour régler ses paramètres.'
                        })
                    ]
                });
            } else if (args[0] === "off") {
                Enabler.find(item => item.name === "antilink").stat = false;
                if (!saveServerConfigs(FunctionsPack, message.guild, serverConfig, { enabler: { name: 'antilink', stat: false } })) return erreurJSON(message, Module_Embed);
                message.reply({
                    embeds: [
                        Module_Embed.newE({
                            success: true,
                            title: "Succès de l'opération",
                            desc: `L'antilink est désormais désactivé.`
                        })
                    ]
                });
            } else {
                message.reply({
                    embeds: [
                        Module_Embed.newE({
                            success: false,
                            title: "Erreur",
                            desc: "Veuillez utiliser les arguments `on` ou `off` afin d'activer ou de désactiver l'antilink."
                        })
                    ]
                });
            }
        }

        if (message.content.startsWith(prefix + 'clear')) {
            const args = message.content.slice(prefix.length + "clear".length).trim().split(/ +/);
            if (Qadmin({ message, Module_Embed })) return;
            const amount = parseInt(args[0]);
            if (isNaN(amount)) {
                return message.reply({ embeds: [
                    Module_Embed.newE({
                        success: false,
                        title: "Erreur",
                        desc: "Saisissez un nombre valide de messages à supprimer."
                    })
                ] });
            }
            if (amount < 1 || amount > 100) {
                return message.reply({ embeds: [
                    Module_Embed.newE({
                        success: false,
                        title: "Erreur",
                        desc: "Saisissez un nombre entre 1 et 100 maximum."
                    })
                ] });
            }
            message.channel.bulkDelete(amount, true)
                .then(messages => {
                    setTimeout(() => {
                        message.channel.send({ embeds: [
                            Module_Embed.newE({
                                success: true,
                                title: "Succès de l'opération",
                                desc: `${messages.size} messages viennent d'être supprimés avec succès !`
                            })
                        ] });
                    }, 1000);
                })
                .catch(error => {
                    console.error('\x1b[31mERR\x1b[0m', "Erreur lors de la suppression de(s) message(s) :", error);
                    message.reply({ embeds: [
                        Module_Embed.newE({
                            success: false,
                            title: "Erreur",
                            desc: "Erreur lors de la suppression des messages."
                        })
                    ] });
                });
        }

    });
    client.on("messageCreate", async (message) => {
        if (message.author.bot || !message.guild) return;
        if (!message.content.startsWith(prefix)) return;

        const serverConfig = getServerEnabler(FunctionsPack, message.guild);
        const Enabler = serverConfig.enabler;

        if (message.content.startsWith(prefix + 'info')) {
            const args = message.content.slice(prefix.length + "info".length).trim().split(/ +/);
            if (!args[0]) return;
            const mentionedUser = message.mentions.users.first();        
            if (mentionedUser) {
                const member = message.guild.members.cache.get(mentionedUser.id);
            
                const embedUser = Module_Embed.newE({
                                title: "Informations de l'utilisateur",
                                desc: `Informations concernant <@${mentionedUser.id}>.`,
                                icon: mentionedUser.displayAvatarURL({ dynamic: true }),
                                fields: [
                                    { name: "ID", value: mentionedUser.id, inline: false },
                                    { name: "Pseudonyme", value: member ? member.nickname || "n/a" : "Inconnu", inline: true },
                                    { name: "Tag", value: mentionedUser.tag, inline: true },
                                    { name: "Avatar", value: `[voir ici](${mentionedUser.displayAvatarURL({ dynamic: true })})`, inline: true }
                                ]
                            });
        
                const user = await client.users.fetch(mentionedUser.id, { force: true });
                if (user.banner) {
                    embedUser.addFields({ name: "Bannière", value: `[voir ici](${user.bannerURL({ format: 'png', dynamic: true, size: 1024 })})`, inline: true });
                }
                embedUser.addFields(
                    { name: "Status", value: mentionedUser.presence?.status || "n/a", inline: true },
                    { name: "Activité", value: mentionedUser.presence?.activities.length 
                        ? mentionedUser.presence.activities.map(activity => activity.name).join(", ") 
                        : "n/a", inline: true },
                    { name: "Crée le", value: mentionedUser.createdAt.toDateString(), inline: true },
                    { name: "Bot", value: mentionedUser.bot ? "Oui" : "Non", inline: true },
                    { name: "Arrivé le", value: member ? member.joinedAt.toDateString() : "Inconnu", inline: true },
                    { name: "Membre depuis", value: member ? `${Math.floor((Date.now() - member.joinedTimestamp) / 1000 / 60)} min.` : "Inconnu", inline: true },
                    { name: "Nombre de rôles", value: member ? member.roles.cache.size.toString() : "Inconnu", inline: true },
                    { name: "Rôles", value: member ? member.roles.cache.map(role => role.toString()).join(", ") : "n/a", inline: false },
                    { name: "Permissions", value: member ? member.permissions.toArray().join(", ") || "n/a" : "Inconnu", inline: false },
                )
            
                message.reply({ embeds: [embedUser] });
            } else {
                message.reply({ embeds: [
                    Module_Embed.newE({
                        success: false,
                        title: "Erreur",
                        desc: `Veuillez mentionner un utilisateur valide.`
                    })
                ] });
            }
        }

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();


        if (command === 'ban') {
            if (Qadmin({ message, Module_Embed })) return;

            const member = message.mentions.members.first();
            if (!member) {
                return message.reply({
                    embeds: [
                        Module_Embed.newE({
                            success: false,
                            title: "Erreur",
                            desc: "Veuillez mentionner un utilisateur à bannir du serveur."
                        })
                    ]
                });
            }
            if (member.id === message.guild.ownerId) {
                return message.reply({
                    embeds: [
                        Module_Embed.newE({
                            title: "Intelligence divine",
                            desc: "Se croire tout-puissant est dangereux.\n- Métro D, direction Vénissieux"
                        })
                    ]
                });
            }
            if (message.author.id !== message.guild.ownerId && member.roles.highest.position >= message.member.roles.highest.position || member.id === message.author.id) {
                return message.reply({
                    embeds: [
                        Module_Embed.newE({
                            success: false,
                            title: "Erreur",
                            desc: "Vous n'avez pas la permission de bannir cet utilisateur."
                        })
                    ]
                });
            }
            if (!member.bannable) {
                return message.reply({
                    embeds: [
                        Module_Embed.newE({
                            success: false,
                            title: "Erreur",
                            desc: "Impossible de bannir cet utilisateur."
                        })
                    ]
                });
            }

            const reason = args.slice(1).join(' ') || 'Aucune raison fournie.';

            try {
                await member.ban({ reason: `${reason} (par ${message.author.tag})` });
                message.reply({
                    embeds: [
                        Module_Embed.newE({
                            success: true,
                            title: "Succès de l'opération",
                            desc: `**${member.user.tag}** a été banni avec succès. Raison : ${reason}`
                        })
                    ]
                });
            } catch (err) {
                console.error('\x1b[31mERR\x1b[0m', "Erreur survenue lors du bannissement :", err);
                message.reply({
                    embeds: [
                        Module_Embed.newE({
                            success: false,
                            title: "Erreur",
                            desc: "Une erreur est survenue lors du bannissement."
                        })
                    ]
                });
            }
        }


        if (command === 'unban') {
            if (Qadmin({ message, Module_Embed })) return;

            const userId = args[0];
            if (!userId || !/^\d{17,20}$/.test(userId)) {
                return message.reply({
                    embeds: [
                        Module_Embed.newE({
                            success: false,
                            title: "Erreur",
                            desc: "Veuillez joindre l'ID unique d'un utilisateur."
                        })
                    ]
                });
            }

            const reason = args.slice(1).join(' ') || 'Aucune raison fournie.';

            try {
                const ban = await message.guild.bans.fetch(userId).catch(() => null);
                if (!ban) {
                    return message.reply({
                        embeds: [
                            Module_Embed.newE({
                                success: false,
                                title: "Erreur",
                                desc: "Cet utilisateur n'est pas banni. Veuillez identifier un utilisateur déjà banni."
                            })
                        ]
                    });
                }
                await message.guild.members.unban(userId, `${reason} (par ${message.author.tag})`);
                message.reply({
                    embeds: [
                        Module_Embed.newE({
                            success: true,
                            title: "Succès de l'opération",
                            desc: `**${ban.user.tag}** a été débanni avec succès. Raison : ${reason}`
                        })
                    ]
                });
            } catch (err) {
                console.error('\x1b[31mERR\x1b[0m', "Erreur survenue lors du débannissement :", err);
                message.reply({
                    embeds: [
                        Module_Embed.newE({
                            success: false,
                            title: "Erreur",
                            desc: "Une erreur est survenue lors du débannissement."
                        })
                    ]
                });
            }
        }


        if (command === "set-boost") {

            if (Qadmin({ message, Module_Embed })) return;

            if (args[0] === "on") {
                if (args[1]) {
                    const channelId = args[1];
                    if (message.guild.channels.cache.has(channelId)) {
                        serverConfig.settings.boostChannelId = channelId;
                        Enabler.find(item => item.name === "boost").stat = true;
                        if (!saveServerConfigs(FunctionsPack, message.guild, serverConfig, [
                            { setting: { key: 'boostChannelId', value: channelId } },
                            { enabler: { name: 'boost', stat: true } }
                        ])) return erreurJSON(message, Module_Embed);
                        message.reply({
                            embeds: [
                                Module_Embed.newE({
                                    success: true,
                                    title: "Succès de l'opération",
                                    desc: `Les messages de remerciements sont désormais activés dans le salon <#${channelId}>.`
                                })
                            ]
                        });
                    } else {
                        message.reply({
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
                    message.reply({
                        embeds: [
                            Module_Embed.newE({
                                success: false,
                                title: "Erreur",
                                desc: "Afin d'activer les messages de remerciements correctement, un ID de salon est requis pour identifier le salon à utiliser."
                            })
                        ]
                    });
                }
            } else if (args[0] === "off") {
                Enabler.find(item => item.name === "boost").stat = false;
                if (!saveServerConfigs(FunctionsPack, message.guild, serverConfig, { enabler: { name: 'boost', stat: false } })) return erreurJSON(message, Module_Embed);
                message.reply({
                    embeds: [
                        Module_Embed.newE({
                            success: true,
                            title: "Succès de l'opération",
                            desc: "Les messages de remerciements sont désormais désactivés."
                        })
                    ]
                });
            } else {
                message.reply({
                    embeds: [
                        Module_Embed.newE({
                            success: false,
                            title: "Erreur",
                            desc: "Veuillez utiliser les arguments `on` ou `off` afin d'activer ou de désactiver les messages de remerciements."
                        })
                    ]
                });
            }
        }

        if (command === "set-welcome") {

            if (Qadmin({ message, Module_Embed })) return;

            if (args[0] === "on") {
                if (args[1]) {
                    const channelId = args[1];
                    if (message.guild.channels.cache.has(channelId)) {
                        serverConfig.settings.welcomeChannelId = channelId;
                        Enabler.find(item => item.name === "welcome").stat = true;
                        if (!saveServerConfigs(FunctionsPack, message.guild, serverConfig, [
                            { setting: { key: 'welcomeChannelId', value: channelId } },
                            { enabler: { name: 'welcome', stat: true } }
                        ])) return erreurJSON(message, Module_Embed);
                        message.reply({
                            embeds: [
                                Module_Embed.newE({
                                    success: true,
                                    title: "Succès de l'opération",
                                    desc: `Les messages de bienvenue sont désormais activés dans le salon <#${channelId}>.`
                                })
                            ]
                        });
                    } else {
                        message.reply({
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
                    message.reply({
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
                Enabler.find(item => item.name === "welcome").stat = false;
                if (!saveServerConfigs(FunctionsPack, message.guild, serverConfig, { enabler: { name: 'welcome', stat: false } })) return erreurJSON(message, Module_Embed);
                message.reply({
                    embeds: [
                        Module_Embed.newE({
                            success: true,
                            title: "Succès de l'opération",
                            desc: "Les messages de bienvenue sont désormais désactivés."
                        })
                    ]
                });
            } else {
                message.reply({
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

        if (command === 'set-autorole') {

            if (Qadmin({ message, Module_Embed })) return;

            if (args[0] === "on") {
                if (args[1]) {
                    const roleID = args[1];
                    if (message.guild.roles.cache.has(roleID)) {
                        serverConfig.settings.autoroleRoleId = roleID;
                        Enabler.find(item => item.name === "autorole").stat = true;
                        if (!saveServerConfigs(FunctionsPack, message.guild, serverConfig, [
                            { setting: { key: 'autoroleRoleId', value: roleID } },
                            { enabler: { name: 'autorole', stat: true } }
                        ])) return erreurJSON(message, Module_Embed);
                        message.reply({
                            embeds: [
                                Module_Embed.newE({
                                    success: true,
                                    title: "Succès de l'opération",
                                    desc: `Le rôle <@${roleID}> sera désormais attribué automatiquement aux nouveaux membres.`
                                })
                            ]
                        });
                    } else {
                        message.reply({
                            embeds: [
                                Module_Embed.newE({
                                    success: false,
                                    title: "Erreur",
                                    desc: "L'ID fourni ne correspond à aucun rôle visible."
                                })
                            ]
                        });
                    }
                } else {
                    message.reply({
                        embeds: [
                            Module_Embed.newE({
                                success: false,
                                title: "Erreur",
                                desc: "Afin d'activer les rôles automatiques correctement, un ID de rôle est requis pour identifier le rôle à attribuer aux nouveaux membres."
                            })
                        ]
                    });
                }
            } else if (args[0] === "off") {
                Enabler.find(item => item.name === "autorole").stat = false;
                if (!saveServerConfigs(FunctionsPack, message.guild, serverConfig, { enabler: { name: 'autorole', stat: false } })) return erreurJSON(message, Module_Embed);
                message.reply({
                    embeds: [
                        Module_Embed.newE({
                            success: true,
                            title: "Succès de l'opération",
                            desc: "Les rôles automatiques sont désormais désactivés."
                        })
                    ]
                });
            } else {
                message.reply({
                    embeds: [
                        Module_Embed.newE({
                            success: false,
                            title: "Erreur",
                            desc: "Veuillez utiliser les arguments `on` ou `off` afin d'activer ou de désactiver les rôles automatiques."
                        })
                    ]
                });
            }
        }


    });
};
