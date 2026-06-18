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

// ================= تحذيرات =================
const warnings = new Map();

function parseDuration(input) {
  const match = input.match(/^(\d+)(s|m|h|d)$/);
  if (!match) return null;

  const value = parseInt(match[1]);
  const unit = match[2];

  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return value * multipliers[unit];
}

// ================= جاهز =================
client.once("ready", () => {
  console.log(`${client.user.tag} is online!`);
});

// ================= ردود الرسائل =================
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content === "السلام عليكم ") {
    message.reply("وعليكم السلام");
  }

  if (message.content === "بنج") {
    message.reply("🏓 Pong!");
  }
});

// ================= الأوامر =================
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // ================= اسكت =================
  if (interaction.commandName === "اسكت") {
    const member = interaction.options.getMember("العضو");
    const duration = interaction.options.getString("المدة");
    const reason = interaction.options.getString("السبب") || "بدون سبب";

    const time = parseDuration(duration);

    if (!time) {
      return interaction.reply({ content: "صيغة المدة خطأ", ephemeral: true });
    }

    const muteRole = interaction.guild.roles.cache.find(r => r.name === "Muted");

    if (!muteRole) {
      return interaction.reply({ content: "سوي رتبة Muted أول", ephemeral: true });
    }

    await member.roles.add(muteRole, reason);
    await interaction.reply(`تم إسكات ${member.user.username} لمدة ${duration}`);

    setTimeout(async () => {
      await member.roles.remove(muteRole).catch(() => {});
    }, time);
  }

  // ================= فك =================
  if (interaction.commandName === "فك") {
    const member = interaction.options.getMember("العضو");
    const muteRole = interaction.guild.roles.cache.find(r => r.name === "Muted");

    if (!member || !muteRole) {
      return interaction.reply({ content: "خطأ في البيانات", ephemeral: true });
    }

    await member.roles.remove(muteRole).catch(() => {});
    return interaction.reply(`تم فك الإسكات عن ${member.user.username}`);
  }

  // ================= تحذير =================
  if (interaction.commandName === "تحذير") {
    const member = interaction.options.getMember("العضو");
    const reason = interaction.options.getString("السبب");

    if (!member) {
      return interaction.reply({ content: "ما لقيت العضو", ephemeral: true });
    }

    const id = member.id;

    const count = (warnings.get(id) || 0) + 1;
    warnings.set(id, count);

    await interaction.reply(
      `⚠️ تم تحذير ${member.user.username}\nالسبب: ${reason}\nعدد التحذيرات: ${count}`
    );

    // لو وصل 3 تحذيرات نسوي ميوت تلقائي
    if (count >= 3) {
      const muteRole = interaction.guild.roles.cache.find(r => r.name === "Muted");
      if (muteRole) {
        await member.roles.add(muteRole);
        warnings.set(id, 0);
      }
    }
  }
});

// ================= تشغيل البوت =================
client.login(process.env.TOKEN);
