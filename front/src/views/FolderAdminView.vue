<template>
  <div class="main">
    <el-row :gutter="0">
      <el-col :span="14" :offset="5">
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
            </div>
            <div class="btn">
              <el-button size="default" @click="OpenCreateFolder"
                >创建文件夹</el-button
              >
              <el-button size="default" @click="flushed">刷新</el-button>
              <el-upload
                action="#"
                multiple
                :auto-upload="false"
                :show-file-list="false"
                :on-change="upLoadChange"
                ref="upload"
              >
                <el-button type="primary" size="default" class="upload-btn"
                  >上传</el-button
                >
              </el-upload>
            </div>
          </div>

          <div class="table" v-if="!skeletonFlag">
            <el-empty
              description="暂无数据"
              v-if="tableData.length === 0"
            ></el-empty>
            <el-table
              v-else
              :data="tableData"
              style="width: 100%"
              @cell-dblclick="dblclick"
              highlight-current-row
            >
              <el-table-column prop="name" label="名称" width="500">
                <template #default="scope">
                  <!-- #default="scope" 插槽，作为参数可以让外面的方法能够访问到scope内部的数据 -->
                  <div class="table-name">
                    <!-- <el-checkbox v-model="scope.row.flag" size="large" @change="changeHandle(scope.row)" /> -->
                    <label class="container">
                      <input
                        v-model="scope.row.flag"
                        type="checkbox"
                        @change="changeHandle(scope.row)"
                      />
                      <div class="checkmark"></div>
                    </label>
                    <div class="text">
                      <el-icon v-show="isFolder(scope.row)"
                        ><FolderChecked style="margin-top: 1vh"
                      /></el-icon>
                      <el-icon v-show="!isFolder(scope.row)"
                        ><Document style="margin-top: 1vh"
                      /></el-icon>
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

              <el-table-column align="right" fixed="right" width="300">
                <template #header>
                  <el-button
                    size="small"
                    :text="true"
                    type="danger"
                    :disabled="selectList.length === 0"
                    :hide-after="50"
                    @click="batDelete"
                    ><strong>批量删除</strong></el-button
                  >
                </template>
                <template #default="scope">
                  <el-tooltip
                    effect="dark"
                    content="预览"
                    placement="top"
                    :hide-after="50"
                    v-if="!isFolder(scope.row)"
                  >
                    <span style="margin-right: 10px">
                      <el-button
                        size="small"
                        type="primary"
                        @click="previewClick(scope.row)"
                        plain
                      >
                        <el-icon><View /></el-icon>
                      </el-button>
                    </span>
                  </el-tooltip>

                  <el-tooltip
                    effect="dark"
                    content="绑定可视化数据"
                    placement="top"
                    :hide-after="50"
                    v-if="!isFolder(scope.row)"
                  >
                    <span style="margin-right: 10px">
                      <el-button
                        size="small"
                        type="primary"
                        v-if="!isFolder(scope.row)"
                        @click="visualClick(scope.row)"
                        plain
                        ><el-icon><Share /></el-icon
                      ></el-button>
                    </span>
                  </el-tooltip>

                  <el-tooltip
                    effect="dark"
                    content="下载"
                    placement="top"
                    :hide-after="50"
                    v-if="!isFolder(scope.row)"
                  >
                    <span style="margin-right: 10px">
                      <el-button
                        size="small"
                        type="primary"
                        @click="downloadClick(scope.row)"
                        plain
                      >
                        <el-icon><Download /></el-icon>
                      </el-button>
                    </span>
                  </el-tooltip>
                  <el-tooltip
                    effect="dark"
                    content="删除"
                    placement="top"
                    :hide-after="50"
                  >
                    <span style="margin-right: 10px">
                      <el-button
                        size="small"
                        type="primary"
                        @click="deleteClick(scope.row)"
                        plain
                      >
                        <el-icon><Delete /></el-icon
                      ></el-button>
                    </span>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div v-else>
            <el-skeleton :rows="5" animated></el-skeleton>
          </div>

          <el-dialog
            v-model="Visible_CreateFolderDialog"
            width="15%"
            :show-close="false"
          >
            <!-- 这里是一个组件，专门写CreateFolderDialog -->
            <FolderDialog
              @createFolder="CreateFolder"
              v-if="Visible_CreateFolderDialog"
              :folderNames="folderNames"
            >
            </FolderDialog>
          </el-dialog>

          <el-dialog
            v-model="Visible_PreviewDialog"
            width="25%"
            :show-close="false"
          >
            <!-- 一个组件，专门写PreviewDialog -->
            <DataPreviewDialog
              :fileInfo="fileInfo"
              v-if="Visible_PreviewDialog"
            ></DataPreviewDialog>
          </el-dialog>

          <el-dialog v-model="Visible_BindDialog" width="600px">
            <!-- 一个组件，专门写VisualDataBind -->
            <visualBindDialog
              v-if="Visible_BindDialog"
              :fileInfo="fileInfo"
              @updateVisualFile="updateVisualFile"
            ></visualBindDialog>
          </el-dialog>

          <!-- 其他dialog   预览等-->
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { FolderType, FileType } from "@/type";
import { notice, uuid, getFileSize } from "@/utils/common";
import { ElMessageBox, ElMessage, rowContextKey } from "element-plus";
import VisualBindDialog from "@/components/admin/VisualBindDialog.vue";
import DataPreviewDialog from "@/components/admin/DataPreviewDialog.vue";
import FolderDialog from "@/components/admin/FolderDialog.vue";
import {
  findByFolderId,
  deleteFilesOrFolders,
  getDownloadURL,
  addFolder,
} from "@/api/request";
import { UploadFile, UploadFiles } from "element-plus";
// import useStore from 'vuex';

// const store = useStore();
const tableData = ref<
  ((FolderType & { flag: boolean }) | (FileType & { flag: boolean }))[]
>([]);
const fileInfo = ref<any>();
const skeletonFlag = ref(true);
const selectList = ref<{ id: string; type: string }[]>([]);
const path = ref<{ name: string; parentId: string; id: string }[]>([]);
const folderNames = ref<{ name: string; parentId: string; id: string }[]>([]);
const Visible_CreateFolderDialog = ref(false);
const Visible_PreviewDialog = ref(false);
const Visible_BindDialog = ref(false);
const upload = ref<HTMLElement>();
// const Visible_BindDialog = ref(false);
const input = ref("");
const inputFocus = ref<HTMLElement>();

const getName = (item: FolderType | FileType) => {
  if ("fileName" in item) {
    return item.fileName;
  } else {
    return item.folderName;
  }
  // return '测试文件夹';
};

const getSize = (item: FolderType | FileType) => {
  if ("size" in item) {
    return item.size;
  } else {
    return "";
  }
  // return '666 MB';
};

const isFolder = (item: FolderType | FileType) => {
  if ("fileName" in item) {
    return false;
  } else {
    return true;
  }
};

const flushed = async () => {
  // console.log('flushed');
  // 基于path的最后的文件夹的ID 请求数据，transition to TableData

  skeletonFlag.value = true;

  let id = "";
  if (path.value.length === 0) {
    id = "-1";
  } else {
    id = path.value[path.value.length - 1].id;
  }
  const data = await findByFolderId(id);
  if (data != null && data.code === 0) {
    transitionData(data.data);
    skeletonFlag.value = false;
  } else {
    transitionData([]);
    skeletonFlag.value = false;
  }
};

const previewClick = (param: FolderType | FileType) => {
  fileInfo.value = param;
  Visible_PreviewDialog.value = true;
};

const deleteClick = (item: FolderType | FileType) => {
  ElMessageBox.confirm("确定删除文件夹及文件夹以下内容", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const json: { files: string[]; folders: string[] } = {
        files: [],
        folders: [],
      };
      if ("folderName" in item) {
        json.folders.push(item.id);
      } else {
        json.files.push(item.id);
      }
      console.log(json);

      const data = await deleteFilesOrFolders(json); //后端删除数据,返回的是？
      if (data != null && (data as any).code === 0) {
        //假设返回的还是原来的东西，那后端干啥了?
        for (let i = 0; i < tableData.value.length; i++) {
          if (tableData.value[i].id === item.id) {
            //这里的意义是再确认一遍？ 前端删除
            console.log("找到你小子了");

            tableData.value.splice(i, 1);
            break;
          }
        }
        notice("success", "成功", "删除成功");
      } else {
        notice("error", "错误", "删除失败");
      }
    })
    .catch(() => {});
};

const visualClick = (param: FolderType | FileType) => {
  // console.log('visualClick');
  fileInfo.value = param;
  Visible_BindDialog.value = true;
};

const OpenCreateFolder = async () => {
  Visible_CreateFolderDialog.value = true;
};

const CreateFolder = async (val: string) => {
  const jsonData = {
    folderName: val,
    parentId: path.value.length > 0 ? path.value[path.value.length - 1].id : "",
  };
  const data = await addFolder(jsonData); //后端创建文件夹数据，返回
  if (data && data.code === 0) {
    tableData.value.push({
      id: data.data.id,
      folderName: jsonData.folderName,
      parentId: jsonData.parentId,
      flag: false,
    });
    notice("success", "成功", "文件夹创建成功！");
    Visible_CreateFolderDialog.value = false;
  } else {
    notice("error", "错误", "文件夹创建失败！");
  }
}; 

const updateVisualFile = (val: { visualId: string; visualType: string }) => {
  for (let i = 0; i < tableData.value.length; i++) {
    if (tableData.value[i].id === fileInfo.value.id) {
      (tableData.value[i] as FileType).visualType = val.visualType;
      (tableData.value[i] as FileType).visualId = val.visualId;
      break;
    }
  }
  Visible_BindDialog.value = false;
};

const batDelete = async () => {
  //还是Delete的思想，但是是基于selectList的items删除

  ElMessageBox.confirm("确定删除文件夹及文件夹以下内容", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      //构建一个待删除数据的json对象
      let deleteList: { files: string[]; folders: string[] } = {
        files: [],
        folders: [],
      };

      for (let i = 0; i < selectList.value.length; i++) {
        if ("fileName" in selectList.value[i]) {
          deleteList.files.push(selectList.value[i].id);
        } else {
          deleteList.folders.push(selectList.value[i].id);
        }
      }
      console.log(deleteList);

      // 构建后  作为传输传给后端进行删除

      const data = await deleteFilesOrFolders(deleteList);
      console.log(data);

      if (data != null && (data as any).code === 0) {
        for (let i = 0; i < selectList.value.length; i++) {
          for (let j = 0; j < tableData.value.length; j++) {
            if (tableData.value[j].id === selectList.value[i].id) {
              // 前端删除?
              tableData.value.splice(j, 1);
              break;
            }
          }
        }
        selectList.value = [];
        notice("success", "成功", "删除成功");
      }
    })
    .catch(() => {
      notice("error", "错误", "删除失败");
    });
};

const downloadClick = async (item: FolderType | FileType) => {
  //基于ID 获取文件下载URL
  window.location.href = `${process.env.VUE_APP_BACK_ADDRESS}files/downloadFile/${item.id}`;
};

const upLoadChange = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  console.log(uploadFile, uploadFiles);
  // (upload.value as any).clearFiles();
  // store.commit("ADD_WAIT_ITEM", {
  //   id: uuid(),
  //   name: uploadFile.name,
  //   file: uploadFile.raw!,
  //   size: getFileSize(uploadFile.size!),
  // });
  // store.dispatch("uploadFiles", {
  //   parentId:
  //     path.value.length === 0 ? "" : path.value[path.value.length - 1].id,
  // });
};

const changeHandle = (
  item: (FolderType & { flag: boolean }) | (FileType & { flag: boolean })
) => {
  //checkBox  to  select List
  if (item.flag) {
    if ("folderName" in item) {
      selectList.value.push({
        id: item.id,
        type: "folder",
      });
    } else {
      selectList.value.push({
        id: item.id,
        type: "file",
      });
    }
  } else {
    for (let i = 0; i < selectList.value.length; i++) {
      if (item.id === selectList.value[i].id) {
        //Arr.splice(i,1)  从i位置开始删除1个元素
        selectList.value.splice(i, 1);
      }
    }
  }
  // console.log(selectList.value.length);
};

const dblclick = async (item: FolderType | FileType) => {
  //双击进入文件夹

  if ("folderName" in item) {
    //基于id 向后端拿数据  后 transition 为tableData
    //path也得更新
    const data = await findByFolderId(item.id); //拿到item的所有下级文件信息
    if (data && data.code === 0) {
      transitionData(data.data);
      path.value.push({
        id: item.id,
        name: item.folderName,
        parentId: item.parentId,
      });
    }
  }
};

const backClick = async () => {
  if (path.value.length > 0) {
    let parentId: string = "-1";
    if (path.value[path.value.length - 1].parentId != "") {
      parentId = path.value[path.value.length - 1].parentId;
    }
    //取出parentId，重新请求数据
    const dataList = await findByFolderId(parentId);
    if (dataList && dataList.code === 0) {
      transitionData(dataList.data);
      path.value.pop();
    }
  } else {
    const dataList = await findByFolderId("-1");
    if (dataList && dataList.code === 0) {
      transitionData(dataList.data);
      path.value.pop();
    }
  }
};

const transitionData = (param: FolderType[] | FileType[]) => {
  tableData.value = [];
  param.forEach((item) => {
    tableData.value.push({ ...item, flag: false });
  });
};

onMounted(async () => {
  const tableList = await findByFolderId("-1");
  if (tableList && tableList.code === 0) {
    transitionData(tableList.data);
  }
  skeletonFlag.value = false;
});
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
          padding: 0vw 1vw;

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

.container {
  --input-focus: #2d8cf0;
  --input-out-of-focus: #ccc;
  --bg-color: #fff;
  --bg-color-alt: #666;
  --main-color: #323232;
  position: relative;
  cursor: pointer;
  input {
    position: absolute;
    opacity: 0;
  }
}

.container input {
  position: absolute;
  opacity: 0;
}

.checkmark {
  width: 25px;
  height: 25px;
  position: relative;
  top: 0;
  left: 0;
  border: 2px solid var(--main-color);
  border-radius: 5px;
  box-shadow: 2.5px 2.5px var(--main-color);
  background-color: var(--input-out-of-focus);
  transition: all 0.3s;
  :after {
    content: "";
    width: 5px;
    height: 13px;
    position: absolute;
    top: 1px;
    left: 8px;
    display: none;
    border: solid var(--bg-color);
    border-width: 0 2.5px 2.5px 0;
    transform: rotate(45deg);
  }
}

.container input:checked ~ .checkmark {
  background-color: var(--input-focus);
}

.checkmark:after {
  content: "";
  width: 5px;
  height: 13px;
  position: absolute;
  top: 1px;
  left: 8px;
  display: none;
  border: solid var(--bg-color);
  border-width: 0 2.5px 2.5px 0;
  transform: rotate(45deg);
}

.container input:checked ~ .checkmark:after {
  display: block;
}

:deep() .el-row {
  margin-right: 0;
}

.el-icon {
  font-size: 20px;
}
</style>