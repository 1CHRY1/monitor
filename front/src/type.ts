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
