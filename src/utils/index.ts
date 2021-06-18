import { isDeepStrictEqual } from "util";

export const copyTextToClipboard = (value: string) => {
  var textArea = document.createElement("textarea");
  textArea.style.background = 'transparent';
  textArea.value = value;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    var successful = document.execCommand('copy');
  } catch (err) {
    console.log('Oops, unable to copy');
  }
  document.body.removeChild(textArea);
}

// 去除空格,type: 1-所有空格 2-前后空格 3-前空格 4-后空格
export const trim = (str: string, type: number) => {
  type = type || 1
  switch (type) {
    case 1:
      return str.replace(/\s+/g, "");
    case 2:
      return str.replace(/(^\s*)|(\s*$)/g, "");
    case 3:
      return str.replace(/(^\s*)/g, "");
    case 4:
      return str.replace(/(\s*$)/g, "");
    default:
      return str;
  }
}

export function isEqual(a: any, b: any) {
  return a === b
}

// 获取url的全部参数键值对或某个参数值
export function getUrlParams(url: string, key: string) {
  if (isEqual(url.indexOf('?'), -1)) {
    return key ? undefined : {}
  }
  const params: any = {}
  const paramStr = url.split('?')[1]
  const paramArr = paramStr.split('&')
  paramArr.forEach(item => {
    const [key1, value1] = item.split('=')
    if (value1.indexOf(',') > -1) {
      const value2 = value1.split(',')
      params[key1] = value2
    } else {
      params[key1] = value1
    }
  })
  return key ? params[key] : params
}
