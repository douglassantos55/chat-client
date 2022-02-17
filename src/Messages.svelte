<script>
    import { tick, onDestroy } from 'svelte'
    import { openChat } from './store'
    import Date from './Date.svelte'

    let unsub
    let placeholder
    export let messages

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
            <p>
                <a href="#" on:click={openChat(msg.sender)}>
                    <strong>{msg.sender.name}</strong>
                </a>

                {msg.payload.message} - <Date timestamp={msg.timestamp} />
            </p>
        {/each}
    {/if}

    <p bind:this={placeholder}>&nbsp;</p>
</div>
