<script>
    import Auth from './Auth.svelte'
    import Channel from './Channel.svelte'
    import Messages from './Messages.svelte'
    import ChannelsList from './ChannelsList.svelte'
    import user from './store/user'
    import channels from './store/channels'

    let message = ''
    let currentChannel

    function sendMessage() {
        currentChannel && currentChannel.send(message)
        message =  ''
    }

    async function join(event) {
        const { channel } = event.detail
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
            <aside class="sidebar">
                <h3>{ $user.name }</h3>

                <ChannelsList
                    channels={channels}
                    current={currentChannel}
                    on:channel.join={join}
                />
            </aside>

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
.sidebar {
    min-width: 200px;
    border-right: 1px solid #ddd;
}
.chat {
    flex-grow: 1;
    display: flex;
    max-height: 100vh;
    flex-direction: column;
}
</style>
