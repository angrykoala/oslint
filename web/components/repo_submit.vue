<template>
<form @submit.prevent="onSubmit">
    <label class="label">Repository Url</label>
    <div class="field has-addons">
        <div class="control input-control">
            <input class="input" type="text" placeholder="https://github.com/username/project" v-model="repoUrl" :disabled="loading">
        </div>
        <div class="control">
            <button class="button is-info" :disabled="loading">
                Analyze
            </button>
        </div>
    </div>
</form>
</template>


<script lang="ts">
export default {
    props: {
        loading: Boolean
    },
    data() {
        return {
            repoUrl: ""
        }
    },
    methods: {
        onSubmit() {
            if (this.repoUrl) {
                if (!this.loading) this.$emit("onSubmit", this.repoUrl);
            }
        }
    }
}
</script>


<style lang="scss">
.input-control {
    width: 100%;
}
</style>
