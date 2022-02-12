<script>
    import Auth from './Auth.svelte'
    import { send, user, channels, messages } from './store'

    let message = ''
    let currentChannel = 1

    function sendMessage() {
        send("broadcast", { channel: currentChannel, message })
        message =  ''
    }
</script>

<main>
    {#if !$user}
        <Auth />
    {:else}
        <div class="wrapper">
            <div class="channels">
                {#each Object.values($channels) as channel}
                    <p>{channel.name}</p>
                {/each}
            </div>

            <div class="chat">
                <div class="messages">
                    {#each $messages as msg}
                        <p>
                            {msg.sender.name} {msg.payload.message} - {msg.timestamp}
                        </p>
                    {/each}
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
.chat {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}
.messages {
    flex-grow: 1;
    padding: 15px;
    background: #eee;
}
</style>
