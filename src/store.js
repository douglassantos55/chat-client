import { writable } from 'svelte/store'

export const user = writable(null)
export const channels = writable([])
export const messages = writable([])

const ws = new WebSocket('ws://localhost:8080')

ws.onmessage = function (message) {
    const data = JSON.parse(message.data)
    console.log(data)

    if (data.type === "auth") {
        user.set(data.payload.user)
        channels.set(data.payload.channels)
    }

    if (data.type === "broadcast") {
        messages.update(messages => [...messages, data])
    }
}

export function auth(name) {
    send("auth", { name })
}

export function send(type, payload) {
    ws.send(JSON.stringify({ type, payload }))
}
