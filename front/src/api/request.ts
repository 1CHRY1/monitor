import { get, post, del, patch } from "./axios-config";

export const login = async (jsonData: { email: string; password: string }) => {
  return await post(`/user/login`, true, jsonData);
};

export const getUserInfo = async () => {
  return await get(`/user/getUserInfo`, true);
};

export const multipartUpload = async (formData: FormData) => {
  return await post(`/project/multipartUpload`, false, formData);
};

export const mergeMultipartFile = async (jsonData: {
  key: string;
  total: number;
}) => {
  return await post(`/project/mergeMultipartFile`, true, jsonData);
};

export const uploadAvatar = async (formData: FormData) => {
  return await post(`/project/uploadAvatar`, true, formData);
};

export const createProject = async (jsonData: {
  projectName: string;
  avatar: string;
  description: string;
  institution: string;
  location: string;
  time: string;
  type: string;
}) => {
  return await post(`/project/createProject`, true, jsonData);
};

export const pageQueryProject = async (jsonData: {
  type: string;
  keyword: string;
  page: number;
  size: number;
}) => {
  return await post(`/project/pageQueryProject`, true, jsonData);
};

export const getAllVisualProject = async () => {
  return await get(`/project/getAllVisualProject`, true);
};

export const deleteProject = async (id: string) => {
  return await del(`/project/deleteProject/${id}`, true);
};

export const fuzzyQueryDataList = async (jsonData: {
  page: number;
  size: number;
  titleKeyword: string;
  property: string;
  flag: boolean;
  type: string;
}) => {
  return await post(`/dataList/fuzzyQuery`, true, jsonData);
};

export const getHot = async (size: number) => {
  return await get(`/dataList/getHot/${size}`, true);
};

export const getIdAndDataListName = async (size: number) => {
  return await get(`/dataList/getIdAndDataListName/${size}`, true);
};

export const getFileInfo = async (id: string) => {
  return await get(`/dataList/getFileInfo/${id}`, true);
};

export const addWatchCount = async (id: string) => {
  return await patch(`/dataList/addWatchCount/${id}`, true);
};

export const findFiles = async (dataListId: string) => {
  return await get(`/dataList/findFiles/${dataListId}`, true);
};

export const getSimilarData = async (
  type: string,
  id: string,
  size: number,
  page: number
) => {
  return await get(
    `/dataList/getSimilarData/${type}/${id}/${size}/${page}`,
    true
  );
};

export const getSandContent = async (id: string) => {
  return await get(`/visual/getSandContent/${id}`, true);
};

export const getSuspension = async (id: string) => {
  return await get(`/visual/getSuspension/${id}`, true);
};

export const getRateDirection = async (id: string) => {
  return await get(`/visual/getRateDirection/${id}`, true);
};

export const getSalinity = async (id: string) => {
  return await get(`/visual/getSalinity/${id}`, true);
};

export const getFlowSand_Z = async (id: string) => {
  return await get(`/visual/getFlowSand_Z/${id}`, true);
};

export const getCoordinates = async (visualId: string) => {
  return await get(`/visual/getCoordinates/${visualId}`, true);
};

export const getAnalysisGeoJson = async (id: string) => {
  return await get(`/visual/getAnalysisGeoJson/${id}`, true);
};

export const getContent = async (visualId: string) => {
  return await get(`/visual/getContent/${visualId}`, true);
};

export const getSection = async (fileId: string) => {
  return await get(`/visual/getSection/${fileId}`, true);
};

export const getSectionContrast = async (fileId: string) => {
  return await get(`/visual/getSectionContrast/${fileId}`, true);
};

export const getSectionFlush = async (fileId: string) => {
  return await get(`/visual/getSectionFlush/${fileId}`, true);
};

export const getDataGroup = async (dataId: string, number: number) => {
  return await get(`/browseHistory/getDataGroup/${dataId}/${number}`, true);
};

export async function getWaterLevelByStationAndTime(
  type: string,
  station: string,
  startTime: string,
  endTime: string
) {
  return await get(
    `/waterway/getWaterLevelByStationAndTime/${type}/${station}/${startTime}/${endTime}`,
    true
  );
}

export const pageList = async (jsonData: {
  type: string;
  keyword: string;
  page: number;
  size: number;
}) => {
  return await post(`/waterway/pageList`, true, jsonData);
};

export async function getBuoyByBox(
  top: number,
  right: number,
  bottom: number,
  left: number
) {
  return await get(
    `/waterway/getBuoyByBox/${top}/${right}/${bottom}/${left}`,
    false
  );
}

export async function getShipInfoByBoxAndTime(
  top: number,
  right: number,
  bottom: number,
  left: number,
  startTime: string,
  endTime: string
) {
  return await get(
    `/waterway/getShipInfoByBoxAndTime/${top}/${right}/${bottom}/${left}/${startTime}/${endTime}`,
    false
  );
}

export async function queryBoxShip(
  top: number,
  right: number,
  bottom: number,
  left: number
) {
  return await get(
    `/waterway/queryBoxShip/${top}/${right}/${bottom}/${left}`,
    false
  );
}

export async function getAnchorInfoByBox(
  top: number,
  right: number,
  bottom: number,
  left: number
) {
  return await get(
    `/waterway/getAnchorInfoByBox/${top}/${right}/${bottom}/${left}`,
    false
  );
}

export async function getParkInfoByBox(
  top: number,
  right: number,
  bottom: number,
  left: number
) {
  return await get(
    `/waterway/getParkInfoByBox/${top}/${right}/${bottom}/${left}`,
    false
  );
}
export async function getAllBridgeInfo() {
  return await get(`/waterway/getAllBridgeInfo`, true);
}

export async function getMeteorology() {
  return await get(`/waterway/getMeteorology`, true);
}

export async function getStationByBox(
  top: number,
  right: number,
  bottom: number,
  left: number
) {
  return await get(
    `/waterway/getStationByBox/${top}/${right}/${bottom}/${left}`,
    false
  );
}

export async function pageQueryAnalysis(jsonData: {
  page: number;
  size: number;
  keyword: string;
}) {
  return await post(`/analysis/pageQuery`, true, jsonData);
}

export async function getAnalysisResult(caseId: string) {
  return await get(`/analysis/getAnalysisResult/${caseId}`, true);
}

export async function addAnalysisData(jsonData: {
  caseId: string;
  list: { fileId: string; dataListId: string }[];
}) {
  return await post(`/analysis/addData`, true, jsonData);
}

export const getData = async (caseId: string) => {
  return await get(`/analysis/getData/${caseId}`, true);
};

export const delData = async (
  caseId: string,
  dataListId: string,
  fileId: string
) => {
  return await del(`/analysis/delData/${caseId}/${dataListId}/${fileId}`, true);
};

export async function addDraw(jsonData: {
  geoJson: any;
  caseId: string;
  fileName: string;
  visualType: string;
}) {
  return await post(`/analysis/addDraw`, true, jsonData);
}

export const delAnalysisResult = async (id: string) => {
  return await del(`/analysis/delAnalysisResult/${id}`, true);
};

export async function addSection(jsonData: {
  caseId: string;
  sectionId: string;
  demId: string;
  fileName: string;
}) {
  return await post(`/analysis/addSection`, true, jsonData);
}

export async function addSectionCompare(jsonData: {
  caseId: string;
  sectionId: string;
  demList: string[];
  fileName: string;
}) {
  return await post(`/analysis/addSectionCompare`, true, jsonData);
}

export async function addSectionFlush(jsonData: {
  caseId: string;
  sectionId: string;
  benchmarkId: string;
  referId: string;
  fileName: string;
}) {
  return await post(`/analysis/addSectionFlush`, true, jsonData);
}

export async function addRegionFlush(jsonData: {
  caseId: string;
  regionId: string;
  benchmarkId: string;
  referId: string;
  fileName: string;
}) {
  return await post(`/analysis/addRegionFlush`, true, jsonData);
}

export async function addElevationFlush(jsonData: {
  caseId: string;
  benchmarkId: string;
  referId: string;
  fileName: string;
}) {
  return await post(`/analysis/addElevationFlush`, true, jsonData);
}

export async function addFlushContour(jsonData: {
  caseId: string;
  benchmarkId: string;
  referId: string;
  fileName: string;
}) {
  return await post(`/analysis/addFlushContour`, true, jsonData);
}

export async function addSlope(jsonData: {
  caseId: string;
  demId: string;
  fileName: string;
}) {
  return await post(`/analysis/addSlope`, true, jsonData);
}

export async function computeVolume(jsonData: {
  caseId: string;
  regionId: string;
  demId: string;
  deep: number;
  fileName: string;
}) {
  return await post(`/analysis/computeVolume`, true, jsonData);
}

export const rename = async (jsonData: { id: string; name: string }) => {
  return await patch(`/analysis/rename`, true, jsonData);
};

export async function updateLayer(projectId: string, list: string[]) {
  return await post(`/analysis/updateLayer/${projectId}`, true, list);
}

export const getLayersInfo = async (caseId: string) => {
  return await get(`/analysis/getLayersInfo/${caseId}`, true);
};

export const findParameterByType = async (type: string) => {
  return await get(`/analysis/findParameterByType/${type}`, true);
};

export const checkState = async (key: string) => {
  return await get(`/analysis/checkState/${key}`, true);
};

export const getAllSection = async (projectId: string) => {
  return await get(`/monitorVisual/getAllSection/${projectId}`, true);
};

export const getSectionElevation = async (projectId: string) => {
  return await get(`/monitorVisual/getSectionElevation/${projectId}`, true);
};

export const getFlux = async (projectId: string) => {
  return await get(`/monitorVisual/getFlux/${projectId}`, true);
};

export const getSubstrate = async (projectId: string) => {
  return await get(`/monitorVisual/getSubstrate/${projectId}`, true);
};

export const getSandTransportNameAndType = async (projectId: string) => {
  return await get(
    `/monitorVisual/getSandTransportNameAndType/${projectId}`,
    true
  );
};

export const getSandTransportByNameAndType = async (
  projectId: string,
  name: string,
  type: string
) => {
  return await get(
    `/monitorVisual/getSandTransportByNameAndType/${projectId}/${name}/${type}`,
    true
  );
};

export const getSpeedOrientationNameAndType = async (projectId: string) => {
  return await get(
    `/monitorVisual/getSpeedOrientationNameAndType/${projectId}`,
    true
  );
};

export const getSpeed = async (
  projectId: string,
  name: string,
  type: string
) => {
  return await get(
    `/monitorVisual/getSpeed/${projectId}/${name}/${type}`,
    true
  );
};

export const getOrientation = async (
  projectId: string,
  name: string,
  type: string
) => {
  return await get(
    `/monitorVisual/getOrientation/${projectId}/${name}/${type}`,
    true
  );
};

export const getSandContentClass = async (projectId: string) => {
  return await get(`/monitorVisual/getSandContentClass/${projectId}`, true);
};

export const getSandContentValue = async (projectId: string, name: string) => {
  return await get(
    `/monitorVisual/getSandContentValue/${projectId}/${name}`,
    true
  );
};



// ----------------管理员界面相关------------------------------
export async function findByFolderId(folderId: string) {
  return 'findByFolderId';
}

export async function deleteFilesOrFolders(jsonData:{
  filesToDelete:string [],folderToDelete:string []
}) {
  return 'deleteFilesOrFolders';
}
