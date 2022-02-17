<script>
    import { openChat } from './store'
    import { tick, onDestroy } from 'svelte'
    import Date from './Date.svelte'

    let placeholder
    export let messages

    const unsub = messages.subscribe(scrollDown)

    onDestroy(() => {
        console.log('done')
        unsub()
    })

    function scrollDown() {
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
