<script>
    import { createEventDispatcher } from 'svelte'
    import user from './store/user'

    export let current
    export let channel
    let newMessagesCount = 0

    const dispatch = createEventDispatcher()

    $: selected = current && channel && current.id === channel.id

    $: messages = channel.messages
    $: newMessagesCount = Object.values($messages).filter(msg => {
        return msg.isNew && current && channel.id !== current.id && msg.sender.id !== $user.id
    }).length
</script>

<p class:selected class="channel-item">
    <a class="channel" href="#" on:click|preventDefault={dispatch('channel.join', { channel })}>
        {channel.name}

        {#if newMessagesCount > 0}
            <span class="count">({newMessagesCount})</span>
        {/if}
    </a>

    <a href="#" class="leave" on:click|self|preventDefault={dispatch('channel.leave', { channel })}>Leave</a>
</p>

<style>
.channel-item {
    margin: 0;
    display: flex;
    align-items: center;
    padding-right: 0.5rem;
    justify-content: space-between;
}
.channel {
    display: block;
    padding: 0.5rem;
}
.channel-item:hover .leave {
    display: block;
}
.selected {
    font-weight: bold;
}
.count {
    font-size: 95%;
    color: #aaa;
}
.leave {
    display: none;
    font-weight: bold;
}
</style>
