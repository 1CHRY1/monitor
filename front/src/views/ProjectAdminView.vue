<template>
  <div class="admin-view">
    <div class="top">
      <el-input v-model="input" placeholder="输入要检索的内容" size="large" />
    </div>
    <div class="content">
      <project-class></project-class>
      <div class="cards">
        <project-card></project-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import ProjectClass from "@/components/admin/ProjectClass.vue";
import ProjectCard from "@/components/admin/ProjectCard.vue";
export default defineComponent({
  components: { ProjectClass, ProjectCard },
  setup() {
    const input = ref("");

    return { input };
  },
});
</script>

<style lang="scss" scoped>
.admin-view {
  height: calc(100% - 5rem);
  .top {
    height: 12rem;
    background: #232539;
    position: relative;
    .el-input {
      width: 68%;
      position: relative;
      top: 4rem;
      left: 16%;
    }
  }
  .content {
    display: flex;
    height: calc(100% - 12rem);
    .project-class {
      padding: 1rem 2rem;
      height: calc(100% - 2rem);
      width: 14rem;
    }
    .cards {
      min-height: 100%;
      width: calc(100% - 14rem - 4rem);
      .project-card {
        width: calc(100% - 5rem);
        margin-left: 1rem;
      }
    }
  }
}
</style>