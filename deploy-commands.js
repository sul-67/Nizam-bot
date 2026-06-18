require("dotenv").config();

const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const commands = [
  new SlashCommandBuilder()
    .setName("اسكت")
    .setDescription("إسكات عضو لمدة محددة")
    .addUserOption(option =>
      option
        .setName("العضو")
        .setDescription("العضو المراد إسكاته")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("المدة")
        .setDescription("مثال: 10m أو 1h أو 2d")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("السبب")
        .setDescription("سبب الإسكات")
        .setRequired(false)
    )
    .toJSON(),
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log("تم تسجيل الأوامر");
  } catch (error) {
    console.error(error);
  }
})();
