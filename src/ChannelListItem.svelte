<script>
    import { createEventDispatcher } from 'svelte'
    import user from './store/user'

    export let current
    export let channel
    let newMessagesCount = 0

    const dispatch = createEventDispatcher()

    $: selected = current && channel && current.id === channel.id

    channel.messages.subscribe(messages => {
        newMessagesCount = Object.values(messages).filter(msg => {
            return msg.isNew && channel.id !== current.id && msg.sender.id !== $user.id
        }).length
    })
</script>

<p class:selected>
    <a href="#" on:click|preventDefault={dispatch('channel.join', { channel })}>
        {channel.name}
        {newMessagesCount}
    </a>
</p>

<style>
.selected {
    font-weight: bold;
}
</style>
