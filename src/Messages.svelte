<script>
    import { tick, onDestroy, createEventDispatcher } from 'svelte'
    import { fly, fade } from 'svelte/transition'
    import channels from './store/channels'
    import user from './store/user'
    import Timestamp from './Timestamp.svelte'

    let unsub
    let placeholder
    export let messages

    const dispatch = createEventDispatcher()

    function openChat(user) {
        channels.openChat(user)
        dispatch('channel.join', {
            channel: $channels[user.id]
        })
    }

    $: if (messages) {
        unsub && unsub()
        unsub = messages.subscribe(scrollDown)
    }

    export function scrollDown() {
        tick().then(() => placeholder.scrollIntoView(false))
    }
</script>

<div class="messages">
    {#if $messages}
        {#each $messages as msg}
            <p in:fly="{{ y: 10, duration: 200 }}" out:fade="{{ duration: 100 }}">
                {#if $user.id != msg.sender.id}
                    <a href="#" on:click={openChat(msg.sender)}>
                        <strong>{msg.sender.name}</strong>
                    </a>
                {:else}
                    <strong>{msg.sender.name}</strong>
                {/if}


                <span class="message">{msg.payload.message}</span>
                <Timestamp timestamp={msg.timestamp} />
            </p>
        {/each}
    {/if}

    <p bind:this={placeholder}>&nbsp;</p>
</div>

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
