function AllFunctionsController({client, activities}) {
    let activityIndex = 0;
    function changeActivity() {
        const activity = activities[activityIndex];
        if (typeof activity.name === 'function') {
            client.user.setActivity(activity.name(client), { type: activity.type, status: activity.status, url: activity.url });
        } else {
            client.user.setActivity(activity.name, { type: activity.type, status: activity.status, url: activity.url });
        }

        activityIndex = (activityIndex + 1) % activities.length;
        setTimeout(changeActivity, 5000);
    };

    return { changeActivity };
}

function Qadmin({ message, Module_Embed }) {
    if (!message.member || !(BigInt(message.member.permissions) & BigInt(0x00000008))) {
        setTimeout(() => {
            message.reply({ embeds: [
                Module_Embed.newE({
                    success: false,
                    title: "Erreur",
                    desc: "Commande réservée aux administrateurs."
                })
            ] });
        }, 1000);
        return true;
    };
    return false;
}


function containsForbiddenLink(content, antilink) {
    const text = content.toLowerCase();
    const urls = text.match(/https?:\/\/[^\s|)>\]]+/g) || [];
    for (const raw of urls) {
        try {
            const host = new URL(raw).hostname;
            if (!antilink.allowedHosts.includes(host)) return true;
        } catch {
            return true;
        }
    }
    return antilink.blacklisted.some(item => text.includes(item));
}

function Fantilink(Module_Embed, Enabler, antilink, etatMessage) {
    if (Enabler.find(item => item.name === "antilink").stat === true) {
        if (containsForbiddenLink(etatMessage.content, antilink)) {
            if (!etatMessage.member || !(BigInt(etatMessage.member.permissions) & BigInt(0x00000008))) {
                etatMessage.channel.send({ embeds: [
                    Module_Embed.newE({
                        title: "Service de sécurité",
                        desc: `L'antilink a intercepté un message envoyé par <@${etatMessage.member.id}>.`
                    })
                ] }).then(msg => {
                    setTimeout(() => msg.delete().catch(error => console.error('\x1b[31mERR\x1b[0m', "Erreur de la suppression automatique de l'embed antilink :", error)), 10000);
                }).catch(error => console.error('\x1b[31mERR\x1b[0m', "Erreur lors de l'envoi de l'embed :", error));

                console.log('\x1b[34mINFO\x1b[0m', `Message avec liens prohibés de ${etatMessage.member.user.tag} : ${etatMessage.content}`);
                etatMessage.delete().catch((error) => console.error('\x1b[31mERR\x1b[0m', "Erreur lors de la suppression par l'antilink :", error));
            }
        }
    }
}

module.exports = { AllFunctionsController, Qadmin, containsForbiddenLink, Fantilink }