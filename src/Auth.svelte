<script>
    import { auth } from './store'

    let name = ''
    let error = ''

    function authenticate() {
        if (name.trim() == "") {
            error = 'Enter your name above'
        } else {
            auth(name)
        }
    }
</script>

<div class="popup">
    <div class="popup-body">
        <h1>Enter your name</h1>

        <form on:submit|preventDefault={authenticate}>
            <input placeholder="Your name" bind:value={name} />

            {#if error != ''}
                <div class="error">{error}</div>
            {/if}

            <button type="submit">Join chat</button>
        </form>
    </div>
</div>

<style>
.popup {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.3);
}

.popup-body {
    padding: 15px;
    background: #fff;
}

.error {
    color: red;
    margin-bottom: 10px;
}

h1 {
    margin-top: 0;
}
input {
    width: 100%;
    margin-bottom: 10px;
}
button {
    margin-left: auto;
}
</style>
