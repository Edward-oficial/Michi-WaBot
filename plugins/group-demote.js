var handler = async (m, { conn, usedPrefix, command, text, groupMetadata, isAdmin }) => {
let mentionedJid = await m.mentionedJid
let user = mentionedJid && mentionedJid.length ? mentionedJid[0] : m.quoted && await m.quoted.sender ? await m.quoted.sender : null
if (!user) return conn.reply(m.chat, `✎ Debes mencionar a un usuario para poder quitarle la administración.`, m)
try {
const groupInfo = await conn.groupMetadata(m.chat)
const ownerGroup = groupInfo.owner || m.chat.split('-')[0] + '@s.whatsapp.net'
if (user === ownerGroup)
return conn.reply(m.chat, '> No puedo quitarle la administración al propietario del grupo.', m)
if (!groupInfo.participants.some(p => p.id === user && p.admin))
return conn.reply(m.chat, '> El usuario mencionado no es administrador.', m)
await conn.groupParticipantsUpdate(m.chat, [user], 'demote')
await conn.reply(m.chat, `ꕥ Se le quitó la administración con éxito.`, m)
} catch (e) {
conn.reply(m.chat, `⚠︎ Se ha producido un problema.\n> Usa *${usedPrefix}report* para informarlo.\n\n${e.message}`, m)
}}

handler.help = ['demote']
handler.tags = ['grupo']
handler.command = ['demote', 'degradar']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler