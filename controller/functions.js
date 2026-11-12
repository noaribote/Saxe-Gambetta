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

function erreurJSON(message, Module_Embed) {
    return message.reply({ embeds: [
        Module_Embed.newE({
            success: false,
            title: 'Erreur',
            desc: "Impossible de lire la sauvegarde. Aucune confirmation n'a été envoyée."
        })
    ] });
}

function getConfigPaths(FunctionsPack) {
    const [, path] = FunctionsPack;
    const modelPath = path.join(__dirname, '..', 'model');
    return {
        enabler: path.join(modelPath, 'servers_enabler.json'),
        antilink: path.join(modelPath, 'servers_antilink.json')
    };
}

function readJson(fs, filePath) { return JSON.parse(fs.readFileSync(filePath, 'utf8')); }
function writeJson(fs, filePath, data) { fs.writeFileSync(filePath, `${JSON.stringify(data, null, 4)}\n`, 'utf8'); }

function saveServerConfigs(FunctionsPack, guild, serverConfig, expected = {}) {
    if (!guild) return true;

    const [fs] = FunctionsPack;
    const paths = getConfigPaths(FunctionsPack);
    const enablerData = readJson(fs, paths.enabler);
    const antilinkData = readJson(fs, paths.antilink);
    const serverIndex = enablerData.servers.findIndex(item => String(item['server-id']) === guild.id);

    if (serverIndex === -1) {
        enablerData.servers.push(serverConfig);
    } else {
        enablerData.servers[serverIndex] = serverConfig;
    };

    writeJson(fs, paths.enabler, enablerData);
    writeJson(fs, paths.antilink, antilinkData);

    const savedEnablerData = readJson(fs, paths.enabler);
    const savedAntilinkData = readJson(fs, paths.antilink);
    const enablerServer = savedEnablerData.servers.find(item => String(item['server-id']) === guild.id);
    const antilinkServer = savedAntilinkData.servers.find(item => String(item['server-id']) === guild.id);

    const checks = Array.isArray(expected) ? expected : [expected];
    return checks.every(check => {
        if (check.setting) return enablerServer?.settings?.[check.setting.key] === check.setting.value;
        if (check.enabler) return enablerServer?.enabler?.find(item => item.name === check.enabler.name)?.stat === check.enabler.stat;
        if (check.antilink) return antilinkServer?.[check.antilink.key]?.includes(check.antilink.value) === check.antilink.includes;
        return false;
    });
}

function getServerEnabler(FunctionsPack, guild) {
    const [fs] = FunctionsPack;
    const filePath = getConfigPaths(FunctionsPack).enabler;
    const data = readJson(fs, filePath);
    let server = data.servers.find(item => String(item['server-id']) === guild.id);
    if (!server) {
        server = { 'server-id': guild.id, enabler: structuredClone(FunctionsPack[2]), settings: {} };
        data.servers.push(server);
        writeJson(fs, filePath, data);
    } else {
        server.settings ??= {};
        server.enabler ??= structuredClone(FunctionsPack[2]);
        writeJson(fs, filePath, data);
    }
    return server;
}

function getServerAntilink(FunctionsPack, guild) {
    const [fs] = FunctionsPack;
    const filePath = getConfigPaths(FunctionsPack).antilink;
    const data = readJson(fs, filePath);
    let server = data.servers.find(item => String(item['server-id']) === guild.id);
    if (!server) {
        server = { 'server-id': guild.id, ...structuredClone(FunctionsPack[3]) };
        data.servers.push(server);
        writeJson(fs, filePath, data);
    }
    return server;
}

module.exports = { AllFunctionsController, Qadmin, containsForbiddenLink, Fantilink, getServerEnabler, getServerAntilink, saveServerConfigs, erreurJSON }
