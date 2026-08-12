let handler = async (m, { conn }) => {
    const ownerNumber = global.owner[0][0].replace(/[^0-9]/g, '')
    const ownerName = global.owner[0][1] || 'Duan Edward'

    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${ownerName}
ORG:${global.botname || 'SlowedGenX'};
TEL;type=CELL;type=VOICE;waid=${ownerNumber}:+${ownerNumber}
END:VCARD`

    await conn.sendMessage(
        m.chat,
        {
            contacts: {
                displayName: ownerName,
                contacts: [{ vcard }]
            }
        },
        { quoted: m }
    )

    let txt = `> ꕥ *Información del Owner*\n\n`
    txt += `> ⊹ *Nombre* » ${ownerName}\n`
    txt += `> ⊹ *Número* » +${ownerNumber}\n`
    txt += `> ⊹ *Bot* » ${global.botname || 'SlowedGenX'}`

    await conn.reply(m.chat, txt, m)
}

handler.help = ['owner']
handler.tags = ['info']
handler.command = ['owner', 'infoowner', 'creador']

export default handler
