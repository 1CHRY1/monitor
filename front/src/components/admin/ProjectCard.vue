<template>
  <div class="project-card">
    <div>
      <img
        src="https://www.casdc.cn/common/img/xkr/%E4%B8%AD%E5%9B%BD%E7%A7%91%E5%AD%A6%E9%99%A2%E7%A7%91%E5%AD%A6%E6%95%B0%E6%8D%AE%E6%80%BB%E4%B8%AD%E5%BF%83.png"
      />
    </div>
    <div class="text-info">
      <div class="title">开源处理器小核RTL代码</div>
      <div class="institution"><strong>施工单位：</strong>南科院</div>
      <div class="location"><strong>施工地点：</strong>苏通二桥</div>
      <div class="time"><strong>施工时间：</strong>2023年</div>
      <div class="des">
        <strong>简介：</strong
        >为满足苏通二通道工可阶段研究要求，受华设设计有限公司委托，长江水利委员会水文局长江口水文水资源勘测局（以下简称长江口局）于2022年8月19日至8月28日在工程拟建水域组织开展了大、小两个代表潮的全潮工作。
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  setup() {},
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