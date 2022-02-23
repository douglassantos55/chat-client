import Dispatcher from './dispatcher'

class Socket {
    constructor(dispatcher) {
        this.dispatcher = dispatcher
        this.ws = new WebSocket('ws://localhost:8080')

        this.ws.onmessage = (message) => {
            const data = JSON.parse(message.data)
            console.log(data)
            this.dispatcher.dispatch(data)
        }
    }

    on(type, listener) {
        this.dispatcher.subscribe(type, listener)
    }

    sendPrivate(message, receiver) {
        this.send('priv_msg', { message, receiver })
    }

    broadcast(message, channel) {
        this.send("broadcast", { channel, message })
    }

    joinChannel(channelId) {
        this.send("join_channel", { channel: channelId })
    }

    leaveChannel(channelId) {
        this.send("leave_channel", { channel: channelId })
    }

    send(type, payload) {
        this.ws.send(JSON.stringify({ type, payload }))
    }
}

export default new Socket(new Dispatcher())
