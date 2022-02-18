<script>
    export let timestamp = ''
    const time = new Date(timestamp)

    $: formatted = time.toLocaleTimeString()
</script>

<small>{formatted}</small>

<style>
small {
    color: #aaa;
}
</style>
