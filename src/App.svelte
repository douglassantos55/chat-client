<script>
    import { tick, onDestroy } from 'svelte'
    import Auth from './Auth.svelte'
    import Channel from './Channel.svelte'
    import Messages from './Messages.svelte'
    import ChannelsList from './ChannelsList.svelte'
    import user from './store/user'
    import channels from './store/channels'
    import socket from './lib/socket'

    let message = ''
    let currentChannel

    function sendMessage() {
        currentChannel.send(message)
        message =  ''
    }

    function join(event) {
        const { channel } = event.detail
        channel.join()
        switchChannel(event)
    }

    function switchChannel(evt) {
        const { channel } = evt.detail

        if (channel.active) {
            currentChannel = channel
        }
    }

    function leave(evt) {
        const { channel } = evt.detail
        channel.leave()

        if (channel.id === currentChannel.id) {
            currentChannel = undefined
        }
    }

    const unsub = channels.subscribe(channels => {
        if (!currentChannel) {
            currentChannel = Object.values(channels)[0]
        }
    })

    onDestroy(() => socket.close() && unsub())
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
                    on:channel.switch={switchChannel}
                    on:channel.leave={leave}
                />
            </aside>

            <div class="chat">
                <Channel channel={currentChannel} on:channel.join={join} />

                <form on:submit|preventDefault={sendMessage}>
                    <input type="text" placeholder="Write your message here" bind:value={message} autofocus />
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
    display: flex;
    min-width: 200px;
    flex-direction: column;
    border-right: 1px solid #ddd;
}
.chat {
    flex-grow: 1;
    display: flex;
    max-height: 100vh;
    flex-direction: column;
}
</style>
