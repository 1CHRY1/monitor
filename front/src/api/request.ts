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
