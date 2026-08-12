import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('» Ingresa un enlace de YouTube.')

  if (!text.includes('youtube.com') && !text.includes('youtu.be')) {
    return m.reply('» Enlace de YouTube inválido.')
  }

  try {
    const api = global.APIs.edward

    if (!api) return m.reply('> La API de Edward no está configurada.')

    const res = await fetch(
      `${api.url}/api/download/ytaudio?apiKey=${api.key}&url=${encodeURIComponent(text)}`
    )

    const data = await res.json()

    if (!data?.status || !data?.result?.download_url) {
      return m.reply('> No se pudo obtener el audio.')
    }

    const title = data.result.title || 'Audio'
    const duration = data.result.duration || '-'
    const thumbnail = data.result.thumbnail
    const download = data.result.download_url

    const caption = `「✦」Descargando *${title}*

> ⴵ Duración » *${duration}*`

    if (thumbnail) {
      await conn.sendMessage(
        m.chat,
        {
          image: { url: thumbnail },
          caption
        },
        { quoted: m }
      )
    } else {
      await m.reply(caption)
    }

    await conn.sendMessage(
      m.chat,
      {
        audio: { url: download },
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`,
        ptt: false
      },
      { quoted: m }
    )

  } catch (e) {
    console.error(e)
    await m.reply(`> Error: ${e.message}`)
  }
}

handler.command = ['ytlink']
handler.help = ['ytlink']
handler.tags = ['descargas']

export default handler