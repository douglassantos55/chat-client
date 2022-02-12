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

        Object.values(data.payload.channels).forEach(chan => {
            messages.update(messages => ({
                ...messages,
                [chan.id]: [],
            }))
        })
    }

    if (data.type === "broadcast") {
        messages.update(messages => {
            const channel = data.payload.channel

            messages[channel] = [
                ...messages[channel],
                data
            ]

            return messages
        })
    }
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

function send(type, payload) {
    ws.send(JSON.stringify({ type, payload }))
}
