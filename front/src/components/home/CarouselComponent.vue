<template>
    <el-carousel :interval="3000" type="card" height="67vh" @change="carouselChange" ref="carousel">
    <el-carousel-item id="first">
        <img class="picture" src="/resource/pic.jpg" />
        <div class="describe">
            <h1 class="title-text">长江南京以下野外水沙监测平台</h1>
            <p class="title-desc">高效监测 高效管理</p>
        </div>
    </el-carousel-item>
    <el-carousel-item id="1">
      <!-- 门户图片 -->
      <img class="picture" src="/resource/Portal.jpg" />
    </el-carousel-item>
    <el-carousel-item id="2">
      <!-- 大屏图片 -->
      <img class="picture" src="/resource/bigScreen.jpg" />
    </el-carousel-item>
    <el-carousel-item id="3">
      <!-- 一张图图片 -->
        <img class="picture" src="/resource/oneMap.jpg" />
    </el-carousel-item>
    <el-carousel-item id="4">
      <!-- 分析中心图片 -->
        <img class="picture" src="/resource/analysisCenter.jpg" />
    </el-carousel-item>
    <el-carousel-item id="5">
      <!-- 潮位预报图片 -->
        <img class="picture" src="/resource/waterForecast.png" />
    </el-carousel-item>
  </el-carousel>
  <!-- <button @click="setActiveItem(2)">设置第三张轮播图为当前项</button> -->
</template>

<script>

export default {
    props: {
        ImgIndexfromParent: -1
    },
    data() {
      return {
        nowID:'0'
      }
    },
    methods: {
        carouselChange(a){
            this.$emit('message-to-parent',a);
        },
        setNowImg(){
            if(this.ImgIndexfromParent!=-1){
              // 要使用 setActiveItem 方法，需要先通过 ref 获取走马灯组件实例，再调用 setActiveItem 方法即可。
              this.$refs.carousel.setActiveItem(this.ImgIndexfromParent);
            }
        } 
    },
    watch: {
        ImgIndexfromParent(newValue){
          if (newValue != -1) {
            this.setNowImg();
          }
        }
    }
}
</script>
<style lang="scss" scoped>
.el-carousel {
  padding-top: 2vh;
}
.el-carousel__item.is-active {
  height: 65vh;
  width: 70vw;
  transform: translateX(15vh) scale(1);
  overflow: visible;
  img.picture {
    transform: translateX(-10vw);
  }
}
.picture {
    object-fit: cover;
    width: 100%;
    height: 100%;
    z-index: -1;
}

.describe {
  position: absolute;
  z-index: 2;
  color: #fff;
  right: 13vw;
  top: 10vh;
  text-align: right;

  h1.title-text {
    font-size: 5vh;
  }
  p.title-desc {
    font-size: 3vh;
  }
  
}
</style>