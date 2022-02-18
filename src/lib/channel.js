import { get, writable } from 'svelte/store'
import socket from './socket'

export class Channel {
    constructor(data) {
        this.id = data.id
        this.name = data.name
        this.messages = writable(data.messages || {})

        socket.on('broadcast', this.addMessage.bind(this))
    }

    addMessage(message) {
        console.log(message)
        if (message.payload.channel === this.id) {
            this.messages.update(messages => ({
                ...messages,
                [message.id]: { ...message, isNew: true },
            }))
        }
    }

    send(message) {
        socket.broadcast(message, this.id)
    }

    leave() {
        socket.leaveChannel(this.id)
    }

    join() {
        socket.joinChannel(this.id)
    }
}

export class PrivChannel {
    constructor(data) {
        this.id = data.id
        this.name = data.name
        this.messages = writable(data.messages || {})
        socket.on('priv_msg', this.addMessage.bind(this))
    }

    addMessage(message) {
        console.log(message)
        if (message.payload.channel.id === this.id) {
            this.messages.update(messages => ({
                ...messages,
                [message.id]: { ...message, isNew: true },
            }))
        }
    }

    send(message) {
        socket.sendPrivate(message, this.id)
    }

    leave() {
        console.log('not necesseary to leave priv channel')
    }

    join() {
        console.log('not necesseary to join priv channel')
    }
}

