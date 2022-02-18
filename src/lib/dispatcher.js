export default class {
    constructor() {
        this.listeners = {}
    }

    subscribe(type, listener) {
        if (!this.listeners[type]) {
            this.listeners[type] = []
        }
        this.listeners[type].push(listener)
    }

    dispatch(data) {
        const listeners = this.listeners[data.type]
        if (listeners) {
            listeners.forEach(listener => listener(data))
        }
    }
}
