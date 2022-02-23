<script>
    import ChannelListItem from './ChannelListItem.svelte'

    export let current
    export let channels
</script>

<div class="channels">
    {#each Object.values($channels) as channel}
        <ChannelListItem
            on:channel.join
            on:channel.leave
            channel={channel}
            current={current}
        />
    {/each}
</div>

<style>
.channels {
    min-width: 200px;
    border-right: 1px solid #ddd;
}
</style>
