module.exports = (client, Module_Embed, Enabler, userMessages) => {
    client.on("guildMemberAdd", async (member) => {

        if (Enabler.find(item => item.name === "welcome")?.stat) {
            const welcomeChannelId = userMessages.get("welcome-channel-id");
            const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);

            if (welcomeChannel) {
                welcomeChannel.send({
                    embeds: [
                        Module_Embed.newE({
                            title: "Bienvenue !",
                            desc: `> ${member.toString()},\n> Prochain arrêt : **${member.guild.name}**\n> Correspondence **Saxe Gambetta** et **RIBOTE Noa**.`,
                            icon: member.user.displayAvatarURL()
                        })
                    ]
                });
            } else {
                console.log('\x1b[34mINFO\x1b[0m', "Le salon de bienvenue n'est pas définit.");
            }
        }

        if (Enabler.find(item => item.name === "autorole")?.stat) {
            const role = member.guild.roles.cache.get(userMessages.get("autorole-role-id"));
            if (role) {
                member.roles.add(role)
                    .then(() =>
                            console.log('\x1b[34mINFO\x1b[0m', `Rôle automatiquement attribué à ${member.user.tag}.`
                        )).catch((error) =>
                            console.error('\x1b[31mERR\x1b[0m', "Erreur lors de l'ajout du role via l'autorole:", error
                        ));
            } else {
                console.log('\x1b[34mINFO\x1b[0m', "L'autorole n'est pas définit.");
            }
        }

    });
};