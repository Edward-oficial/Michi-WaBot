import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix }) => {
  if (!text) return conn.reply(m.chat, '✐ Por favor, ingresa un término de búsqueda de TikTok.', m);

  try {
    await m.react('🕒');

    const searchUrl = `https://api.lempi.lat/s/tiktok?q=${encodeURIComponent(text)}&count=10&cursor=0&apikey=shadow15`;

    const res = await fetch(searchUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    const json = await res.json();

    const rawItems = Array.isArray(json) 
      ? json 
      : (json?.data?.videos || json?.data?.result || json?.data || json?.result || json?.videos || []);

    const list = Array.isArray(rawItems) ? rawItems : [];

    const valid = list.map(v => {
      const videoUrl = v.play || v.no_watermark || v.nowatermark || v.wmplay || v.downloadUrl || v.url || v.video || (typeof v === 'string' ? v : null);
      const title = v.title || v.desc || v.description || 'Video TikTok';
      const authorName = v.author?.nickname || v.author?.unique_id || v.author || v.nickname || 'Desconocido';
      const duration = v.duration || v.duration_seconds || 'No disponible';

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
      data: { url: v.url },
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

export default handler;
