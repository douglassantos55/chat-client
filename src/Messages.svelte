<script>
    import { tick } from 'svelte'
    import Message from './Message.svelte'

    let unsub
    let placeholder
    export let messages

    $: if (messages) {
        unsub && unsub()
        unsub = messages.subscribe(scrollDown)
    }

    export function scrollDown() {
        tick().then(() => placeholder && placeholder.scrollIntoView(false))
    }
</script>

<div class="messages">
    {#if $messages}
        {#each Object.values($messages) as msg}
            <Message message={msg} />
        {/each}
    {/if}

    <p bind:this={placeholder}>&nbsp;</p>
</div>
