import { ElNotification } from "element-plus";

export function notice(
  type: "success" | "warning" | "info" | "error",
  title: string,
  msg: string
) {
  ElNotification({
    type: type,
    title: title,
    message: msg,
    offset: 100,
  });
}

export function getToken(): string | null {
  return localStorage.getItem("zymtoken");
}

export function setToken(token: string): void {
  localStorage.setItem("zymtoken", token);
}

// 防抖
export const debounce = (callback: () => void, time: number) => {
  let timeout: number | null = null;
  return () => {
    if (timeout !== null) clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback();
    }, time);
  };
};
