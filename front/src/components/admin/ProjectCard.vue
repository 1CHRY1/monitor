<template>
  <div class="project-card">
    <div>
      <img :src="'/monitor/visual/getAvatar/' + projectInfo.avatar" />
    </div>
    <div class="text-info">
      <div class="title">
        <span v-html="replaceHandle(projectInfo.projectName)"></span>
      </div>
      <div class="institution">
        <strong>施工单位：</strong
        ><span v-html="replaceHandle(projectInfo.institution)"></span>
      </div>
      <div class="location">
        <strong>施工地点：</strong
        ><span v-html="replaceHandle(projectInfo.location)"></span>
      </div>
      <div class="time">
        <strong>施工时间：</strong
        ><span v-html="replaceHandle(projectInfo.time)"></span>
      </div>
      <div class="des">
        <strong>简介：</strong
        ><span v-html="replaceHandle(projectInfo.description)"></span>
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
    keyword: {
      type: String,
    },
  },
  setup(props) {
    const projectInfo = computed(() => {
      return props.projectInfo;
    });

    const replaceHandle = (currentStr: string) => {
      const res = new RegExp("(" + props.keyword + ")", "g");
      currentStr = currentStr.replace(
        res,
        "<span style='color:red;'>" + props.keyword + "</span>"
      );
      return currentStr;
    };

    return { projectInfo, replaceHandle };
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