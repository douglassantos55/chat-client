import { writable } from 'svelte/store'

function createMessages() {
    const { subscribe, update, set } = writable({})

    return {
        subscribe,
        update,
        add: (msg) => update(msgs => ({
            ...msgs,
            [msg.id]: { ...msg }
        })),
        markAsRead: (msg) => update(msgs => ({
            ...msgs,
            [msg.id]: { ...msg, isNew: false }
        }))
    }
}

export default createMessages()
