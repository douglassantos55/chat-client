<script>
    import { createEventDispatcher } from 'svelte'

    export let current
    export let channel

    const dispatch = createEventDispatcher()

    $: selected = current && channel && current.id === channel.id
</script>

<p class:selected>
    <a href="#" on:click|preventDefault={dispatch('channel.join', { channel })}>
        {channel.name}
    </a>
</p>

<style>
.selected {
    font-weight: bold;
}
</style>
