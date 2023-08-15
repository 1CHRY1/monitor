<template>
  <div class="project-class">
    <div class="title">项目分类</div>
    <div class="class-item">历史监测项目</div>
    <div class="class-item">实时监测项目</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  setup() {},
});
</script>

<style lang="scss" scoped>
.project-class {
  background: #f5f5f7;
  .title {
    font-size: 2rem;
    cursor: pointer;
  }
  .class-item {
    margin-top: 2rem;
    font-size: 1.2rem;
    font-weight: 600;
    cursor: pointer;
    &:hover {
      color: #ff7049;
    }
    &::before {
      content: "";
      width: 4px;
      height: 4px;
      border-radius: 2px;
      display: inline-block;
      background: black;
      margin-right: 0.4rem;
      top: -0.3rem;
      position: relative;
    }
  }
}
</style>