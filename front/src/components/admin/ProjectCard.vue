<template>
  <div class="project-card">
    <div>
      <img :src="'/monitor/project/getAvatar/' + projectInfo.avatar" />
    </div>
    <div class="text-info">
      <div class="title">{{ projectInfo.projectName }}</div>
      <div class="institution">
        <strong>施工单位：</strong>{{ projectInfo.institution }}
      </div>
      <div class="location">
        <strong>施工地点：</strong>{{ projectInfo.location }}
      </div>
      <div class="time"><strong>施工时间：</strong>{{ projectInfo.time }}</div>
      <div class="des">
        <strong>简介：</strong>{{ projectInfo.description }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { ProjectType } from "@/type";
export default defineComponent({
  props: {
    projectInfo: {
      type: Object as PropType<ProjectType>,
    },
  },
  setup(props) {
    const projectInfo = computed(() => {
      return props.projectInfo;
    });

    return { projectInfo };
  },
});
</script>

<style lang="scss" scoped>
.project-card {
  height: 14rem;
  background: #f5f5f7;
  border: solid 1px #d6d6d6;
  border-radius: 8px;
  margin-top: 2rem;
  display: flex;
  cursor: pointer;
  img {
    width: 18rem;
    height: 12rem;
    border-radius: 8px;
    margin: 1rem;
  }
  .text-info {
    padding: 1rem 2rem 1rem 0;
    .title {
      font-size: 1.6rem;
    }
    .institution {
      margin-top: 1rem;
    }
    .location,
    .time,
    .des {
      margin-top: 0.8rem;
    }
    .des {
      word-break: break-all;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      line-height: 1.5rem;
    }
    .institution,
    .location,
    .time,
    .des {
      font-size: 0.9rem;
    }
  }
}
</style>