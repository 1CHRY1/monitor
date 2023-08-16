export interface ResponseType {
  code: number;
  msg: string;
  data: any;
}

export interface ProjectType {
  id: string;
  projectName: string;
  avatar: string;
  description: string;
  institution: string;
  location: string;
  time: string;
  type: string;
}

export interface DataListType {
  id: string;
  name: string;
  location: string[];
  description: string;
  tags: string[];
  createTime: string;
  updateTime: string;
  download: number;
  watch: number;
  avatar: string;
  provider: string;
  range: string;
  type: string;
  providerPhone: string;
  providerEmail: string;
  providerAddress: string;
  detail: string;
  timeStamp: string;
}
