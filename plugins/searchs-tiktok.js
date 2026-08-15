import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix }) => {
  if (!text) return conn.reply(m.chat, '✐ Por favor, ingresa un término de búsqueda de TikTok.', m);

  try {
    await m.react('🕒');

    const apikey = 'dvyer222083176577';
    const limit = 10;
    const searchUrl = `https://dv-yer-api.online/tiktok/search?q=${encodeURIComponent(text)}&limit=${limit}&apikey=${apikey}`;

    const res = await fetch(searchUrl);
    const json = await res.json();

    const rawItems = json?.results || [];

    const valid = rawItems.map(v => {
      const videoUrl = v.stream_url || v.download_url || v.links?.stream || v.links?.download;
      const title = v.title || v.description || 'Video TikTok';
      const authorName = v.author || v.username || 'Desconocido';
      const duration = v.duration_seconds || 'No disponible';

      return {
        url: videoUrl,
        title,
        author: authorName,
        duration
      };
    }).filter(v => typeof v.url === 'string' && v.url.startsWith('http'));

    if (valid.length < 2) {
      return conn.reply(m.chat, 'ꕥ Se requieren al menos 2 resultados válidos con contenido.', m);
    }

    const medias = valid.slice(0, 10).map(v => ({
      type: 'video',
      data: { url: `${v.url}${v.url.includes('?') ? '&' : '?'}apikey=${apikey}` },
      caption: `✐ Título » ${v.title}
ⴵ Autor » ${v.author}
✰ Duración » ${v.duration} segundos
❒ Formato » Video`
    }));

    await conn.sendAdonix(m.chat, medias, { quoted: m });
    await m.react('✔️');

  } catch (e) {
    console.error(e);
    await m.react('✖️');
    await conn.reply(m.chat, `⚠︎ Se ha producido un problema.\n> Usa *${usedPrefix}report* para informarlo.\n\n🜸 Detalles: ${e.message}`, m);
  }
};

handler.help = ['tiktoks'];
handler.tags = ['buscadores'];
handler.command = ['tiktoks', 'tiktoksearch'];
handler.group = true;
handler.coin = 23;
handler.timeout = 120000;

export default handler;
