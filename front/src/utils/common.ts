import { ElNotification } from "element-plus";
import jsSHA from "jssha";
import Identicon from "identicon.js";

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

interface O {
  "M+": number;
  "d+": number;
  "h+": number;
  "m+": number;
  "s+": number;
  "q+": number;
  S: number;
}
export const dateFormat = (date: string, format?: string) => {
  let dateObj = new Date(Date.parse(date));
  let fmt = format || "yyyy-MM-dd hh:mm:ss";
  //author: meizz
  var o: O = {
    "M+": dateObj.getMonth() + 1, //月份
    "d+": dateObj.getDate(), //日
    "h+": dateObj.getHours(), //小时
    "m+": dateObj.getMinutes(), //分
    "s+": dateObj.getSeconds(), //秒
    "q+": Math.floor((dateObj.getMonth() + 3) / 3), //季度
    S: dateObj.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (dateObj.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1
          ? o[k as keyof O].toString()
          : ("00" + o[k as keyof O].toString()).substr(
              ("" + o[k as keyof O].toString()).length
            )
      );
  return fmt;
};

export const imgBase64 = (name: string) => {
  let shaObj = new jsSHA("SHA-512", "TEXT");
  shaObj.update(name);
  var hash = shaObj.getHash("HEX");
  let data = new Identicon(hash, 280).toString();
  return "data:image/png;base64," + data;
};

export function getLastOrNextFewDateBy(date: string, day: number) {
  function getNextDate(date: string, day: number) {
    var dd = new Date(date);
    dd.setDate(dd.getDate() + day);
    var y = dd.getFullYear();
    var m =
      dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1;
    var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
    return y + "-" + m + "-" + d;
  }

  const timeList = [];
  if (day < 0) {
    for (let i = 0; i > day; i--) {
      timeList.push(getNextDate(date, i));
    }
  } else {
    for (let i = 0; i < day; i++) {
      timeList.push(getNextDate(date, i));
    }
  }
  return timeList.reverse();
}

export function traverseDate(start: number, end: number) {
  const result = [];
  for (let d = start; d <= end; d = d + 86400000) {
    result.push(dateFormat(new Date(d).toString(), "yyyy-MM-dd"));
  }
  return result;
}
