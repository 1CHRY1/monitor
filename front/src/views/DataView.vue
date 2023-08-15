<template>
    <div class="viewer-header">
        <div class="logo-text">NHRI</div>
        <div class="title-text-content">
            <div class="title-wrap-left">
                <svg class="title-text-down">
                    <path fill="#fff" fill-opacity="1" d="M 50 450 Q 200 450 200 300 Q 200 150 300 150 "></path>
                </svg>
            </div>
            <div class="title-text">水沙观测一张图</div>
            <div class="title-wrap-right"></div>
            <!-- <div class="title-text-down"></div> -->
        </div>
    </div>
    <div class="background">
        <div class="base-map"></div>
    </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
$header-height: 10vh;
$content-height: calc(100vh - $header-height);
$title-text-height: calc($header-height/2);

div.viewer-header {
    height: $header-height;
    width: 100vw;
    background-color: rgb(12, 12, 54);

    div.logo-text {
        position: absolute;
        width: fit-content;
        height: $header-height;
        left: 1.5vw;

        font-size: 6vh;
        line-height: $header-height;
        font-weight: 800;
        color: rgba(235, 235, 235, 0.5);

        background-position: left 1200px top 80px;
        -webkit-background-clip: text;
        background-repeat: repeat-x;
        background-image: url('../assets/sand-wave.png');
        animation: animate 15s linear infinite;
    }

    @keyframes animate{
        0%{
            background-position: left 0px top -400px;
        }
        20%{
            background-position: left 400px top -250px;
        }
        40%{
            background-position: left 800px top -250px;
        }
        60%{
            background-position: left 1200px top -300px;
        }
        80%{
            background-position: left 1600px top -300px;
        }
        100%{
            background-position: left 2000px top -400px;
        }
    }

    div.title-text-content {
        display: flex;
        position: absolute;
        width: 36vw;
        height: $header-height;
        margin: auto;
        left: 50%;
        transform: translate(-50%, 0);

        flex-flow: row nowrap;
        justify-content: center;
        overflow: hidden;
        background-color: #1831c3;

        div.title-wrap-left {
            width: 6vw;
            height: $header-height;
            background-color: #1831c3;
            overflow: hidden;

            // &::after {
            //     position: absolute;
            //     left: -3.6vw;
            //     top: -$header-height;
            //     width: 6vw;
            //     height: $header-height;
            //     content: '';
            //     border-radius: 100%;
            //     box-shadow: 0 0 0 7vw rgb(12, 12, 54);
            //     overflow: hidden;
            // }
        }
        div.title-wrap-right {
            width: 6vw;
            height: $header-height;
            background-color: #1831c3;
            overflow: hidden;

            &::after {
                position: absolute;
                right: -3.6vw;
                top: -$header-height;
                width: 6vw;
                height: $header-height;
                content: '';
                border-radius: 100%;
                box-shadow: 0 0 0 7vw rgb(12, 12, 54);
                overflow: hidden;
            }
        }
        
        div.title-text {
            height: $header-height;
            width: fit-content;
            line-height: $header-height;
            text-align: center;
            color: white;
            font-size: 4vh;
            font-weight: 600;
            letter-spacing: 0.5vh;
            overflow: hidden;
        
        }
    }
}
div.background{
    height: $content-height;
    width: 100vw;
    background-color: #1831c3;
    z-index: 1;
    div.base-map{
        height: $content-height;
        width: 100vw;
        z-index: 2;
    }
}
</style>
