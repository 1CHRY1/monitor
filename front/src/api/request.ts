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
