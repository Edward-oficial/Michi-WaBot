var handler = async (m, { conn, usedPrefix }) => {
try {
const groupInfo = await conn.groupMetadata(m.chat)
if (groupInfo.announce) return conn.reply(m.chat, `> El grupo ya está cerrado.`, m)
await conn.groupSettingUpdate(m.chat, 'announcement')
await conn.reply(m.chat, `ꕥ Grupo cerrado.\n> Ahora solo los administradores pueden enviar mensajes.`, m)
} catch (e) {
conn.reply(m.chat, `⚠︎ Se ha producido un problema.\n> Usa *${usedPrefix}report* para informarlo.\n\n${e.message}`, m)
}}

handler.help = ['close']
handler.tags = ['grupo']
handler.command = ['close', 'cerrargrupo', 'cerrar']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler