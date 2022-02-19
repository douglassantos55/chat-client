<script>
    import { createEventDispatcher } from 'svelte'
    import { fly, fade } from 'svelte/transition'
    import user from './store/user'
    import channels from './store/channels'
    import Timestamp from './Timestamp.svelte'

    export let message
    const dispatch = createEventDispatcher()

    function openChat(user) {
        channels.openChat(user)
        dispatch('channel.join', {
            channel: $channels[user.id]
        })
    }

    $: if (message.isNew) {
        dispatch('message.read', { message })
    }
</script>

<p in:fly="{{ y: 10, duration: 200 }}" out:fade="{{ duration: 100 }}">
    {#if $user.id != message.sender.id}
        <a href="#" on:click={openChat(message.sender)}>
            <strong>{message.sender.name}</strong>
        </a>
    {:else}
        <strong>{message.sender.name}</strong>
    {/if}

    <span class="message">{message.payload.message}</span>
    <Timestamp timestamp={message.timestamp} />
</p>

<style>
p {
    display: flex;
    align-items: center;
}
.message {
    flex-grow: 1;
    padding: 0 10px;
}
</style>
