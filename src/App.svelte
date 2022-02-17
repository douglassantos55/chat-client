<script>
    import Auth from './Auth.svelte'
    import Channel from './Channel.svelte'
    import Messages from './Messages.svelte'
    import { user, channels, joinChannel, leaveChannel } from './store'

    let message = ''
    let currentChannel

    function sendMessage() {
        currentChannel && currentChannel.send(message)
        message =  ''
    }

    async function join(channel) {
        currentChannel && currentChannel.leave()
        channel.join()
        currentChannel = channel
    }
</script>

<main>
    {#if !$user}
        <Auth />
    {:else}
        <div class="wrapper">
            <div class="channels">
                <h3>{ $user.name }</h3>

                {#each Object.values($channels) as channel}
                    <p class:selected="{currentChannel && channel.id === currentChannel.id}">
                        <a href="#" on:click|preventDefault={join(channel)}>
                            {channel.name}
                        </a>
                    </p>
                {/each}
            </div>

            <div class="chat">
                <Channel channel={currentChannel} />

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
</style>
