const { Client, GatewayIntentBits, EmbedBuilder, ActivityType, MessageManager, Collection, Events } = require("discord.js");
const { token, prefix } = require('./config/essential.json');
const { AllFunctionsController } = require("./controller/functions.js");
const { CreateEmbed } = require("./controller/EmbedBuilder.js");
const commands = require('./controller/commands.js');
const welcome = require('./controller/services/welcome.js');

const userMessages = new Map();
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

const activities = [
    { name: "www.noaribote.fr", type: ActivityType.Watching },
    { name: (client) => `${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} members`, type: ActivityType.Watching }
];

let Enabler = [
    { name: "welcome", stat: false }
];

const Module_1 = AllFunctionsController({client, activities});
const Module_Embed = CreateEmbed({EmbedBuilder});
commands(client, prefix, Module_Embed, Enabler, userMessages);
welcome(client, Module_Embed, Enabler, userMessages);

client.once(Events.ClientReady, (readyClient) => {
    console.log('\x1b[33m%s\x1b[0m', `${readyClient.user.tag} en ligne.`);
    Module_1.changeActivity();
});

client.login(token);
