<template>
<div class="spinner" v-once>
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
</div>
</template>


<style lang="scss" scoped>
// Magic by tobiasahlin
// https://github.com/tobiasahlin/SpinKit
.spinner {
    margin: 100px auto 0;
    width: 70px;
    text-align: center;
    > div {
        width: 18px;
        height: 18px;
        background-color: #112f41;
        border-radius: 100%;
        display: inline-block;
        animation: sk-bouncedelay 1.4s infinite ease-in-out both;
    }
    .bounce1 {
        animation-delay: -0.32s;
    }
    .bounce2 {
        animation-delay: -0.16s;
    }
}
@keyframes sk-bouncedelay {
    0%,
    100%,
    80% {
        transform: scale(0);
    }
    40% {
        transform: scale(1);
    }
}
</style>
