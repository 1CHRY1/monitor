<template>
  <div class="resource-main">
    <div class="table-head">
      <el-icon size="20px" @click="backClick"><arrow-left /></el-icon>
      <div class="path">
        <div class="path-item">user</div>
        <div class="path-item separate">/</div>
        <!-- <div v-for="(item, index) in path" :key="index" class="item">
          <div class="path-item">{{ item.name }}</div>
          <div class="path-item separate">/</div>
        </div> -->
        <!-- 数据::path -->
        <class class="item"> 
          <div class="path-item">Folder</div>
          <div class="path-item"></div>
        </class>
      </div>
      <div class="btn">
        <el-button size="small" @click="CreateFolder">创建文件夹</el-button>
        <el-button size="small" @click="flushed">刷新</el-button>
        <el-upload
          action="#"
          multiple
          :auto-upload="false"
          :show-file-list="false"
          :on-change="upLoadChange"
          ref="upload"
        >
          <el-button type="info" size="small" class="upload-btn"
            >上传</el-button
          >
        </el-upload>
      </div>
    </div>

    <div class="table" v-if="!skeletonFlag">
      <el-empty description="暂无数据" v-if="tableData.length === 0"></el-empty>
      <el-table
        v-else
        :data:="tableData"
        style="width: 100%"
        @cell-dblclick = "dblclick"
        highlight-current-row>
        <el-table-column
        prop="name"
        label="名称"
        width="700"
        ><template #default="scope">
          <!-- #default="scope" 插槽，作为参数可以让外面的方法能够访问到scope内部的数据 -->
          <div class="table-name">
            <el-checkbox
              v-model="scope.row.flag"
              size = "large"
              @change = "changeHandle(scope.row)"
            />
            <div class="text">
              <!-- getIcon 数据 获取svg图标 -->
              <el-icon><ArrowRightBold /></el-icon>
              <div class="name" >
                {{getName(scope.row)}}
              </div>
            </div>
          </div>
        </template>
        </el-table-column>

        <el-table-column
        prop="size"
        label="大小"
        ><template #default = "scope">
          <span> {{getSize(scope.row)}} </span>
        </template>
        </el-table-column>

        <el-table-column
        align = 'right'
        fixed = 'right'
        width="200"
        >
          <template #header>
            <el-button
              size="small"
              text
              type="danger"
              :disabled="selectList.length === 0"
              @click="batDelete"
              ><strong>批量删除</strong></el-button
            >
          </template>
          <template #default = "scope">
            <el-tooltip
              effect="dark"
              content="审核中"
              placement="top"
              v-if="isAudit(scope.row)"
            > <span style="margin-right: 10px">
                <el-button
                  size="small"
                  type="info"
                  @click="auditClick(scope.row)"
                  >...</el-button
                >
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
    
    
    
    
    
      </el-table>
    </div>
    <div v-else>
      <el-skeleton :rows="5" animated></el-skeleton>
    </div>
    



  </div>
</template>

<script lang="ts" setup>
  import {ref} from 'vue';
  import {Folder,File} from "@/type";

  const tableData = ref<(Folder | File)[]>([]);
  const skeletonFlag = ref(false);
  const selectList = ref<{ id: string; type: string }[]>([]);
  const path = ref<{name:string;parentId:string;id:string}[]>([]);


  const flushed = () => {
    console.log('flushed');
  }

  const backClick = () => {
    console.log('backClick');
    
  }

  const CreateFolder = () => {
    console.log('CreateFolder'); 
  }

  const getName=( item : Folder | File)=>{
    console.log('getItemName');
    // if ("fileName" in item) {
    //     return item.fileName;
    //  } else {
    //     return item.folderName;
    // }
    return 'fileName';
  }

  const getSize= (item : Folder | File)=>{
    console.log('getItemSize');
    // if("size" in item){
    //   return item.size;
    // }else{
    //   return "";
    // }
    return 'filesize';
  }

  const batDelete = () => {
    console.log('batDelete');
  }

  const  isAudit = (item:Folder|File) => {
    // if ("fileName" in item) {
    //     if (item.visualType === "audit") {
    //       return true;
    //     } else {
    //       return false;
    //     }
    //   } else {
    //     return false;
    //   }
    return true;
  }


  const auditClick = (item:Folder|File) => {
    console.log('auditClick');
  }

  const lookscope = (scope:any) => {
    console.log(scope);
  }

  const upLoadChange = () => {
    console.log('upLoadChange');
  }

  const changeHandle = (item:Folder|File) => {
    console.log(item+'checkbox CHANGE');
  }


  const dblclick = async (row:Folder|File)=>{
    console.log('double click!');
  }

  let i =0;
  while(i<2){
    tableData.value.push({
      id: 'string',
      fileName: 'string',
      visualType: 'string',
      size: 'string',
      uploader: 'string',
      folderId: 'string',
      visualId: 'string',
      flag: true,
      view: 'string',
    });
    i++;
  }


</script>

<style lang="scss" scoped>
.resource-main {
  position: relative;
  height: 80vh;
  width: 80vw;
  margin: 10vh,10vw;
  .table-head {
    height: 25px;
    display: flex;
    position: relative;
    .el-icon {
      cursor: pointer;
    }
    .path {
      cursor: pointer;
      width: 60%;
      display: flex;
      .item {
        display: flex;
      }
      .path-item {
        height: 20px;
        line-height: 20px;
      }
      .separate {
        color: #b7bbc3;
        margin: 0 5px;
      }
    }
    .btn {
      position: absolute;
      right: 0px;
      display: flex;
      .upload-btn {
        margin-left: 10px;
      }
    }
  }
  .table {
    height: calc(100% - 50px);
    .el-table {
      height: 100%;
      cursor: pointer;
      .table-name {
        display: flex;
        .text {
          display: flex;
          line-height: 30px;

          .name {
            width: 620px;
            margin-left: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .el-checkbox {
          margin-right: 5px;
          height: 30px;
        }
      }

      :deep().el-table__inner-wrapper::before {
        width: 0;
      }
    }
  }

    :deep().el-dialog {
    .el-dialog__header {
      padding: 0;
    }
    .el-dialog__body {
      padding: 0;
    }
  }
}
</style>