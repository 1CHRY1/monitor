<template>
  <div class="main">
    <el-skeleton :rows="5" animated v-if="skeletonFlag" />
    <div class="body" v-else>
      <div class="backTitle">分析中心</div>
      <!-- <div class="backIcon"><DataLine class="iconn"/></div> -->
      <el-empty description="暂无数据" v-if="analysisList.length === 0" />
      <el-row v-else :gutter="20">
        <!-- OG -->
        <!-- <el-col :span="6" v-for="(item, index) in analysisList" :key="index">
          <analysis-card :info="item" :keyword="keyword"></analysis-card>
        </el-col> -->

        <!-- test data -->
        <el-col :span="6">
          <analysis-card :info="analysisList[0]" :keyword="keyword"></analysis-card>
          <analysis-card :info="analysisList[0]" :keyword="keyword"></analysis-card>
        
        </el-col>

        <el-col :span="6">
          <analysis-card :info="analysisList[1]" :keyword="keyword"></analysis-card>
          <analysis-card :info="analysisList[1]" :keyword="keyword"></analysis-card>
        
        </el-col>
        <el-col :span="6">
          <analysis-card :info="analysisList[0]" :keyword="keyword"></analysis-card>
          <analysis-card :info="analysisList[0]" :keyword="keyword"></analysis-card>
          
        </el-col>
        <el-col :span="6">
          <analysis-card :info="analysisList[1]" :keyword="keyword"></analysis-card>
        </el-col>


      </el-row>
      <!-- 分页 -->
      <div class="page">
        <el-pagination
          layout="total, prev, pager, next, jumper"
          :total="total"
          @current-change="currentChange"
          v-model:current-page="currentPage"
          :page-size="16"
          :pager-count="5"
          :background="false"
        >
        </el-pagination>
      </div>
    </div>
    <el-backtop :right="100" :bottom="100" />

    <!-- 版权 -->
    <copyright/>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import NProgress from "nprogress";
import router from "@/router";
import AnalysisCard from "@/components/analysis/AAnalysisCard.vue";
import copyright from "@/layout/PageCopyright.vue";
import { pageQueryAnalysis } from "@/api/request";
NProgress.configure({ showSpinner: false });
export default defineComponent({
  components: { AnalysisCard, copyright },
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
  
  .body {
    padding: 0 150px;
    // height: 100%;
    background-color: black;
    // background-color: #29a3a36e;
    background-image: url("../assets/turquoiseBackImg1.jpg");
    background-size: cover;
    background-position: center center;
  }

  .page {
    width: 100%;
    display: flex;
    justify-content: space-around;
    // margin-bottom: 30px;
    padding-bottom: 30px;

    :deep().el-pagination__jump{
      color:#ffffff
    };
    :deep().el-pagination__total{
      color:#ffffff
    }
  }
}



.backTitle {
  position: absolute;
  right: 1vw;
  top:15vh;
  writing-mode: vertical-rl;
  text-orientation:upright;
  font-size: 8vh;
  font-family: "Microsoft YaHei";
  color: rgba(255, 255, 255, 0.671);
  font-weight: 900;
}

// .backIcon{
//   position:absolute;
//   left: 1vw;
//   bottom: 15vh;
//   color: rgba(194, 194, 194, 0.671);
//   .iconn{
//     width: 7vw;
//     height: 7vw;
//   }
// }

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