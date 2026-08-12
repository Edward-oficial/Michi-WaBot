import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('» Ingresa un enlace de YouTube.')

  if (!text.includes('youtube.com') && !text.includes('youtu.be')) {
    return m.reply('» Enlace de YouTube inválido.')
  }

  try {
    const api = global.APIs.edward

    const res = await fetch(
      `${api.url}/api/download/ytaudio?apiKey=${api.key}&url=${encodeURIComponent(text)}`
    )

    const data = await res.json()

    if (!data?.status || !data?.result?.download_url) {
      return m.reply('> No se pudo obtener el audio.')
    }

    let info = `「✦」Descargando *${data.result.title || 'Audio'}*

> ⴵ Duración » *${data.result.duration || '-'}*`

    if (data.result.thumbnail) {
      await conn.sendMessage(m.chat, {
        image: { url: data.result.thumbnail },
        caption: info
      }, { quoted: m })
    }

    await conn.sendMessage(m.chat, {
      audio: { url: data.result.download_url },
      mimetype: 'audio/mpeg',
      fileName: `${data.result.title || 'audio'}.mp3',
      ptt: false
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply(`Error: ${e.message}`)
  }
}

handler.command = ['ytlink']
handler.help = ['ytlink']
handler.tags = ['descargas']

export default handler