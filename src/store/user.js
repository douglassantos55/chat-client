import { writable } from 'svelte/store'
import socket from '../lib/socket'

function createUser() {
    const { subscribe, set, update } = writable(null)

    const user = {
        subscribe,
        authenticate: evt => set(evt.payload.user),
        login: (name) => socket.send("auth", { name }),
    }

    socket.on('auth', user.authenticate)
    return user
}

export default createUser()

