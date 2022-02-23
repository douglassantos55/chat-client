<script>
    import ChannelListItem from './ChannelListItem.svelte'

    export let current
    export let channels
</script>

<div class="channels">
    {#each Object.values($channels) as channel}
        <ChannelListItem
            on:channel.join
            on:channel.switch
            on:channel.leave
            channel={channel}
            current={current}
        />
    {/each}
</div>

<style>
.channels {
    flex-grow: 1;
    min-width: 200px;
}
</style>
