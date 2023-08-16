<template>
  <el-row class="row-bg" justify="space-evenly">
    <el-col :span="6"
      ><div class="grid-content ep-bg-purple" />
      <Monitor style="width: 3em; height: 3em; margin-right: 8px"></Monitor>
      <h2>大屏展示</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur sed
        repellat impedit, modi nulla earum?
      </p>
    </el-col>
    <el-col :span="6"
      ><div class="grid-content ep-bg-purple-light" />
      <DocumentCopy
        style="width: 3em; height: 3em; margin-right: 8px"
      ></DocumentCopy>
      <h2>后台管理</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur sed
        repellat impedit, modi nulla earum?
      </p>
    </el-col>
    <el-col :span="6"
      ><div class="grid-content ep-bg-purple" />
      <Operation style="width: 3em; height: 3em; margin-right: 8px"></Operation>
      <h2>一个功能</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur sed
        repellat impedit, modi nulla earum?
      </p>
    </el-col>
  </el-row>
</template>
  
  <script>
export default {};
</script>
  
  <style scoped>
.el-row {
  margin-bottom: 20px;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>