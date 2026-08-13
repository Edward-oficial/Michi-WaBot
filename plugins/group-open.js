var handler = async (m, { conn, usedPrefix }) => {
try {
const groupInfo = await conn.groupMetadata(m.chat)
if (!groupInfo.announce) return conn.reply(m.chat, `> El grupo ya está abierto.`, m)
await conn.groupSettingUpdate(m.chat, 'not_announcement')
await conn.reply(m.chat, `ꕥ Grupo abierto.\n> Ahora todos los miembros pueden enviar mensajes.`, m)
} catch (e) {
conn.reply(m.chat, `⚠︎ Se ha producido un problema.\n> Usa *${usedPrefix}report* para informarlo.\n\n${e.message}`, m)
}}

handler.help = ['open']
handler.tags = ['grupo']
handler.command = ['open', 'abrirgrupo', 'abrir']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler