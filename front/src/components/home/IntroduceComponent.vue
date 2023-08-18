<template>
  <el-row class="row-bg" justify="space-evenly">
    <el-col :span="4.8"
      ><div class="grid-content ep-bg-purple" />    
        <el-card class="box-card" :class="{Large:this.isLarge[1]}" id="1" @click="jumpToimg" >
          <div class="card-header" >
            <DocumentCopy class="iconclass"></DocumentCopy>
            <h2 class="part-title">资源门户</h2>
          </div>  
          <div class="text item part-desc">集中管理和提供各种资源，用户可方便地浏览、搜索和获取所需的资源，提高工作效率</div>
        </el-card>
    </el-col>

    <el-col :span="4.8"
      ><div class="grid-content ep-bg-purple"  />
      <el-card class="box-card" :class="{Large:this.isLarge[2]}" id="2" @click="jumpToimg">
          <div class="card-header" >
            <Monitor class="iconclass"></Monitor>
            <h2 class="part-title">监测大屏</h2>
          </div>  
          <div class="text item part-desc">数据图表、指标与信息在大屏上实时呈现，提供全局数据洞察</div>
        </el-card>
    </el-col>


    <el-col :span="4.8"
      ><div class="grid-content ep-bg-purple"  />

      <el-card class="box-card" :class="{Large:this.isLarge[3]}" id="3" @click="jumpToimg">
          <div class="card-header" >
            <MapLocation class="iconclass"></MapLocation>
            <h2 class="part-title">水运一张图</h2>
          </div>  
          <div class="text item part-desc"> 汇集水运数据，可视化展示船舶位置、航线和海事信息，助力海事决策</div>
      </el-card>
    </el-col>

    <el-col :span="4.8"
      ><div class="grid-content ep-bg-purple" />

        <el-card class="box-card" :class="{Large:this.isLarge[4]}" id="4" @click="jumpToimg">
          <div class="card-header" >
            <DocumentCopy class="iconclass"></DocumentCopy>
            <h2 class="part-title">分析中心</h2>
          </div>  
          <div class="text item part-desc">收集、处理和分析数据，帮助用户获取有关业务、市场和用户行为的深入见解</div>
        </el-card>
    </el-col>

    <el-col :span="6"
      ><div class="grid-content ep-bg-purple" />

        <el-card class="box-card" :class="{Large:this.isLarge[5]}" id="5" @click="jumpToimg">
          <div class="card-header" >
            <DocumentCopy class="iconclass"></DocumentCopy>
            <h2 class="part-title">潮位预报</h2>
          </div>  
          <div class="text item part-desc">根据历史和实时数据，预测未来一段时间内海洋或沿海地区的潮汐水位变化情况</div>
        </el-card>
    </el-col>
  </el-row>
</template>
  
<script>
export default {
  props:{
    messagefromparent:0
  },  
  data() {
    return {
        isLarge:[null,false,false,false,false,false],
    }
  },
  watch:{
    messagefromparent(newValue){
      // newValue存储了当前的轮播图索引，据此进行高亮
      if (!(newValue==0 || newValue==-1)) 
      {
        for(let i=1;i<this.isLarge.length;i++){
          if(i==newValue)
            this.isLarge[i] = true;
          else
            this.isLarge[i] = false;
        }
      }
      else{
        for(let i=1;i<this.isLarge.length;i++){
            this.isLarge[i] = false;
        }
      }

    }
  },
  methods: {
    jumpToimg(event){
      var targetImgIndex = event.target.closest('.box-card').id;
      this.$emit('targetImgIndex',targetImgIndex);
    }
  },
};

</script>
  

<style lang="scss">
.el-row {
  margin-bottom: 0px;
  margin-left: 7vw;
}

.el-col {
  border-radius: 4px;
}


.iconclass {
  width: 3em; height: 3em;
}

.box-card.Large {
  background-color: cadetblue;
    color: aqua;
  // h2.part-title {
  //   font-weight:900;
  // }

  // div.part-desc {
  //   // font-size: 2vh;
  // }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 15px;
}

.item {
  margin-bottom: 18px;
}

.part-desc{
  padding-top: 1vh;
}
.box-card {
  width: 15vw;
  height: 20vh;
  color: #fff;
  background-color: rgba(43, 47, 51, 0.562);
  &:hover {
    background-color: cadetblue;
    color: aqua;
    cursor: pointer;
  }
}
</style>