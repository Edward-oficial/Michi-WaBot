import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix }) => {
  if (!text) return conn.reply(m.chat, '✐ Por favor, ingresa un término de búsqueda de TikTok.', m);

  try {
    await m.react('🕒');

    const api = global.APIs.edward;

    if (!api?.url) {
      return conn.reply(m.chat, '> La API de Edward no está configurada.', m);
    }

    const apiKey = api.key || 'EdwardviEZIJVb';
    const searchUrl = `${api.url}/api/search/tiktok?apiKey=${encodeURIComponent(apiKey)}&query=${encodeURIComponent(text)}`;

    const { data: search } = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!search?.status || !search?.data?.length) {
      return conn.reply(m.chat, `> No se encontraron resultados.\n> *Detalle:* ${search?.error || 'Sin contenido'}`, m);
    }

    const results = search.data.filter(v => v.play || v.url || v.downloadUrl || v.nowatermark || v.video);

    if (results.length < 2) {
      return conn.reply(m.chat, 'ꕥ Se requieren al menos 2 resultados válidos con contenido.', m);
    }

    const medias = results.slice(0, 10).map(v => ({
      type: 'video',
      data: { url: v.play || v.url || v.downloadUrl || v.nowatermark || v.video },
      caption: `✐ Título » ${v.title || 'Video TikTok'}
ⴵ Autor » ${v.author?.nickname || v.author || 'Desconocido'}
✰ Duración » ${v.duration || 'No disponible'} segundos
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

export default handler;
