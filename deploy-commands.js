const commands = [
  new SlashCommandBuilder()
    .setName("اسكت")
    .setDescription("إسكات عضو لمدة محددة")
    .addUserOption(o =>
      o.setName("العضو").setDescription("العضو").setRequired(true)
    )
    .addStringOption(o =>
      o.setName("المدة").setDescription("مثال: 10m 1h 2d").setRequired(true)
    )
    .addStringOption(o =>
      o.setName("السبب").setDescription("سبب الإسكات")
    )
    .toJSON(),

  new SlashCommandBuilder()
    .setName("فك")
    .setDescription("فك الإسكات عن عضو")
    .addUserOption(o =>
      o.setName("العضو").setDescription("العضو").setRequired(true)
    )
    .toJSON(),

  if (interaction.commandName === "تحذير") {
  const member = interaction.options.getMember("العضو");

  if (!member) {
    return interaction.reply({ content: "ما لقيت العضو", ephemeral: true });
  }

  const id = member.id;
  const count = (warnings.get(id) || 0) + 1;
  warnings.set(id, count);

  const muteRole = interaction.guild.roles.cache.find(r => r.name === "Muted");

  // ================= التحذير الأول =================
  if (count === 1) {
    return interaction.reply(
      `⚠️ ${member} انتبه لا تعيدها`
    );
  }

  // ================= التحذير الثاني =================
  if (count >= 2) {
    warnings.set(id, 0);

    if (muteRole) {
      await member.roles.add(muteRole);
    }

    await interaction.reply(
      `🔇 ${member} تم إسكاتك بسبب تكرار المخالفة`
    );

    // منشن عام للسيرفر
    await interaction.channel.send(
      `🚨 ${member} عضه وعبره لمن لا يتعض أو يعتبر`
    );
  }
}
