import fs from "fs"
import path from "path"
import ws from "ws"

const handler = async (m, { conn, usedPrefix, participants }) => {
  try {
    const users = [
      global.conn.user.jid,
      ...new Set(
        global.conns
          .filter(
            (conn) =>
              conn.user &&
              conn.ws.socket &&
              conn.ws.socket.readyState !== ws.CLOSED
          )
          .map((conn) => conn.user.jid)
      )
    ]

    function convertirMsADiasHorasMinutosSegundos(ms) {
      const segundos = Math.floor(ms / 1000)
      const minutos = Math.floor(segundos / 60)
      const horas = Math.floor(minutos / 60)
      const dias = Math.floor(horas / 24)

      const segRest = segundos % 60
      const minRest = minutos % 60
      const horasRest = horas % 24

      let resultado = ""

      if (dias) resultado += `${dias}d `
      if (horasRest) resultado += `${horasRest}h `
      if (minRest) resultado += `${minRest}m `
      if (segRest) resultado += `${segRest}s`

      return resultado.trim() || "0s"
    }

    // Bots que están actualmente en el grupo
    let groupBots = users.filter((bot) =>
      participants.some((p) => p.id === bot)
    )

    // Agregar el bot principal si está en el grupo
    if (
      participants.some((p) => p.id === global.conn.user.jid) &&
      !groupBots.includes(global.conn.user.jid)
    ) {
      groupBots.push(global.conn.user.jid)
    }

    let customSubs = 0

    // Crear filas de la tabla
    const rows = groupBots.map((bot, index) => {
      const isMainBot = bot === global.conn.user.jid

      const v = global.conns.find(
        (conn) => conn.user?.jid === bot
      )

      const uptime = isMainBot
        ? convertirMsADiasHorasMinutosSegundos(
            Date.now() - global.conn.uptime
          )
        : v?.uptime
          ? convertirMsADiasHorasMinutosSegundos(
              Date.now() - v.uptime
            )
          : "Activo desde ahora"

      const mention = bot.replace(/[^0-9]/g, "")

      const botPath = path.join("./Sessions/SubBot", mention)
      const configPath = path.join(botPath, "config.json")

      let isCustom = false

      if (fs.existsSync(configPath)) {
        isCustom = true

        if (!isMainBot) {
          customSubs++
        }
      }

      const tipo = isMainBot
        ? "Principal"
        : isCustom
          ? "Sub-Bot Personal"
          : "Sub-Bot"

      return [
        `${index + 1}`,
        `@${mention}`,
        tipo,
        "Online",
        uptime
      ]
    })

    // Estadísticas
    const totalSubs = Math.max(users.length - 1, 0)

    const mentionList = groupBots.map((bot) =>
      bot.endsWith("@s.whatsapp.net")
        ? bot
        : `${bot}@s.whatsapp.net`
    )

    // Contexto para las menciones
    const tableOptions = {
      headerText: "✦ Lista de bots activos",
      footer:
        `Principal: 1 | ` +
        `Subs totales: ${totalSubs} | ` +
        `Personalizados: ${customSubs} | ` +
        `En este grupo: ${groupBots.length}`
    }

    // Enviar tabla
    await conn.sendTable(
      m.chat,
      "Bots conectados actualmente:",
      ["#", "Número", "Tipo", "Estado", "Uptime"],
      rows,
      m,
      tableOptions
    )

    // Menciones
    if (mentionList.length) {
      await conn.sendMessage(
        m.chat,
        {
          text: mentionList.map((j) => `@${j.split("@")[0]}`).join(" "),
          mentions: mentionList
        },
        { quoted: m }
      )
    }

  } catch (error) {
    m.reply(
      `⚠︎ Se ha producido un problema.\n` +
      `> Usa *${usedPrefix}report* para informarlo.\n\n` +
      `${error.message}`
    )
  }
}

handler.tags = ["serbot"]
handler.help = ["botlist"]
handler.command = [
  "botlist",
  "listbots",
  "listbot",
  "bots",
  "sockets",
  "socket"
]

export default handler