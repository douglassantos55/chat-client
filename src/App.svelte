<script>
    import Auth from './Auth.svelte'
    import Date from './Date.svelte'
    import { tick, onDestroy } from 'svelte'
    import { user, channels, messages, openChat, privMsg, broadcast, joinChannel, leaveChannel } from './store'

    let message = ''
    let placeholder
    let currentChannel = $channels[0]

    function sendMessage() {
        if (currentChannel && currentChannel.priv) {
            privMsg(message, currentChannel.id)
        } else {
            broadcast(message, currentChannel.id)
        }

        message =  ''
    }

    async function join(channel) {
        if (currentChannel && !currentChannel.priv) {
            leaveChannel(currentChannel.id)
        }

        if (!channel.priv) {
            joinChannel(channel.id)
        }

        currentChannel = channel;
        scrollDown()
    }

    async function scrollDown() {
        await tick()
        placeholder && placeholder.scrollIntoView(false)
    }

    const unsubscribe = messages.subscribe(scrollDown)
    onDestroy(unsubscribe)
</script>

<main>
{JSON.stringify(currentChannel)}
    {#if !$user}
        <Auth />
    {:else}
        <div class="wrapper">
            <div class="channels">
                {#each Object.values($channels) as channel}
                    <p class:selected="{currentChannel && channel.id === currentChannel.id}">
                        <a href="#" on:click|preventDefault={join(channel)}>
                            {channel.name}
                        </a>
                    </p>
                {/each}
            </div>

            <div class="chat">
                <div class="messages">
                    {#if currentChannel && $messages[currentChannel.id]}
                        {#each $messages[currentChannel.id] as msg}
                            <p>
                                <a href="#" on:click={openChat(msg.sender)}>
                                    <strong>{msg.sender.name}</strong>
                                </a>

                                {msg.payload.message} - <Date timestamp={msg.timestamp} />
                            </p>
                        {/each}
                    {/if}

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
