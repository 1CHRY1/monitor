<template>
  <div class="project-class">
    <div class="title">项目分类</div>
    <div
      :class="active === 0 ? 'class-item active' : 'class-item'"
      @click="clickHandle(0)"
    >
      历史监测项目
    </div>
    <div
      :class="active === 1 ? 'class-item active' : 'class-item'"
      @click="clickHandle(1)"
    >
      实时监测项目
    </div>
    
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { debounce } from "@/utils/common";
export default defineComponent({
  emits: ["changeType"],
  setup(_, context) {
    const active = ref(0);

    const clickHandle = (val: number) => {
      const handle = () => {
        active.value = val;
        context.emit("changeType", val);
      };
      debounce(handle, 100)();
    };
    return { active, clickHandle };
  },
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
  .active {
    color: #ff7049;
  }

  
}
</style>