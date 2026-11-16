const { Client, GatewayIntentBits, EmbedBuilder, ActivityType, Events, Partials } = require("discord.js");
const { AllFunctionsController, getServerEnabler, getServerAntilink, getServerAntispam, saveServerConfigs } = require("./controller/functions.js");
const { token, prefix } = require('./config/essential.json');
const { CreateEmbed } = require("./controller/services/EmbedBuilder.js");
const { slashCreate, slashAntilink, slashAntispam } = require("./controller/services/SlashCommandBuilder.js");

const fs = require('node:fs');
const path = require('node:path');
const enablerDefaults = [
    { name: 'antilink', stat: false },
    { name: 'antispam', stat: false },
    { name: 'boost', stat: false },
    { name: 'welcome', stat: false },
    { name: 'autorole', stat: false }
];
const antilinkDefaults = {
    blacklisted: ['.gg/', 'youtu.be/'],
    allowedHosts: ['tenor.com', 'media.tenor.com', 'www.tenor.com']
};
const antispamDefaults = { msg: 5, ms: 3000 };

const FunctionsPack = [fs, path, enablerDefaults, antilinkDefaults, antispamDefaults];

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.GuildMember
    ]
});

const activities = [
    { name: "www.noaribote.fr", type: ActivityType.Watching },
    { name: (client) => `${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} members`, type: ActivityType.Watching }
];

const Module_1 = AllFunctionsController({client, activities});
const Module_Embed = CreateEmbed({EmbedBuilder});
require('./controller/interactions.js')(client, Module_Embed, Events);
require('./controller/commands.js')(client, prefix, Module_Embed, getServerEnabler, getServerAntilink, getServerAntispam, saveServerConfigs, FunctionsPack);
require('./controller/commandsUpdate.js')(client, Module_Embed, getServerEnabler, getServerAntilink, FunctionsPack);
require('./controller/services/guildMemberAdd.js')(client, Module_Embed, getServerEnabler, FunctionsPack);
require('./controller/services/guildMemberUpdate.js')(client, Events, Module_Embed, getServerEnabler, FunctionsPack);

const enregistrer = (guild) => guild.commands.set([slashCreate, slashAntilink, slashAntispam]);

client.once(Events.ClientReady, async (readyClient) => {
    for (const guild of readyClient.guilds.cache.values()) {
        getServerEnabler(FunctionsPack, guild);
        getServerAntilink(FunctionsPack, guild);
        getServerAntispam(FunctionsPack, guild);
        await enregistrer(guild);
    }
    saveServerConfigs(FunctionsPack);
    console.log('\x1b[33m%s\x1b[0m', `${readyClient.user.username} est en ligne.`);
    Module_1.changeActivity();
});

client.on(Events.GuildCreate, async (guild) => {
    getServerEnabler(FunctionsPack, guild);
    getServerAntilink(FunctionsPack, guild);
    getServerAntispam(FunctionsPack, guild);
    saveServerConfigs(FunctionsPack);
    await enregistrer(guild);
});
client.login(token);
