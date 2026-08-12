import moment from "moment-timezone"
import fs from "fs"
import path from "path"

const catalogoPath = path.join('./lib', 'catalogo.jpg')

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
      `> ⊹ *Hora* » ${moment.tz("America/Tegucigalpa").format("HH:mm:ss")}\n` +
      `> ⊹ *Fecha* » ${moment.tz("America/Tegucigalpa").format("DD/MM/YYYY")}\n\n`

    for (let tag in menu) {
      txt += `➭ *✿》${tag.toUpperCase()}《✿*\n`
      for (let plugin of menu[tag]) {
        for (let cmd of plugin.help) {
          txt += `> ⟩ *${usedPrefix}${cmd}*\n`
        }
      }
      txt += `\n`
    }

    txt += `> : *Actividad* » ${uptimeStr}`

    if (videoUrl) {
      await conn.sendMessage(
        m.chat,
        {
          video: { url: videoUrl },
          caption: txt,
          gifPlayback: false,
          mentions: [m.sender]
        },
        { quoted: m }
      )
    } else if (fs.existsSync(catalogoPath)) {
      await conn.sendMessage(
        m.chat,
        {
          image: fs.readFileSync(catalogoPath),
          caption: txt,
          mentions: [m.sender]
        },
        { quoted: m }
      )
    } else {
      await conn.sendMessage(
        m.chat,
        { text: txt, mentions: [m.sender] },
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
