<template>
    <a :href="url" target="_blank">{{text}}</a>
</template>

<script lang="ts">
export default {
    props: {
        data: {
            required: true
        }
    },
    computed:{
        url(){
            if(typeof this.data==='string')return this.data;
            else return this.data.url;
        },
        text(){
            if(this.data.text) return this.data.text;
            else return this.url;
        }
    }
}
</script>
