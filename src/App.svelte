<script>
    import Auth from './Auth.svelte'
    import Date from './Date.svelte'
    import { tick, onDestroy } from 'svelte'
    import { user, channels, messages, broadcast, joinChannel, leaveChannel } from './store'

    let message = ''
    let placeholder
    let currentChannel = 1

    function sendMessage() {
        broadcast(message, currentChannel)
        message =  ''
    }

    async function join(channelId) {
        leaveChannel(currentChannel)
        joinChannel(channelId)
        currentChannel = channelId;

        await tick()
        placeholder && placeholder.scrollIntoView(false)
    }

    const unsubscribe = messages.subscribe(async () => {
        await tick()
        placeholder && placeholder.scrollIntoView(false)
    })

    onDestroy(unsubscribe)
</script>

<main>
    {#if !$user}
        <Auth />
    {:else}
        <div class="wrapper">
            <div class="channels">
                {#each Object.values($channels) as channel}
                    <p class:selected="{channel.id === currentChannel}"><a href="#" on:click|preventDefault={join(channel.id)}>{channel.name}</a></p>
                {/each}
            </div>

            <div class="chat">
                <div class="messages">
                    {#each $messages[currentChannel] as msg}
                        <p>
                            <strong>{msg.sender.name}</strong> {msg.payload.message} - <Date timestamp={msg.timestamp} />
                        </p>
                    {/each}

                    <div bind:this={placeholder}>&nbsp;</div>
                </div>

                <form on:submit|preventDefault={sendMessage}>
                    <input type="text" placeholder="Write your message here" bind:value={message} />
                </form>
            </div>
        </div>
    {/if}
</main>

<style>
input {
    width: 100%;
}
.wrapper {
    display: flex;
    min-height: 100vh;
}
.channels {
    min-width: 200px;
    border-right: 1px solid #ddd;
}
.selected {
    font-weight: bold;
}
.chat {
    flex-grow: 1;
    display: flex;
    max-height: 100vh;
    flex-direction: column;
}
.messages {
    flex-grow: 1;
    padding: 15px;
    background: #eee;
    max-height: 100vh;
    overflow-y: auto;
}
</style>
