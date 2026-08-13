var handler = async (m, { conn, usedPrefix, command, args }) => {
try {
const isReject = /^(rechazarsolicitudes|rejectrequests|rechazarpendientes)$/i.test(command)

const pending = await conn.groupRequestParticipantsList(m.chat)
if (!pending || !pending.length)
return conn.reply(m.chat, `> No hay solicitudes de ingreso pendientes en este grupo.`, m)

const jids = pending.map(p => p.jid)
await conn.groupRequestParticipantsUpdate(m.chat, jids, isReject ? 'reject' : 'approve')

const texto = isReject
? `ꕥ Se rechazaron *${jids.length}* solicitud${jids.length === 1 ? '' : 'es'} de ingreso.`
: `ꕥ Se aceptaron *${jids.length}* solicitud${jids.length === 1 ? '' : 'es'} de ingreso.\n\n` +
jids.map(j => `» @${j.split('@')[0]}`).join('\n')

await conn.sendMessage(m.chat, { text: texto, mentions: isReject ? [] : jids }, { quoted: m })
} catch (e) {
conn.reply(m.chat, `⚠︎ Se ha producido un problema.\n> Usa *${usedPrefix}report* para informarlo.\n\n${e.message}`, m)
}}

handler.help = ['aceptarsolicitudes']
handler.tags = ['grupo']
handler.command = ['aceptarsolicitudes', 'acceptrequests', 'aceptarpendientes', 'rechazarsolicitudes', 'rejectrequests', 'rechazarpendientes']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler