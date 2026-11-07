module.exports = (client, Module_Embed, Enabler, userMessages) => {
    client.on("guildMemberAdd", async (member) => {

        const welcome = Enabler.find(item => item.name === "welcome");
        if (!welcome) return;

        const welcomeChannelId = userMessages.get("welcome-channel-id");
        const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);

        if (welcomeChannel) {
            welcomeChannel.send({
                embeds: [
                    Module_Embed.newE({
                        title: "Bienvenue !",
                        desc: `> ${member.toString()},\n> Prochain arrêt : **${member.guild.name}**\n> Correspondence **Saxe Gambetta** et **RIBOTE--MORAL Noa**.`,
                        icon: member.user.displayAvatarURL()
                    })
                ]
            });
        } else {
            console.log('\x1b[34mINFO\x1b[0m', "Le salon de bienvenue n'est pas définit.");
        }

    });
};