<script>
export default {};
</script>

<template>
  <!-- 可以考虑图片上加点字 -->
  <div class="Image">
    <div class="describe">
      <h2>长江南京以下野外水沙监测平台</h2>
      <h4>高效监测 高效管理</h4>
    </div>

    <img class="background-pic" src="/resource/pic.jpg" />
  </div>
</template>

<style scoped>
.background-pic {
  width: 100vw;
  height: 65vh;
  object-fit: cover;
}
.describe {
  position: absolute;
  z-index: 2;
  color: #fff;
  right: 10vw;
  top: 30vh;
  text-align: right;
}
</style>