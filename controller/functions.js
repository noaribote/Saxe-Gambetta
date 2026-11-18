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

function embedAdmin(etat, Module_Embed) {
    if (!etat.member || !(BigInt(etat.member.permissions) & BigInt(0x00000008))) {
        setTimeout(() => {
            etat.reply({ embeds: [
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

function Qadmin({ message, Module_Embed }) { return embedAdmin(message, Module_Embed) }
function QIadmin({ interaction, Module_Embed }) { return embedAdmin(interaction, Module_Embed) }


function containsForbiddenLink(content, antilink) {
    const text = String(content || '').toLowerCase();
    const allowed = (antilink?.allowedHosts || []).map(item => String(item).toLowerCase());
    const blacklisted = (antilink?.blacklisted || []).map(item => String(item).toLowerCase());
    const urls = text.match(/(?:https?:\/\/|www\.)[^\s<>]+/gi) || [];

    return urls.some(rawUrl => {
        const url = rawUrl.replace(/[),.!?;:]+$/g, '');
        let hostname;
        try {
            hostname = new URL(url.startsWith('www.') ? `https://${url}` : url).hostname.toLowerCase();
        } catch {
            return false;
        }
        if (blacklisted.some(rule => url.includes(rule) || hostname === rule || hostname.endsWith(`.${rule}`))) return true;
        if (allowed.some(host => hostname === host || hostname.endsWith(`.${host}`))) return false;
        return true;
    });
}

function normalizeDomain(value) {
    if (typeof value !== 'string') return null;

    const domain = value.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (!domain || domain.length > 253 || /[\s/@?#:]/.test(domain)) return null;

    const hostname = domain.startsWith('*.') ? domain.slice(2) : domain;
    if (hostname.split('.').some(label => !label || label.length > 63 || !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label))) return null;

    return domain;
}

function setServerAntilink(FunctionsPack, guild, domaine, autorisation) {
    const [fs] = FunctionsPack;
    const filePath = getConfigPaths(FunctionsPack).antilink;
    const data = readJson(fs, filePath);
    let server = data.servers.find(item => String(item['server-id']) === guild.id);

    if (!server) {
        server = { 'server-id': guild.id, ...structuredClone(FunctionsPack[3]) };
        data.servers.push(server);
    }
    server.blacklisted ??= []; server.allowedHosts ??= [];
    
    const value = normalizeDomain(domaine);
    if (!value) return false;

    server.blacklisted = server.blacklisted.filter(item => String(item).toLowerCase() !== value);
    server.allowedHosts = server.allowedHosts.filter(item => String(item).toLowerCase() !== value);

    (autorisation ? server.allowedHosts : server.blacklisted).push(value);
    writeJson(fs, filePath, data);

    return server.blacklisted.includes(value) === !autorisation && server.allowedHosts.includes(value) === autorisation;
}

function Fantilink(Module_Embed, Enabler, antilink, etatMessage) {
    if (Enabler.find(item => item.name === "antilink")?.stat === true) {
        if (containsForbiddenLink(etatMessage.content, antilink)) {
            const memberPermissions = etatMessage.member?.permissions;
            const isAdministrator = memberPermissions && (BigInt(memberPermissions.bitfield ?? memberPermissions) & BigInt(0x00000008)) !== 0n;
            if (!isAdministrator) {
                etatMessage.channel.send({ embeds: [
                    Module_Embed.newE({
                        title: "Service de sécurité",
                        desc: `L'antilink a intercepté un message envoyé par <@${etatMessage.author.id}>.`
                    })
                ] }).then(msg => {
                    setTimeout(() => msg.delete().catch(error => console.error('\x1b[31mERR\x1b[0m', "Erreur de la suppression automatique de l'embed antilink :", error)), 10000);
                }).catch(error => console.error('\x1b[31mERR\x1b[0m', "Erreur lors de l'envoi de l'embed :", error));

                console.log('\x1b[34mINFO\x1b[0m', `Message avec liens prohibés de ${etatMessage.author.tag} : ${etatMessage.content}`);
                etatMessage.delete().catch((error) => console.error('\x1b[31mERR\x1b[0m', "Erreur lors de la suppression par l'antilink :", error));
            }
        }
    }
}

async function Fantispam(userMessages, Module_Embed, Enabler, antispam, etatMessage) {
    if (Enabler.find(item => item.name === "antispam")?.stat !== true) return;

    const maxMessages = Number(antispam?.msg);
    const windowMs = Number(antispam?.ms);
    if (!Number.isInteger(maxMessages) || maxMessages < 3 || maxMessages > 100 || !Number.isInteger(windowMs) || windowMs < 1000 || windowMs > 60000) {
        console.error('\x1b[31mERR\x1b[0m', "Erreur : configuration antispam invalide pour le serveur", etatMessage.guild.id);
        return;
    }

    const now = etatMessage.createdTimestamp;
    const userMessagesArray = (userMessages.get(etatMessage.author.id) || [])
        .filter(timestamp => now - timestamp >= 0 && now - timestamp <= windowMs);
    userMessagesArray.push(now);
    userMessages.set(etatMessage.author.id, userMessagesArray);

    if (userMessagesArray.length < maxMessages) return;

    userMessages.delete(etatMessage.author.id);
    const member = await etatMessage.guild.members.fetch(etatMessage.author.id).catch(() => null);
    if (!member) return;

    if (!member.moderatable || member.id === etatMessage.guild.ownerId || member.user.bot) return;

    try {
        await member.timeout(5 * 60 * 1000, `Antispam : ${maxMessages} messages en ${windowMs} ms`);
        await etatMessage.channel.send({ embeds: [
            Module_Embed.newE({
                title: 'Service de sécurité',
                desc: `L'utilisateur ${etatMessage.author} a violé la loi anti-spam du serveur.`
            })
        ] });
    } catch (error) {
        console.error('\x1b[31mERR\x1b[0m', "Erreur lors du bannissement antispam :", error);
        etatMessage.channel.send({ embeds: [
            Module_Embed.newE({
                success: false,
                title: 'Erreur',
                desc: `Erreur lors du bannissement de ${etatMessage.author} pour violation de la loi anti-spam du serveur.`
            })
        ] });
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
        antilink: path.join(modelPath, 'servers_antilink.json'),
        antispam: path.join(modelPath, 'servers_antispam.json')
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
    const antispamData = readJson(fs, paths.antispam);
    const serverIndex = enablerData.servers.findIndex(item => String(item['server-id']) === guild.id);

    if (serverIndex === -1) {
        enablerData.servers.push(serverConfig);
    } else {
        enablerData.servers[serverIndex] = serverConfig;
    };

    writeJson(fs, paths.enabler, enablerData);
    writeJson(fs, paths.antilink, antilinkData);
    writeJson(fs, paths.antispam, antispamData);

    const savedEnablerData = readJson(fs, paths.enabler);
    const savedAntilinkData = readJson(fs, paths.antilink);
    const savedAntispamData = readJson(fs, paths.antispam);
    const enablerServer = savedEnablerData.servers.find(item => String(item['server-id']) === guild.id);
    const antilinkServer = savedAntilinkData.servers.find(item => String(item['server-id']) === guild.id);
    const antispamServer = savedAntispamData.servers.find(item => String(item['server-id']) === guild.id);

    const checks = Array.isArray(expected) ? expected : [expected];
    return checks.every(check => {
        if (check.setting) return enablerServer?.settings?.[check.setting.key] === check.setting.value;
        if (check.enabler) return enablerServer?.enabler?.find(item => item.name === check.enabler.name)?.stat === check.enabler.stat;
        if (check.antilink) return antilinkServer?.[check.antilink.key]?.includes(check.antilink.value) === check.antilink.includes;
        if (check.antispam) return antispamServer?.[check.antispam.key]?.includes(check.antispam.value) === check.antispam.includes;
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
        for (const defaultEnabler of FunctionsPack[2]) {
            if (!server.enabler.some(item => item.name === defaultEnabler.name)) {
                server.enabler.push(structuredClone(defaultEnabler));
            }
        }
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

function getServerAntispam(FunctionsPack, guild) {
    const [fs] = FunctionsPack;
    const filePath = getConfigPaths(FunctionsPack).antispam;
    const data = readJson(fs, filePath);
    let server = data.servers.find(item => String(item['server-id']) === guild.id);
    if (!server) {
        server = { 'server-id': guild.id, ...structuredClone(FunctionsPack[4]) };
        data.servers.push(server);
        writeJson(fs, filePath, data);
    }
    return server;
}

function setServerAntispam(FunctionsPack, guild, settings) {
    const [fs] = FunctionsPack;
    const filePath = getConfigPaths(FunctionsPack).antispam;
    const data = readJson(fs, filePath);
    let server = data.servers.find(item => String(item['server-id']) === guild.id);
    if (!server) {
        server = { 'server-id': guild.id, ...structuredClone(FunctionsPack[4]) };
        data.servers.push(server);
    }
    server.msg = settings.msg;
    server.ms = settings.ms;
    writeJson(fs, filePath, data);
    return server.msg === settings.msg && server.ms === settings.ms;
}

async function slashCreateCommand(Module_Embed, pack) {
    try {
        await pack[0].send({
            embeds: [ Module_Embed.newE({ title: pack[1], desc: pack[2] }) ]
        });
        return true;
    } catch (error) {
        console.log('\x1b[31mERR\x1b[0m', "Erreur lors de l'envoi du message personnalisé :", error);
        return false;
    }
}

module.exports = { AllFunctionsController, Qadmin, QIadmin, slashCreateCommand, containsForbiddenLink, normalizeDomain, Fantilink, Fantispam, getServerEnabler, getServerAntilink, getServerAntispam, setServerAntilink, setServerAntispam, saveServerConfigs, erreurJSON }
