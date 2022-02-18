<script>
    import Messages from './Messages.svelte'
    export let channel
</script>

<div class="channel">
    {#if channel}
        <h3>{channel.name}</h3>
        <Messages messages={channel.messages} on:channel.join />
    {/if}
</div>

<style>
.channel {
    flex-grow: 1;
    padding: 15px;
    background: #eee;
    max-height: 100vh;
    overflow-y: auto;
}
h3 {
    margin: 0;
    padding-bottom: 1rem;
    border-bottom: 1px solid #ddd;
}
</style>
