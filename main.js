const Discord = require('discord.js')
const { toString } = require('ffmpeg-static')
const config = require('./config.json')
const client = new Discord.Client()
const userID = 759067541712273438
let host = ''
let hostmember
let hasHost = false
const prefix = '!'
let memberInsideChannel = false
const helpMessage = `To get started, join a voice channel and type **!host** or **!start** . I'll set you as host and only you will be able to control me.
    
Only the host Can use **!m** and **!u** to mute or unmute the voice channel.
    
Type **!Finish** to finish a game.
    
If you want to set another host, just use **!finish** and set another host with the **!host** command.
    
You can always use **!help** for command list.`

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on('guildCreate', (guild) => {
    let defaultChannel = ''
    guild.channels.cache.forEach((channel) => {
        if (channel.type == 'text' && defaultChannel == '') {
            if (channel.permissionsFor(guild.me).has('SEND_MESSAGES')) {
                defaultChannel = channel
            }
        }
    })
    defaultChannel.send(`Thanks for using MuteBot!

${helpMessage}`)
})

client.on('message', function (message) {
    if (message.member.voice.channel) {
        memberInsideChannel = true
    }
    if (message.author.bot) return
    if (!message.content.startsWith(prefix)) return

    const commandBody = message.content.slice(prefix.length)
    const args = commandBody.split(' ')

    const command = args.shift().toLowerCase()

    // Declare a function to play a sound
    const play = (sound, channel) => {
        const randomNumber = Math.random()
        let soundToPlay = ''
        channel.join().then((connection) => {
            if (sound === 'mute') {
                soundToPlay = randomNumber > 0.5 ? './Sounds/muted.mp3' : './Sounds/muted_male.mp3'
            } else {
                soundToPlay = randomNumber > 0.5 ? './Sounds/unmuted.mp3' : './Sounds/unmuted_male.mp3'
            }
            connection.play(soundToPlay, { volume: 0.5 })
        })
    }

    if (command === 'host' || command === 'start') {
        if (memberInsideChannel) {
            const channel = message.member.voice.channel //the voice channel which the sender is in
            if (hasHost && hostmember && channel.id != hostmember.voice.channel.id) {
                host = message.author
                hostmember = message.member
                channel.join()
                message.channel.send(`Game has started, ${host} is the new host`)
            } else {
                if (message.author === host || host == '') {
                    // if there is host already => check if the current host is not in the same channel of the host requester
                    host = message.author
                    hostmember = message.member
                    channel.join()
                    message.channel.send(
                        `Game has started, ${host} is the host. \nOnly the host can use **!m and !u** for mute and unmute. \nUse **!finish** when you finish your game!`
                    )
                }
            }
        }
    }
    if (command === 'm' || command === 'mute') {
        if (message.author === host) {
            //checking if the sender is admin
            let isAllMuted = true
            const channel = message.member.voice.channel //the voice channel which the sender is in
            for (let member of channel.members) {
                //checking if all the members are muted
                if (!member[1].voice.mute) {
                    //checking if specific member is not muted
                    isAllMuted = false
                }
            }
            if (!isAllMuted) {
                //if not all members are muted, the programm will mute all of them
                for (let member of channel.members) {
                    //muting all the voice channel members
                    if (member[0] != userID) {
                        member[1].voice.setMute(true)
                    }
                }
            } else {
                message.channel.send('Channel is already muted!')
            }
            play('mute', channel)
        } else {
            message.channel.send('You should be the host to control me!\nType **!help** for more information')
        }
    }

    if (command === 'u' || command === 'unmute') {
        if (message.author === host) {
            //cheking if the sender is admin
            let channel = message.member.voice.channel //the voice channel which the sender is in
            let isAllUnmuted = true
            for (let member of channel.members) {
                //checking if all the members are muted
                if (member[1].voice.mute) {
                    //checking if specific member is not muted
                    isAllUnmuted = false
                }
            }
            if (isAllUnmuted) {
                message.channel.send('Channel is already unmuted!')
            } else {
                for (let member of channel.members) {
                    //muting all the voice channel members
                    if (member[0] != userID) {
                        member[1].voice.setMute(false)
                    }
                }
            }
            play('unmute', channel)
        } else {
            message.channel.send('You should be the host to control me!\nType **!help** for more information')
        }
    }

    if (command === 'check') {
        message.channel.send('its workingg')
    }

    if (command === 'finish') {
        if (message.author === host) {
            let channel = message.member.voice.channel //the voice channel which the sender is in
            message.channel.send('Bye Bye  :dizzy_face:')
            channel.leave()
            hasHost = false
            host = ''
        }
    }
    if (command === 'help' || command === 'info') {
        message.channel.send(`${helpMessage}`)
    }

    if (command === 'credit') {
        message.channel.send(`Roey Abutbul code this bot!!!!!!!!`)
    }

    if (command === 'finish') {
        if (message.author === host) {
            let channel = message.member.voice.channel //the voice channel which the sender is in
            message.channel.send('Bye Bye  :dizzy_face:')
            channel.leave()
            hasHost = false
            host = ''
        }
    }
})

client.login(config.BOT_TOKEN)
