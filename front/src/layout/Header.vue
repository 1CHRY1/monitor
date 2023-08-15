<template>
  <el-affix :offset="0">
    <div class="header"></div>
  </el-affix>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  setup() {},
});
</script>

<style lang="scss" scoped>
.header {
  height: 5rem;
  z-index: 1000;
  //   position: sticky;
  //   top: 0px;
  background: white;
}
</style>