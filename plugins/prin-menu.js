import moment from "moment-timezone"
import fs from "fs"
import path from "path"

const catalogoPath = path.join('./lib', 'catalogo.jpg')
const channelLink = "https://whatsapp.com/channel/0029VbAwDX6CcW4sC2JfXw2L"

let handler = async (m, { conn, usedPrefix }) => {
  try {
    let menu = {}
    for (let plugin of Object.values(global.plugins)) {
      if (!plugin || !plugin.help) continue
      let taglist = plugin.tags || []
      for (let tag of taglist) {
        if (!menu[tag]) menu[tag] = []
        menu[tag].push(plugin)
      }
    }

    let uptimeSec = process.uptime()
    let hours = Math.floor(uptimeSec / 3600)
    let minutes = Math.floor((uptimeSec % 3600) / 60)
    let seconds = Math.floor(uptimeSec % 60)
    let uptimeStr = `${hours}h ${minutes}m ${seconds}s`

    let botNameToShow = global.botname || ""
    let videoUrl = null

    const senderBotNumber = conn.user.jid.split('@')[0]
    const configPath = path.join('./Sessions/SubBot', senderBotNumber, 'config.json')
    if (fs.existsSync(configPath)) {
      try {
        const subBotConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
        if (subBotConfig.name) botNameToShow = subBotConfig.name
        if (subBotConfig.video) videoUrl = subBotConfig.video
      } catch (e) { console.error(e) }
    }

    let mention = `@${m.sender.split('@')[0]}`

    let txt = `> .・。.・゜〄・.・〄・゜・。.\n` +
      `> Hola *${mention}* soy *${botNameToShow}*, bienvenidx a mi menú.\n` +
      `⊹ *Hora* » ${moment.tz("America/Tegucigalpa").format("HH:mm:ss")}\n` +
      `⊹ *Fecha* » ${moment.tz("America/Tegucigalpa").format("DD/MM/YYYY")}\n\n`

    for (let tag in menu) {
      txt += `➭ *✿》${tag.toUpperCase()}《✿*\n`
      for (let plugin of menu[tag]) {
        let [mainCmd, ...aliases] = plugin.help
        let aliasStr = aliases.length
          ? ` _(${aliases.slice(0, 2).join(', ')})_`
          : ''
        txt += `> ⟩ *${usedPrefix}${mainCmd}*${aliasStr}\n`
      }
      txt += `\n`
    }

    txt += `> : *Actividad* » ${uptimeStr}`

    // Resolver el link del canal a su JID real
    let channelContext = {}
    try {
      const inviteCode = channelLink.split('/channel/')[1]
      const meta = await conn.newsletterMetadata("invite", inviteCode)
      if (meta?.id) {
        channelContext = {
          contextInfo: {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: meta.id,
              newsletterName: meta.name || botNameToShow,
              serverMessageId: 100
            }
          }
        }
      }
    } catch (e) {
      console.error("No se pudo resolver el canal:", e)
    }

    if (videoUrl) {
      await conn.sendMessage(
        m.chat,
        {
          video: { url: videoUrl },
          caption: txt,
          gifPlayback: false,
          mentions: [m.sender],
          ...channelContext
        },
        { quoted: m }
      )
    } else if (fs.existsSync(catalogoPath)) {
      await conn.sendMessage(
        m.chat,
        {
          image: fs.readFileSync(catalogoPath),
          caption: txt,
          mentions: [m.sender],
          ...channelContext
        },
        { quoted: m }
      )
    } else {
      await conn.sendMessage(
        m.chat,
        { text: txt, mentions: [m.sender], ...channelContext },
        { quoted: m }
      )
    }

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, "» Ocurrió un error.", m)
  }
}

handler.command = ['help', 'menu']
export default handler