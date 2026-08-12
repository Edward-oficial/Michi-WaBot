import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return m.reply(`» Ingresa un texto o link de YouTube\n> *Ejemplo:* ${usedPrefix + command} ozuna`)

  try {
    const api = global.APIs.edward

    if (!api?.url || !api?.key) {
      return m.reply('> La API de Edward no está configurada.')
    }

    const searchUrl = `${api.url}/api/search/youtube?apiKey=${encodeURIComponent(api.key)}&query=${encodeURIComponent(text)}`
    const searchRes = await fetch(searchUrl)
    const search = await searchRes.json()

    if (!search?.status || !search?.data?.length) {
      return m.reply('> No se encontraron resultados.')
    }

    const results = search.data[0]

    if (command === 'play' || command === 'ytmp3') {
      const downloadUrl = `${api.url}/api/download/ytaudio?apiKey=${encodeURIComponent(api.key)}&url=${encodeURIComponent(results.url)}`
      const downloadRes = await fetch(downloadUrl)
      const api2 = await downloadRes.json()

      if (!api2?.status || !api2?.result?.download_url) {
        return m.reply('> No se pudo descargar el audio.')
      }

      const txt = `「✦」Descargando *${results.title}*

> ✐ Canal » *${results.author || '-'}*
> ⴵ Duración » *${results.duration || '-'}*
> ✰ Calidad » *Audio*
> 🜸 Link » ${results.url}`

      await conn.sendMessage(m.chat, {
        image: { url: results.thumbnail },
        caption: txt
      }, { quoted: m })

      await conn.sendMessage(m.chat, {
        audio: { url: api2.result.download_url },
        mimetype: 'audio/mpeg',
        fileName: `${results.title || 'audio'}.mp3`,
        ptt: false
      }, { quoted: m })

    } else if (command === 'play2' || command === 'ytmp4') {
      return m.reply('> La API configurada no tiene descarga de video.')
    }

  } catch (e) {
    console.error(e)
    await m.reply(`> Error: ${e.message}`)
    await m.react('✖️')
  }
}

handler.command = ['play', 'ytmp3', 'play2', 'ytmp4']
handler.help = ['play', 'ytmp3', 'play2', 'ytmp4']
handler.tags = ['descargas']

export default handler