import { writable } from 'svelte/store'
import socket from '../lib/socket'
import { Channel, PrivChannel } from '../lib/channel'

function createChannels() {
    const { subscribe, set, update } = writable({})

    function registerAll(evt) {
        update(channels => {
            Object.values(evt.payload.channels).forEach(channel =>
                channels[channel.id] = new Channel(channel)
            )

            return channels
        })
    }

    function register(evt) {
        const id = evt.payload.channel.id

        update(channels => {
            if (!channels[id]) {
                channels[id] = new PrivChannel({
                    ...evt.payload.channel,
                    messages: [evt],
                })
            }
            return channels
        })
    }

    function openChat(user) {
        update(channels => {
            if (!channels[user.id]) {
                channels[user.id] = new PrivChannel(user)
            }
            return channels
        })
    }

    const channels = {
        subscribe,
        openChat,
    }

    socket.on('auth', registerAll)
    socket.on('priv_msg', register)

    return channels
}

export default createChannels()
