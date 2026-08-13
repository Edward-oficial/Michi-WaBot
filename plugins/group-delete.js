var handler = async (m, { conn, usedPrefix, isAdmin, isBotAdmin }) => {
try {
if (!m.quoted) return conn.reply(m.chat, `✎ Debes responder al mensaje que quieres eliminar.`, m)

const quotedSender = await m.quoted.sender
const isOwnMessage = quotedSender === conn.user.jid

if (!isOwnMessage && m.isGroup && !isAdmin)
return conn.reply(m.chat, `> Solo un administrador puede eliminar mensajes de otras personas.`, m)

if (!isOwnMessage && m.isGroup && !isBotAdmin)
return conn.reply(m.chat, `> Debo ser administrador del grupo para eliminar mensajes de otras personas.`, m)

await conn.sendMessage(m.chat, {
delete: {
remoteJid: m.chat,
fromMe: isOwnMessage,
id: m.quoted.id,
participant: isOwnMessage ? undefined : quotedSender
}
})
} catch (e) {
conn.reply(m.chat, `⚠︎ Se ha producido un problema.\n> Usa *${usedPrefix}report* para informarlo.\n\n${e.message}`, m)
}}

handler.help = ['delete']
handler.tags = ['grupo']
handler.command = ['delete', 'del', 'borrar', 'eliminar']

export default handler