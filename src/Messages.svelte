<script>
    import { tick, onDestroy, createEventDispatcher } from 'svelte'
    import Message from './Message.svelte'

    let unsub
    let placeholder
    export let messages

    const dispatch = createEventDispatcher()

    $: if (messages) {
        unsub && unsub()
        unsub = messages.subscribe(scrollDown)
    }

    function forceUpdate(evt) {
        const message = evt.detail.message
        messages.update(messages => ({
            ...messages,
            [message.id]: { ...message, isNew: false },
        }))
    }

    export function scrollDown() {
        tick().then(() => placeholder.scrollIntoView(false))
    }
</script>

<div class="messages">
    {#if $messages}
        {#each Object.values($messages) as msg}
            <Message message={msg} on:message.read={forceUpdate} />
        {/each}
    {/if}

    <p bind:this={placeholder}>&nbsp;</p>
</div>
