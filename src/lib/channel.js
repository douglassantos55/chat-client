import { derived, get, writable } from 'svelte/store'
import socket from './socket'
import messages from '../store/messages'

export class Channel {
    constructor(data) {
        this.id = data.id
        this.name = data.name
        this.active = true
        this.messages = derived(messages, msgs => {
            return Object.values(msgs).filter(msg => {
                return msg.payload.channel === this.id
            })
        })
        socket.on('broadcast', this.addMessage.bind(this))
    }

    addMessage(message) {
        if (message.payload.channel === this.id) {
            messages.add({ ...message, isNew: true })
        }
    }

    send(message) {
        socket.broadcast(message, this.id)
    }

    leave() {
        this.active = false
        socket.leaveChannel(this.id)
    }

    join() {
        this.active = true
        socket.joinChannel(this.id)
    }
}

export class PrivChannel {
    constructor(data) {
        this.id = data.id
        this.name = data.name
        this.active = true
        this.messages = derived(messages, msgs => {
            return Object.values(msgs).filter(msg => {
                return msg.payload.channel.id === this.id
            })
        })
        socket.on('priv_msg', this.addMessage.bind(this))
    }

    addMessage(message) {
        if (message.payload.channel.id === this.id) {
            messages.add({ ...message, isNew: true })
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

