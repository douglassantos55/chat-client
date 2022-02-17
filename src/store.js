import { get, writable } from 'svelte/store'

export const user = writable(null)
export const channels = writable({})
export const messages = writable({ 1: [] })

const ws = new WebSocket('ws://localhost:8080')

class Channel {
    constructor(data) {
        this.id = data.id
        this.name = data.name
        this.messages = writable([])
    }

    addMessage(message) {
        this.messages.update(messages => ([
            ...messages,
            message,
        ]))
    }

    send(message) {
        broadcast(message, this.id)
    }

    leave() {
        leaveChannel(this.id)
    }

    join() {
        joinChannel(this.id)
    }
}

class PrivChannel extends Channel {
    send(message) {
        privMsg(message, this.id)
    }

    leave() {
        console.log('not necesseary to leave priv channel')
    }

    join() {
        console.log('not necesseary to join priv channel')
    }
}

ws.onmessage = function (message) {
    const data = JSON.parse(message.data)
    console.log(data)

    if (data.type === "auth") {
        user.set(data.payload.user)

        Object.values(data.payload.channels).forEach(channel => {
            channels.update(channels => ({
                ...channels,
                [channel.id]: new Channel(channel),
            }))
        })
    }

    if (data.type === "broadcast") {
        const channel = data.payload.channel
        const chans = get(channels)
        chans[channel].addMessage(data)
    }

    if (data.type === "priv_msg") {
        const id = data.payload.channel.id

        channels.update(channels => {
            const channel = new PrivChannel(data.payload.channel)

            if (!channels[id]) {
                channels[id] = channel
            }

            channels[id].addMessage(data)
            return channels
        })
    }
}

export function openChat(user) {
    channels.update(channels => {
        if (!channels[user.id]) {
            channels[user.id] = new PrivChannel(user)
        }
        return channels
    })
}

export function auth(name) {
    send("auth", { name })
}

export function joinChannel(channelId) {
    send("join_channel", { channel: channelId })
}

export function leaveChannel(channelId) {
    send("leave_channel", { channel: channelId })
}

export function broadcast(message, channel) {
    send("broadcast", { channel, message })
}

export function privMsg(message, receiver) {
    send('priv_msg', { message, receiver })
}

function send(type, payload) {
    ws.send(JSON.stringify({ type, payload }))
}
