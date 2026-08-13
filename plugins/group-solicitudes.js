const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

var handler = async (m, { conn, usedPrefix, command }) => {
  try {
    const isReject = /^(rechazarsolicitudes|rejectrequests|rechazarpendientes)$/i.test(command)

    const pending = await conn.groupRequestParticipantsList(m.chat)

    if (!pending || !pending.length)
      return conn.reply(
        m.chat,
        `> No hay solicitudes de ingreso pendientes en este grupo.`,
        m
      )

    const jids = pending.map(p => p.jid)
    const accion = isReject ? 'reject' : 'approve'

    let procesadas = []

    for (const jid of jids) {
      try {
        await conn.groupRequestParticipantsUpdate(
          m.chat,
          [jid],
          accion
        )

        procesadas.push(jid)

        await delay(1500)
      } catch (err) {
        console.error(`Error procesando ${jid}:`, err)
      }
    }

    if (!procesadas.length)
      return conn.reply(
        m.chat,
        `⚠︎ No se pudo procesar ninguna solicitud.`,
        m
      )

    const texto = isReject
      ? `ꕥ Se rechazaron *${procesadas.length}* solicitud${procesadas.length === 1 ? '' : 'es'} de ingreso.`
      : `ꕥ Se aceptaron *${procesadas.length}* solicitud${procesadas.length === 1 ? '' : 'es'} de ingreso.\n\n` +
        procesadas.map(j => `» @${j.split('@')[0]}`).join('\n')

    await conn.sendMessage(
      m.chat,
      {
        text: texto,
        mentions: isReject ? [] : procesadas
      },
      { quoted: m }
    )

  } catch (e) {
    console.error(e)

    await conn.reply(
      m.chat,
      `⚠︎ Se ha producido un problema.\n> Usa *${usedPrefix}report* para informarlo.\n\n${e.message}`,
      m
    )
  }
}

handler.help = ['aceptarsolicitudes']
handler.tags = ['grupo']

handler.command = [
  'aceptarsolicitudes',
  'acceptrequests',
  'aceptarpendientes',
  'rechazarsolicitudes',
  'rejectrequests',
  'rechazarpendientes'
]

handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler