<template>
  <div class="admin-view" ref="adminView">
    <div class="top">
      <el-input v-model="input" placeholder="输入要检索的内容" size="large" />
    </div>
    <div class="content">
      <el-affix :offset="80">
        <project-class @changeType="changeType"></project-class>
      </el-affix>
      <el-skeleton :rows="5" animated v-if="skeletonFlag" />
      <div class="cards" v-else>
        <div v-if="projectList.length">
          <div v-for="(item, index) in projectList" :key="index">
            <project-card :projectInfo="item"></project-card>
          </div>
          <div class="page">
            <el-pagination
              background
              layout="total, prev, pager, next"
              :total="total"
              @current-change="pageChange"
            />
          </div>
        </div>
        <el-empty description="暂无数据" v-else />
      </div>
    </div>
    <el-affix :offset="200" class="add">
      <el-button type="primary" size="small" @click="addProjectDialog = true">
        <el-icon><Plus /></el-icon>
      </el-button>
    </el-affix>
  </div>
  <el-dialog v-model="addProjectDialog" title="添加新的监测项目" width="30%">
    <add-project
      @cancel="addProjectDialog = false"
      @commit="commitHandle"
    ></add-project>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import ProjectClass from "@/components/admin/ProjectClass.vue";
import ProjectCard from "@/components/admin/ProjectCard.vue";
import { pageQueryProject, createProject } from "@/api/request";
import { ProjectType } from "@/type";
import AddProject from "@/components/admin/AddProject.vue";
import { notice } from "@/utils/common";
export default defineComponent({
  components: { ProjectClass, ProjectCard, AddProject },
  setup() {
    const skeletonFlag = ref(true);
    const input = ref("");
    const total = ref(0);
    const projectList = ref<ProjectType[]>([]);

    const addProjectDialog = ref(false);

    let type = "history";
    let keyword = "";

    const pageQuery = async (
      keyword: string,
      type: string,
      page: number,
      size: number
    ) => {
      const jsonData = {
        keyword: keyword,
        type: type,
        page: page,
        size: size,
      };
      const res = await pageQueryProject(jsonData);
      if (res && res.code === 0) {
        projectList.value = res.data.list;
        total.value = res.data.total;
      }
    };

    const pageChange = async (val: number) => {
      await pageQuery(keyword, type, val - 1, 10);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    const changeType = async (val: number) => {
      if (val === 0) type = "history";
      else type = "realTime";
      await pageQuery(keyword, type, val - 1, 10);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    const commitHandle = async (val: {
      projectName: string;
      description: string;
      institution: string;
      time: string;
      location: string;
      avatar: string;
      type: string;
    }) => {
      const res = await createProject(val);
      if (res && res.code === 0) {
        notice("success", "成功", "新项目添加成功!");
        addProjectDialog.value = false;
      }
    };

    onMounted(async () => {
      await pageQuery("", "history", 0, 10);
      skeletonFlag.value = false;
    });

    return {
      skeletonFlag,
      input,
      total,
      projectList,
      pageChange,
      changeType,
      commitHandle,
      addProjectDialog,
    };
  },
});
</script>

<style lang="scss" scoped>
.admin-view {
  min-height: calc(100% - 5rem);
  position: relative;
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
    // align-items: flex-start;
    min-height: calc(100vh - 17rem);

    :deep() .el-affix > div {
      height: 100%;
    }
    .project-class {
      padding: 1rem 2rem;
      height: calc(100% - 2rem);
      width: 14rem;
    }
    .cards {
      width: calc(100% - 14rem - 4rem);

      .project-card {
        width: calc(100% - 5rem);
        margin-left: 1rem;
      }
      .page {
        height: 7rem;
        display: flex;
        width: 100%;
        justify-content: center;
      }
    }
  }
  .add {
    position: absolute;
    right: 0.8rem;
    top: 12.5rem;
  }
}
</style>