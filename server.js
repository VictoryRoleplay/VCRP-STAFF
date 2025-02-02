require("dotenv").config();
const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

client.login(process.env.TOKEN).then(() => {
    console.log("✅ Discord bot je online!");
}).catch(error => {
    console.error("❌ Chyba pri prihlasovaní bota:", error);
});

// Endpoint na získanie členov servera
app.get("/members", async (req, res) => {
    try {
        const guild = await client.guilds.fetch(process.env.GUILD_ID);
        const members = await guild.members.fetch();
        
        // Zoznam len vybraných členov podľa ID (nahradiť vlastnými)
        const allowedMembers = [
            "1165176512413192234", // ID prvého člena
            "839381964204146698", // ID druhého člena
            "1143504033085136918",  // ID tretieho člena
        ];

        const memberList = members
            .filter(member => allowedMembers.includes(member.user.id)) 
            .map(member => ({
                username: member.user.username,
                avatar: member.user.displayAvatarURL(),
                roles: member.roles.cache.map(role => role.name)
            }));

        res.json(memberList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Spustenie servera
app.listen(PORT, () => {
    console.log(`✅ Server beží na http://localhost:${PORT}`);
});
