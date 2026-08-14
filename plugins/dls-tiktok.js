import fetch from 'node-fetch'

var handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `❐ Por favor ingresa el enlace del TikTok.`, m)
  try {
    await m.react('🕒')

    const res = await tiktokdl(text)
    if (!res?.data) throw new Error('No se pudo obtener la información del TikTok.')

    const { title, author, play, music, play_count, comment_count, share_count, digg_count } = res.data
    const canal = author?.nickname || author?.unique_id || 'Desconocido'

    const caption = `「✦」TikTok Descargado\n\n` +
                    `> ✐ Título » *${title || 'Sin título'}*\n` +
                    `> ✐ Canal » *${canal}*\n` +
                    `> ✐ Likes » *${digg_count || 0}*\n` +
                    `> ✐ Comentarios » *${comment_count || 0}*\n` +
                    `> ✐ Compartidos » *${share_count || 0}*\n` +
                    `> ✐ Vistas » *${play_count || 0}*\n` +
                    `> ✐ Link » ${text}`

    await conn.sendMessage(m.chat, { video: { url: play }, caption }, { quoted: m })

    if (music) {
      await conn.sendMessage(m.chat, { audio: { url: music }, fileName: `${title || 'tiktok'}.mp3`, mimetype: 'audio/mpeg' }, { quoted: m })
    }

    await m.react('✔️')
  } catch (error) {
    await m.react('✖️')
    return conn.reply(m.chat, `⚠︎ Ocurrió un error.\n> Usa *${usedPrefix}report* para informarlo.\n\n${error.message || error}`, m)
  }
}

handler.tags = ['descargas']
handler.help = ['tiktok']
handler.command = ['tiktok', 'tt']
handler.group = true

export default handler

async function tiktokdl(url) {
  const tikwm = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`
  const response = await (await fetch(tikwm, { signal: AbortSignal.timeout(20000) })).json()
  return response
           }
