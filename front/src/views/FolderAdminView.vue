<template>
  <el-row :gutter="20">
    <el-col :span="16" :offset="4">
      <div class="resource-main">
        <div class="table-head">
          <el-icon size="20px" @click="backClick"><arrow-left /></el-icon>
          <div class="path">
            <div class="path-item">user</div>
            <div class="path-item separate">/</div>
            <div v-for="(item, index) in path" :key="index" class="item">
              <div class="path-item">{{ item.name }}</div>
              <div class="path-item separate">/</div>
           </div>
            <!-- 数据::path -->
            <!-- <div class="item">
              <div class="path-item">Folder</div>
              <div class="path-item"></div>
            </div> -->
          </div>
          <div class="btn">
            <el-button size="default" @click="CreateFolder">创建文件夹</el-button>
            <el-button size="default" @click="flushed">刷新</el-button>
            <el-upload action="#" multiple :auto-upload="false" :show-file-list="false" :on-change="upLoadChange"
              ref="upload">
              <el-button type="primary" size="default" class="upload-btn">上传</el-button>
            </el-upload>
          </div>
        </div>

        <div class="table" v-if="!skeletonFlag">
          <el-empty description="暂无数据" v-if="tableData.length === 0"></el-empty>
          <el-table v-else :data="tableData" style="width: 100%" @cell-dblclick="dblclick" highlight-current-row>
            <el-table-column prop="name" label="名称" width="700">
              <template #default="scope">
                <!-- #default="scope" 插槽，作为参数可以让外面的方法能够访问到scope内部的数据 -->
                <div class="table-name">
                  <el-checkbox v-model="scope.row.flag" size="large" @change="changeHandle(scope.row)" />
                  <div class="text">
                    <!-- getIcon 数据 获取svg图标 -->
                    <el-icon><FolderChecked style="margin-top: 13px;"/></el-icon>
                    <div class="name">
                      {{ getName(scope.row) }}
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="size" label="大小">
              <template #default="scope">
                <span> {{ getSize(scope.row) }} </span>
              </template>
            </el-table-column>

            <el-table-column align='right' fixed='right' width="200">
              <template #header>
                <el-button size="small" :text="true" type="danger" :disabled="selectList.length === 0"
                  @click="batDelete"><strong>批量删除</strong></el-button>
              </template>
              <template #default="scope">

                <el-tooltip effect="dark" content="预览" placement="top"> <span
                    style="margin-right: 10px">
                    <el-button size="small" type="primary" @click="previewClick(scope.row)" plain>
                      <el-icon><View /></el-icon>
                    </el-button>
                  </span>
                </el-tooltip>

                <el-tooltip effect="dark" content="绑定可视化数据" placement="top">
                  <span style="margin-right: 10px">
                    <el-button size="small" v-if="!isFolder(scope.row)" @click="visualClick(scope.row)"
                    ><el-icon><Share /></el-icon
                    ></el-button>
                  </span>
                </el-tooltip>



                <el-tooltip effect="dark" content="下载" placement="top"> <span
                    style="margin-right: 10px">
                    <el-button size="small" type="primary" @click="downloadClick(scope.row)" plain>
                      <el-icon><Download /></el-icon>
                    </el-button>
                  </span>
                </el-tooltip>
                <el-tooltip effect="dark" content="删除" placement="top"> <span
                    style="margin-right: 10px">
                    <el-button size="small" type="primary" @click="deleteClick(scope.row)" plain>
                      <el-icon><Delete /></el-icon></el-button>
                  </span>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div v-else>
          <el-skeleton :rows="5" animated></el-skeleton>
        </div>

        <el-dialog v-model="Visible_CreateFolderDialog" width="25%" :show-close="false" title="创建文件夹">
          <!-- 这里是一个组件，专门写CreateFolderDialog -->
          <span>  文件夹名:
              <el-input v-model="input" ref="inputFocus" />
          </span>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="Visible_CreateFolderDialog = false">取消</el-button>
              <el-button type="primary" @click="Visible_CreateFolderDialog = false">
                确定
              </el-button>
            </span>
          </template>
        </el-dialog>

        <el-dialog v-model="Visible_PreviewDialog" width="25%" :show-close="false" title="预览">
          <!-- 一个组件，专门写PreviewDialog -->
          <span>  Preview dialog  </span>
          <template #footer>
            <span class="dialog-footer">
                <el-button @click="Visible_PreviewDialog = false">取消</el-button>
            </span>
          </template>
        </el-dialog>


        <el-dialog v-model="Visible_DeleteDialog" width="25%" :show-close="false" title="删除">
          <span>  确定删除文件？
          </span>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="Visible_DeleteDialog = false">取消</el-button>
              <el-button type="primary" @click="Visible_DeleteDialog = false">
                确定
              </el-button>
            </span>
          </template>
        </el-dialog>

       
        <el-dialog v-model="Visible_BindDialog" width="600px">
          <!-- 一个组件，专门写VisualDataBind -->
          <visual-data-bind
            v-if="Visible_BindDialog"
            :fileInfo="fileInfo"
            @updateVisualFile="updateVisualFile"
          ></visual-data-bind>
        </el-dialog>
        
        <!-- 其他dialog   预览等-->
      </div>
    </el-col>

  </el-row>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { Folder, File } from "@/type";
import { ElMessageBox, ElMessage } from 'element-plus';

const tableData = ref<(Folder | File)[]>([]);
const fileInfo =  ref<any>();
const skeletonFlag = ref(true);
const selectList = ref<{ id: string; type: string }[]>([]);
const path = ref<{ name: string; parentId: string; id: string }[]>([]);
const Visible_CreateFolderDialog = ref(false);
const Visible_PreviewDialog = ref(false);
const Visible_DeleteDialog = ref(false);
const Visible_BindDialog = ref(false);
const input = ref("");
const inputFocus = ref<HTMLElement>();


const getName = (item: Folder | File) => {
  // console.log('getItemName');
  // if ("fileName" in item) {
  //     return item.fileName;
  //  } else {
  //     return item.folderName;
  // }
  return '测试文件夹';
}

const getSize = (item: Folder | File) => {
  // console.log('getItemSize');
  // if("size" in item){
  //   return item.size;
  // }else{
  //   return "";
  // }
  return '666 MB';
}



const isFolder = (item: Folder | File) => {
  if ("fileName" in item) {
      return false;
    } else {
      return true;
    }
}




const flushed = () => {
  // console.log('flushed');
  // 基于path的最后的文件夹的ID 请求数据，transition to TableData
}



const previewClick= (param: Folder|File)=> {
  // console.log('previewClick');
  Visible_PreviewDialog.value = true;
}

const deleteClick = (param: Folder|File)=> {
  // console.log('deleteClick');
  Visible_DeleteDialog.value = true;
}

const visualClick = (param: Folder|File)=> {
  // console.log('visualClick');
}

const CreateFolder = () => {
  // console.log('CreateFolder');
  Visible_CreFolderDialog.value = true;
  
}


const batDelete = () => { 

  // console.log('batDelete');
  ElMessageBox.confirm("确定删除文件夹及文件夹以下内容", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    console.log('batDelete');

    //构建一个待删除数据的json对象 
    let deleteList:{filesToDelete:string[],foldersToDelete:string[]} = {
      filesToDelete : [],
      foldersToDelete : []
    };
    
    for(let i = 0;i<selectList.value.length;i++){
      if('fileName' in selectList.value[i]){
        deleteList.filesToDelete.push(selectList.value[i].id);
      }else{
        deleteList.foldersToDelete.push(selectList.value[i].id);                           
      }
    }
    // 构建后  作为传输传给后端进行删除
    console.log(deleteList);



    ElMessage({
      type: "success",
      message: "删除成功",
    });
    
  })
}

const downloadClick = (item: Folder | File) => {
  //基于ID 获取文件下载URL
  //。。。。。。
}




const upLoadChange = () => {
  // console.log('upLoadChange');
}

const changeHandle = (item: Folder | File) => {
  //checkBox  to  select List
  if(item.flag){
    if('folderName' in item){
      selectList.value.push({
        id: item.id,type:'folder',
      });
    }else {
      selectList.value.push({
        id: item.id,type:'file',
      })
    }
  }else{
    for(let i = 0;i<selectList.value.length ;i++){
      if(item.id === selectList.value[i].id){
        //Arr.splice(i,1)  从i位置开始删除1个元素
        selectList.value.splice(i,1);
      }
    }
  }
  console.log(selectList.value.length);
}


const dblclick = async (item: Folder | File) => {
  //双击进入文件夹
  // console.log('double click!');
  if('fileName' in item){
    //基于id 向后端拿数据  后 transition 为tableData
    //path也得更新

  }
}

const backClick = () => {
  //返回上级文件夹
  path.value.pop();
  if(path.value.length > 0){ // 有上层文件夹
  //基于parentID 向后端拿数据  后 transition 为tableData,
  }

}

onMounted(() => {

  let i = 0;
  while (i < 4) {
    tableData.value.push({
      id: 'string'+i,
      folderName: '测试文件',
      parentId: 'string',
      flag: false,
    });
    i++;
  }
  // 上述直接代替了：从后端请求数据datalist、transitionData把datalist转为tableData的过程

  skeletonFlag.value = false;

})


</script>

<style lang="scss" scoped>
.resource-main {
  position: relative;
  margin-top: 3vh;

  .table-head {
    height: 5vh;
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