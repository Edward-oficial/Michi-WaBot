import { WAMessageStubType } from 'baileysxz'

async function generarBienvenida({ conn, userId, groupMetadata, chat }) {
  const username = `@${userId.split('@')[0]}`
  const pp = await conn.profilePictureUrl(userId, 'image').catch(() => 
    'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg'
  )
  const fecha = new Date().toLocaleDateString("es-ES", {
    timeZone: "America/Mexico_City",
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  const groupSize = groupMetadata.participants.length + 1
  const desc = groupMetadata.desc?.toString() || 'Sin descripción'
  const mensaje = (chat.sWelcome || 'Edita con el comando "setwelcome"')
    .replace(/{usuario}/g, `${username}`)
    .replace(/{grupo}/g, `*${groupMetadata.subject}*`)
    .replace(/{desc}/g, `${desc}`)

  const caption = `ꕤ \`Bienvenida\` ꕤ\n\n✐ *Hola* ${username}\n⊹ Te damos la bienvenida a *${groupMetadata.subject}*\n⊹ ${mensaje}\n⊹ ${desc}\n✦ Ahora somos *${groupSize}* miembros\nꕥ Fecha » ${fecha}\n\n> \`Esperamos que disfrutes tu estadía 🤍\``
  return { pp, caption, mentions: [userId] }
}

async function generarDespedida({ conn, userId, groupMetadata, chat }) {
  const username = `@${userId.split('@')[0]}`
  const pp = await conn.profilePictureUrl(userId, 'image').catch(() => 
    'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg'
  )
  const fecha = new Date().toLocaleDateString("es-ES", {
    timeZone: "America/Mexico_City",
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  const groupSize = groupMetadata.participants.length - 1
  const desc = groupMetadata.desc?.toString() || 'Sin descripción'
  const mensaje = (chat.sBye || 'Edita con el comando "setbye"')
    .replace(/{usuario}/g, `${username}`)
    .replace(/{grupo}/g, `${groupMetadata.subject}`)
    .replace(/{desc}/g, `*${desc}*`)

  const caption = `ꕤ \`Despedida\` ꕤ\n\n✐ ${username} *ha salido del grupo*\n⊹ Grupo » *${groupMetadata.subject}*\n⊹ ${mensaje}\n⊹ ${desc}\n✦ Ahora somos *${groupSize}* miembros\nꕥ Fecha » ${fecha}\n\n> \`Te esperamos pronto 🤍\``
  return { pp, caption, mentions: [userId] }
}

let handler = m => m
handler.before = async function (m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0

  const primaryBot = global.db.data.chats[m.chat].primaryBot
  if (primaryBot && conn.user.jid !== primaryBot) throw !1

  const chat = global.db.data.chats[m.chat]
  const userId = m.messageStubParameters[0]
  const canal = global.rcanal || { contextInfo: {} }

  if (chat.welcome && m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_ADD) {
    const { pp, caption, mentions } = await generarBienvenida({ conn, userId, groupMetadata, chat })
    canal.contextInfo.mentionedJid = mentions
    await conn.sendMessage(m.chat, { image: { url: pp }, caption, ...canal }, { quoted: null })
  }

  if (chat.welcome && (
    m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_REMOVE ||
    m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_LEAVE
  )) {
    const { pp, caption, mentions } = await generarDespedida({ conn, userId, groupMetadata, chat })
    canal.contextInfo.mentionedJid = mentions
    await conn.sendMessage(m.chat, { image: { url: pp }, caption, ...canal }, { quoted: null })
  }
}

export { generarBienvenida, generarDespedida }
export default handler
