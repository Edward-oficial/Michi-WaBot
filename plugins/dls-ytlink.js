import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('» Ingresa un enlace de YouTube.')

  if (!/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(text)) {
    return m.reply('» El enlace no parece ser válido.')
  }

  try {
    const api = global.APIs.edward

    if (!api?.url || !api?.key) {
      return m.reply('> La API de Edward no está configurada.')
    }

    const searchUrl = `${api.url}/api/search/youtube?apiKey=${encodeURIComponent(api.key)}&query=${encodeURIComponent(text)}`
    const searchRes = await fetch(searchUrl)
    const search = await searchRes.json()

    if (!search?.status || !search?.data?.length) {
      return m.reply('> No se encontró el video.')
    }

    const results = search.data[0]

    const downloadUrl = `${api.url}/api/download/ytaudio?apiKey=${encodeURIComponent(api.key)}&url=${encodeURIComponent(results.url || text)}`
    const downloadRes = await fetch(downloadUrl)
    const data = await downloadRes.json()

    if (!data?.status || !data?.result?.download_url) {
      return m.reply('> No se pudo descargar el audio.')
    }

    const caption = `「✦」Descargando *${results.title || 'Audio'}*

> ✐ Canal » *${results.author || '-'}*
> ⴵ Duración » *${results.duration || '-'}*
> 🜸 Link » ${results.url || text}`

    await conn.sendMessage(m.chat, {
      image: { url: results.thumbnail },
      caption
    }, { quoted: m })

    await conn.sendMessage(m.chat, {
      audio: { url: data.result.download_url },
      mimetype: 'audio/mpeg',
      fileName: `${results.title || 'audio'}.mp3`,
      ptt: false
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    await m.reply(`> Error: ${e.message}`)
    await m.react('✖️')
  }
}

handler.command = ['ytlink']
handler.help = ['ytlink']
handler.tags = ['descargas']

export default handler