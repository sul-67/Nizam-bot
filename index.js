require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once("ready", () => {
  console.log(`${client.user.tag} is online!`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content === "سلام") {
    message.reply("وعليكم السلام 🌹");
  }

  if (message.content === "بنج") {
    message.reply("🏓 Pong!");
  }
});

client.login(process.env.TOKEN);
