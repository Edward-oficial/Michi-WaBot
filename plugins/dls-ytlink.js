import fetch from 'node-fetch'

const pending = new Map()

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('» Ingresa un enlace de YouTube.')

  if (!text.includes('youtube.com') && !text.includes('youtu.be')) {
    return m.reply('» Ingresa un enlace válido de YouTube.')
  }

  try {
    const api = global.APIs.edward

    if (!api?.url || !api?.key) {
      return m.reply('> La API de Edward no está configurada.')
    }

    const res = await fetch(
      `${api.url}/api/download/ytaudio?apiKey=${api.key}&url=${encodeURIComponent(text)}`
    )

    const data = await res.json()

    if (!data?.status || !data?.result) {
      return m.reply('> No se pudo encontrar el video.')
    }

    const result = data.result

    pending.set(m.sender, {
      url: text,
      result,
      time: Date.now()
    })

    await conn.sendMessage(
      m.chat,
      {
        image: { url: result.thumbnail },
        caption: `「✦」*${result.title || 'YouTube'}*

> ⴵ Duración » *${result.duration || '-'}*

╭─〔 𝖣𝖤𝖲𝖢𝖠𝖱𝖦𝖠 〕─╮
│
│ ❶ 🎵 Audio
│ ❷ 🎬 Video
│
╰────────────────╯

> Responde con *1* o *2*`
      },
      { quoted: m }
    )

  } catch (e) {
    console.error(e)
    await m.reply(`> Error: ${e.message}`)
  }
}

handler.before = async (m, { conn }) => {
  const data = pending.get(m.sender)

  if (!data) return

  if (Date.now() - data.time > 60000) {
    pending.delete(m.sender)
    return
  }

  const option = m.text?.trim()

  if (option !== '1' && option !== '2') return

  pending.delete(m.sender)

  try {
    const api = global.APIs.edward
    const endpoint = option === '1' ? 'ytaudio' : 'ytvideo'

    await m.react('🕒')

    const res = await fetch(
      `${api.url}/api/download/${endpoint}?apiKey=${api.key}&url=${encodeURIComponent(data.url)}`
    )

    const json = await res.json()

    if (!json?.status || !json?.result?.download_url) {
      return m.reply('> No se pudo realizar la descarga.')
    }

    const result = json.result
    const title = result.title || data.result.title || 'YouTube'

    if (option === '1') {
      await conn.sendMessage(
        m.chat,
        {
          audio: { url: result.download_url },
          mimetype: 'audio/mpeg',
          fileName: `${title}.mp3`,
          ptt: false
        },
        { quoted: m }
      )
    } else {
      await conn.sendMessage(
        m.chat,
        {
          video: { url: result.download_url },
          mimetype: 'video/mp4',
          fileName: `${title}.mp4`,
          caption: `「✦」*${title}*

> ✰ Calidad » *${result.quality || '360p'}*`
        },
        { quoted: m }
      )
    }

    await m.react('✔️')

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