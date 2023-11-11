// Require the necessary discord.js classes
const {
  Client,
  Intents,
  Activity,
  ActivityType,
  createComponent,
} = require("discord.js");
const { token, prefix, giphyToken } = require("./config.json");
const { EmbedBuilder } = require("discord.js");
const giphy = require("giphy-api")(giphyToken);
// Create a new client instance
const client = new Client({
  intents: 131071,
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

function CreateCommands() {
  const commands = [
    {
      name: "ping",
      description: "Replies with Pong!",
      options: [],
    },
    {
      name: "server",
      description: "Replies with server info!",
      options: [],
    },
    {
      name: "user",
      description: "Replies with user info!",
      options: [
        {
          name: "target",
          description: "The user you want to get info on",
          type: 6,
          required: false,
        },
      ],
    },
  ];
  return commands;
}

// function for deleting all commands
async function DeleteCommands() {
  const commands = await client.application.commands.fetch();
  commands.forEach((command) => {
    console.log(`Deleting command ${command.id}`);
    // delete the command with the specified id
    client.application.commands.delete(command.id);
  });
}

// function for printing all commands
function printCommands() {
  const commands = client.application.commands.fetch().then(console.log);
}

// print all active types
// console.log(ActivityType);
// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log(`Ready! Logged in as ${client.user.tag}`);
  console.log(`bot is in ${client.guilds.cache.size} servers`);
  client.user.setActivity("with JavaScript", { type: 0 });
  //   CreateCommands().forEach((command) => {
  //     client.guilds.cache.forEach((guild) => {
  //       guild.commands
  //         .create(command)
  //         .then((cmd) => console.log(`Created command ${cmd.id}`))
  //         .catch(console.error);
  //     });
  //   });

  DeleteCommands();
  printCommands();
});

client.on("messageCreate", (message) => {
  // Ignore messages that don't start with the prefix or are from bots
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  // Separate the command and the arguments
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    // Send "Pong!" to the same channel
    message.channel.send("Pong!");
  }

  // When a message is /meme created, send a meme
  if (command === "randommeme") {
    giphy.random("meme", (err, res) => {
      if (err) {
        console.error(err);
        return;
      }
      // Log the entire Giphy API response
      //   console.log(res);
      // Check if res.data.images.original.url exists before trying to send it
      if (
        res.data.images &&
        res.data.images.original &&
        res.data.images.original.url
      ) {
        message.channel.send(res.data.images.original.url);
      } else {
        console.error("No image URL found in the Giphy response");
      }
    });
  }

  if (command === "hi") {
    const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Some title")
      .setURL("https://discord.js.org/")
      .setAuthor({
        name: "Some name",
        iconURL: "https://i.imgur.com/AfFp7pu.png",
        url: "https://discord.js.org",
      })
      .setDescription("Some description here")
      .setThumbnail("https://i.imgur.com/AfFp7pu.png")
      .addFields(
        { name: "Regular field title", value: "Some value here" },
        { name: "\u200B", value: "\u200B" },
        { name: "Inline field title", value: "Some value here", inline: true },
        { name: "Inline field title", value: "Some value here", inline: true }
      )
      .addFields({
        name: "Inline field title",
        value: "Some value here",
        inline: true,
      })
      .setImage("https://i.imgur.com/AfFp7pu.png")
      .setTimestamp()
      .setFooter({
        text: "Some footer text here",
        iconURL: "https://i.imgur.com/AfFp7pu.png",
      });

    message.reply({ embeds: [exampleEmbed] });
  }

  // If the command is "setting", change the state of the feature
  if (command === "setting") {
    if (args.length > 0) {
      // Get the setting name from the first argument
      const setting = args.shift().toLowerCase();
      if (setting === "on") {
        featureEnabled = true;
        message.channel.send("Feature has been turned on.");
      } else if (setting === "off") {
        featureEnabled = false;
        message.channel.send("Feature has been turned off.");
      } else {
        message.channel.send(
          "Invalid setting. Please use either 'on' or 'off'."
        );
      }
    } else {
      message.channel.send("Please provide a setting ('on' or 'off').");
    }
  }

  if (command === "meme") {
    const query = message.content.slice(prefix.length + command.length).trim();
    giphy.search(query, (err, res) => {
      if (err) {
        console.error(err);
        return;
      }
      // Check if res.data[0].images.original.url exists before trying to send it
      if (
        res.data.length > 0 &&
        res.data[0].images &&
        res.data[0].images.original &&
        res.data[0].images.original.url
      ) {
        message.channel.send(res.data[0].images.original.url);
      } else {
        console.error("No memes found for the given description");
      }
    });
  }
});

// interactionCreate will fire when a user uses a slash command
// => get user info
client.on("interactionCreate", async (interaction) => {
  // If the interaction is a command
  if (interaction.isCommand()) {
    // If the command is "user"
    if (interaction.commandName === "user") {
      // Get the target user
      const target = interaction.options.getUser("target") || interaction.user;

      // Create a reply
      const reply = `User info:
                Username: ${target.username}
                Discriminator: ${target.discriminator}
                ID: ${target.id}`;

      // Reply to the interaction
      interaction.reply(reply);
    }

    // Handle other commands...
  }
});

client.on("interactionCreate", async (interaction) => {
  // If the interaction is a command
  if (interaction.isCommand()) {
    // If the command is "ping"
    if (interaction.commandName === "ping") {
      // Reply with "Pong!"
      interaction.reply("Pong!");
    }

    // Handle other commands...
  }
});

// When a message is deleted, log it to the console
client.on("messageDelete", (message) => {
  console.log(`A message was deleted: ${message.content}`);
  // You can't reply to a deleted message, but you can send a message to the same channel
  message.channel.send("Why did you delete that? 💀");
});

// Log in to Discord with your client's token
client.login(token);
