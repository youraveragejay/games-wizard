const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { truth, dare } = require("truth-or-dare");
const { botColor } = require("../data/config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("truth")
    .setDescription(
      "Gives a random question that has to be answered truthfully"
    )
    .addStringOption((option) =>
      option
        .setName("rating")
        .setDescription("The truth's rating")
        .addChoices(
          { name: "PG", value: "PG" },
          { name: "PG13", value: "PG13" },
          { name: "R", value: "R" }
        )
    )
    .setDMPermission(false),
  async execute(interaction) {
    interaction.deferReply();
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("truth")
          .setLabel("Truth")
          .setStyle(ButtonStyle.Success)
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId("dare")
          .setLabel("Dare")
          .setStyle(ButtonStyle.Danger)
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId("random")
          .setLabel("Random")
          .setStyle(ButtonStyle.Primary)
      );

    let res;

    if (interaction.options.getString("rating")) {
      res = await truth(`${interaction.options.getString("rating")}`);
    } else {
      res = await truth();
    }

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `Requested by ${interaction.user.tag}`,
        iconURL: `${interaction.user.avatarURL()}`,
      })
      .setTitle(`${res.question}`)
      .setColor(botColor)
      .setDescription(
        `Type: ${res.type} | Rating: ${res.rating} | ID: ${res.id}`
      );

    var message = await interaction.followUp({
      embeds: [embed],
      components: [row],
      fetchReply: true,
    });
    const filter = (i) => i.message.author.id === interaction.client.user.id;

    const collector = message.channel.createMessageComponentCollector({
      filter,
      time: "300000",
    });

    collector.on("collect", async (i) => {
      await i.deferUpdate();
      let newEmbed;
      let res;

      switch (i.customId) {
        case "truth":
          res = await truth();
          newEmbed = new EmbedBuilder()
            .setAuthor({
              name: `Requested by ${i.user.tag}`,
              iconURL: `${i.user.avatarURL()}`,
            })
            .setTitle(`${res.question}`)
            .setColor(botColor)
            .setDescription(
              `Type: ${res.type} | Rating: ${res.rating} | ID: ${res.id}`
            );
          message.edit({ components: [] });
          message = await i.message.reply({
            embeds: [newEmbed],
            components: [row],
            fetchReply: true,
          });
          break;
        case "dare":
          res = await dare();
          newEmbed = new EmbedBuilder()
            .setAuthor({
              name: `Requested by ${i.user.tag}`,
              iconURL: `${i.user.avatarURL()}`,
            })
            .setTitle(`${res.question}`)
            .setColor(botColor)
            .setDescription(
              `Type: ${res.type} | Rating: ${res.rating} | ID: ${res.id}`
            );
          message.edit({ components: [] });
          message = await i.message.reply({
            embeds: [newEmbed],
            components: [row],
            fetchReply: true,
          });
          break;
        case "random":
          let num = getRandomInt(2);

          if (num === 0) {
            res = await truth();
          } else if (num === 1) {
            res = await dare();
          }
          newEmbed = new EmbedBuilder()
            .setAuthor({
              name: `Requested by ${i.user.tag}`,
              iconURL: `${i.user.avatarURL()}`,
            })
            .setTitle(`${res.question}`)
            .setColor(botColor)
            .setDescription(
              `Type: ${res.type} | Rating: ${res.rating} | ID: ${res.id}`
            );
          message.edit({ components: [] });
          message = await i.message.reply({
            embeds: [newEmbed],
            components: [row],
            fetchReply: true,
          });
          break;
      }
    });
  },
};
