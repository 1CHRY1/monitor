<template>
  <div class="main">
    <el-skeleton :rows="5" animated v-if="skeletonFlag" />
    <div class="body" v-else>
      <el-empty description="暂无数据" v-if="analysisList.length === 0" />
      <el-row v-else :gutter="20">
        <el-col :span="6" v-for="(item, index) in analysisList" :key="index">
          <analysis-card :info="item" :keyword="keyword"></analysis-card>
        </el-col>
      </el-row>
    </div>
    <div class="page">
      <el-pagination
        layout="total, prev, pager, next, jumper"
        :total="total"
        @current-change="currentChange"
        v-model:current-page="currentPage"
        :page-size="16"
        :pager-count="5"
        :background="true"
      >
      </el-pagination>
    </div>
    <el-backtop :right="100" :bottom="100" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import NProgress from "nprogress";
import router from "@/router";
import AnalysisCard from "@/components/analysis/AnalysisCard.vue";
import { pageQueryAnalysis } from "@/api/request";
NProgress.configure({ showSpinner: false });
export default defineComponent({
  components: { AnalysisCard },
  setup() {
    const analysisList = ref<any[]>([]);
    const search = ref("");
    const total = ref(0);
    const keyword = ref("");
    const currentPage = ref(1);
    const skeletonFlag = ref(true);
    // const offset = ref(0);
    const affixFlag = ref(true);

    onMounted(async () => {
      // computeOffset();
      skeletonFlag.value = true;
      const data = await pageQueryAnalysis({
        size: 16,
        page: 0,
        keyword: keyword.value,
      });
      if (data != null && (data as any).code === 0) {
        analysisList.value = data.data.list;
        total.value = data.data.total;
      }
      skeletonFlag.value = false;
    });

    const searchClick = async () => {
      NProgress.start();
      keyword.value = search.value;
      const data = await pageQueryAnalysis({
        size: 16,
        page: 0,
        keyword: keyword.value,
      });

      if (data != null) {
        if ((data as any).code === 0) {
          analysisList.value = data.data.list;
          total.value = data.data.total;
          currentPage.value = 1;
        }
      }
      NProgress.done();
    };

    const currentChange = async (page: number) => {
      NProgress.start();
      const data = await pageQueryAnalysis({
        size: 16,
        page: page - 1,
        keyword: keyword.value,
      });
      if (data != null && (data as any).code === 0) {
        analysisList.value = data.data.list;
        total.value = data.data.total;
      }
      search.value = keyword.value;
      NProgress.done();
    };

    // const computeOffset = () => {
    //   let div = document.createElement("div");
    //   div.style.height = "7vh";
    //   div.style.maxHeight = "none";
    //   div.style.boxSizing = "content-box";
    //   document.body.appendChild(div);
    //   let h = div.clientHeight;
    //   document.body.removeChild(div);
    //   console.log(h);
    //   offset.value = h;
    // };

    const ClickHandle = () => {
      router.push({
        name: "UserSpaceProject",
      });
    };

    return {
      analysisList,
      search,
      total,
      currentChange,
      searchClick,
      currentPage,
      skeletonFlag,
      // offset,
      keyword,
      ClickHandle,
      affixFlag,
    };
  },
});
</script>

<style lang="scss" scoped>
@keyframes ibannerbg {
  50% {
    transform: scale(1.2, 1.2);
  }
  100% {
    transform: scale(1, 1);
  }
}
.main {
  height: calc(100% - 5rem);
  // .head {
  //   height: 93vh;
  //   overflow: hidden;
  //   position: relative;
  //   .input {
  //     position: absolute;
  //     width: 40%;
  //     left: 30%;
  //     top: 15%;
  //     font-family: "Microsoft YaHei";
  //     .name {
  //       color: #ffc200;
  //       font-weight: 900;
  //       font-size: 200px;
  //       text-align: center;
  //     }

  //     .el-button {
  //       height: 50px;
  //       font-size: 20px;
  //       background: rgba($color: white, $alpha: 0.3);
  //       margin-top: 10px;
  //       color: white;
  //     }
  //     .text {
  //       margin-top: 20px;
  //       color: #dad5c4;
  //       font-size: 23px;
  //       line-height: 40px;
  //     }
  //   }
  //   .bg {
  //     height: 100%;
  //     background: url("/resource/resource6.jfif");
  //     background-size: cover;
  //     animation: ibannerbg 60s linear infinite;
  //   }
  // }

  // .search {
  //   height: 80px;
  //   background: white;
  //   position: relative;
  //   padding: 0px 150px;
  //   .el-input {
  //     margin-top: 20px;
  //     float: right;
  //     width: 600px;
  //   }
  //   .el-button {
  //     margin-top: 20px;
  //     float: right;
  //     margin-left: 10px;
  //   }
  // }

  .body {
    padding: 0 150px;
    // height: 100%;
  }

  .page {
    width: 100%;
    display: flex;
    justify-content: space-around;
    margin-bottom: 30px;
  }
}
:deep().el-dialog {
  .el-dialog__header {
    padding: 10px;
    margin: 0;
    background: #25aef3;
    .el-dialog__title {
      color: white;
    }
  }
  .el-dialog__body {
    padding: 0;
  }
}
</style>