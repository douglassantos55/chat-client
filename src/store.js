import { writable } from 'svelte/store'

export const user = writable(null)
export const channels = writable([])
export const messages = writable({ 1: [] })

const ws = new WebSocket('ws://localhost:8080')

ws.onmessage = function (message) {
    const data = JSON.parse(message.data)
    console.log(data)

    if (data.type === "auth") {
        user.set(data.payload.user)
        channels.set(data.payload.channels)
    }

    if (data.type === "broadcast") {
        messages.update(messages => {
            const channel = data.payload.channel

            if (!messages[channel]) {
                messages[channel] = []
            }

            messages[channel] = [...messages[channel], data]
            return messages
        })
    }

    if (data.type === "priv_msg") {
        const id = data.payload.channel.id

        channels.update(channels => {
            if (!channels[id]) {
                channels[id] = {...data.payload.channel, priv: true}
            }

            return channels
        })

        messages.update(messages => {
            if (!messages[id]) {
                messages[id] = []
            }

            messages[id] = [...messages[id], data]
            return messages
        })
    }
}

export function openChat(user) {
    channels.update(channels => {
        if (!channels[user.id]) {
            channels[user.id] = {...user, priv: true}
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
