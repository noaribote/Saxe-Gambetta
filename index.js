const { Client, GatewayIntentBits, EmbedBuilder, ActivityType, MessageManager, Collection, Events } = require("discord.js");
const { token, prefix } = require('./config/essential.json');

const userMessages = new Map();
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

let activityIndex = 0;
const activities = [
    { name: "www.noaribote.fr", type: ActivityType.Watching, status: "dnd" },
    { name: (client) => `${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} members`, type: ActivityType.Watching }
];

client.once(Events.ClientReady, (readyClient) => {
    console.log('\x1b[33m%s\x1b[0m', `BOT ${readyClient.user.tag} en ligne.`);
    changeActivity();
});

function changeActivity() {
    const activity = activities[activityIndex];
    if (typeof activity.name === 'function') {
        client.user.setActivity(activity.name(client), { type: activity.type, status: activity.status, url: activity.url });
    } else {
        client.user.setActivity(activity.name, { type: activity.type, status: activity.status, url: activity.url });
    }

    activityIndex = (activityIndex + 1) % activities.length;
    setTimeout(changeActivity, 5000);
}

client.login(token);

