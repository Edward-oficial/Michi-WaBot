let handler = async (m, { conn }) => {
  try {
    const columnas = ['Columna 1', 'Columna 2']

    // Genera datos random cada vez que se ejecuta el comando
    const opciones = [
      ['🍕 Pizza', '🍔 Hamburguesa'],
      ['🐶 Perro', '🐱 Gato'],
      ['⚽ Fútbol', '🏀 Básquet'],
      ['🌵 Cactus', '🌴 Palmera'],
      ['🔥 Fuego', '❄️ Hielo'],
      ['🎮 Consola', '🎲 Dados'],
      ['☕ Café', '🍵 Té']
    ]

    const filaRandom = opciones[Math.floor(Math.random() * opciones.length)]

    await conn.sendTable(
      m.chat,
      '',
      columnas,
      [filaRandom],
      m,
      {
        headerText: 'Título',
        footer: 'Pie'
      }
    )

  } catch (err) {
    console.error(err)
    await conn.sendMessage(m.chat, { text: "Error:\n" + err.message }, { quoted: m })
  }
}

handler.command = ['tabla']
export default handler