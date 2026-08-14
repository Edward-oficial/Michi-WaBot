let handler = async (m, { conn }) => {
  try {
    const opciones = [
      { titulo: '🍕 Pizza', desc: '🍔 Hamburguesa' },
      { titulo: '🐶 Perro', desc: '🐱 Gato' },
      { titulo: '⚽ Fútbol', desc: '🏀 Básquet' },
      { titulo: '🌵 Cactus', desc: '🌴 Palmera' },
      { titulo: '🔥 Fuego', desc: '❄️ Hielo' },
      { titulo: '🎮 Consola', desc: '🎲 Dados' },
      { titulo: '☕ Café', desc: '🍵 Té' }
    ]

    const filaRandom = opciones[Math.floor(Math.random() * opciones.length)]

    await conn.sendMessage(m.chat, {
      text: 'Toca para ver el detalle:',
      title: 'Título',
      footer: 'Pie',
      buttons: [
        {
          text: 'Ver tabla',
          sections: [
            {
              title: 'Columna 1 / Columna 2',
              rows: [
                { title: filaRandom.titulo, description: filaRandom.desc, id: '.tabla' }
              ]
            }
          ]
        }
      ]
    }, { quoted: m })

  } catch (err) {
    console.error(err)
    await conn.sendMessage(m.chat, { text: "Error:\n" + err.message }, { quoted: m })
  }
}

handler.command = ['tabla']
export default handler