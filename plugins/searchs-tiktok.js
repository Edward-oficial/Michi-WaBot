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
    const results = json?.data?.videos || json?.data?.result || json?.data || json?.result || [];

    const list = Array.isArray(results) ? results : [];
    const valid = list.filter(v => v.play || v.url || v.downloadUrl || v.nowatermark || v.video);

    if (valid.length < 2) {
      return conn.reply(m.chat, 'ꕥ Se requieren al menos 2 resultados válidos con contenido.', m);
    }

    const medias = valid.slice(0, 10).map(v => ({
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
