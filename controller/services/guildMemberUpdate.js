module.exports = (client, Events, Module_Embed, getServerEnabler, FunctionsPack) => {
    client.on(Events.GuildMemberUpdate, (oldMember, newMember) => {
        if (oldMember.partial) return;

        const serverConfig = getServerEnabler(FunctionsPack, newMember.guild);
        const Enabler = serverConfig.enabler;
        if (Enabler.find(item => item.name === "boost")?.stat) {
            const boostChannel = newMember.guild.channels.cache.get(serverConfig.settings.boostChannelId);

            if (boostChannel) {
                if (!oldMember.premiumSince && newMember.premiumSince) {
                    boostChannel.send({
                        embeds: [
                            Module_Embed.newE({
                                title: "Nouveau boost !",
                                desc: `> ${newMember.toString()} vient de booster le serveur !\n> Nous le remercions infiniment pour son soutien.`,
                                icon: "https://cdn.iconscout.com/icon/free/png-256/free-level-1-discord-boost-icon-svg-download-png-5582632.png?f=webp"
                            })
                        ]
                    });
                }

                if (oldMember.premiumSince && !newMember.premiumSince) {
                    boostChannel.send({
                        embeds: [
                            Module_Embed.newE({
                                title: "Boost retiré...",
                                desc: `> ${newMember.toString()} vient de retirer son boost de serveur...\n> Nous le remercions infiniment pour le soutien qu'il a apporté au serveur !`
                            })
                        ]
                    });
                }
            }
        }

    });
};
