const { Client, GatewayIntentBits, EmbedBuilder, ActivityType, MessageManager, Collection, Events, Partials } = require("discord.js");
const { token, prefix } = require('./config/essential.json');
const { AllFunctionsController } = require("./controller/functions.js");
const { CreateEmbed } = require("./controller/EmbedBuilder.js");
const userMessages = new Map();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ],
    partials: [
        Partials.GuildMember
    ]
});

const activities = [
    { name: "www.noaribote.fr", type: ActivityType.Watching },
    { name: (client) => `${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} members`, type: ActivityType.Watching }
];

let Enabler = [
    { name: "antilink", stat: false },
    { name: "boost", stat: false },
    { name: "welcome", stat: false },
    { name: "autorole", stat: false }
];

let antilink = {
    blacklisted: ['.gg/', 'youtu.be/'],
    allowedHosts: ['tenor.com', 'media.tenor.com', 'www.tenor.com']
};

const Module_1 = AllFunctionsController({client, activities});
const Module_Embed = CreateEmbed({EmbedBuilder});
require('./controller/commands.js')(client, prefix, Module_Embed, Enabler, userMessages, antilink);
require('./controller/commandsUpdate.js')(client, Module_Embed, Enabler, antilink);
require('./controller/services/guildMemberAdd.js')(client, Module_Embed, Enabler, userMessages);
require('./controller/services/guildMemberUpdate.js')(client, Events, Module_Embed, Enabler, userMessages);

client.once(Events.ClientReady, (readyClient) => {
    console.log('\x1b[33m%s\x1b[0m', `${readyClient.user.username} est en ligne.`);
    Module_1.changeActivity();
});

client.login(token);
