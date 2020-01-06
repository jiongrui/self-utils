"use strict";

/**
 *
 * @param date 日期，支持 日期、时间戳、字符串格式
 * @param fmt  期望的日期格式，如： yyyy-MM-dd hh:mm:ss => 2019-11-25 12:12:30
 * @return 格式化后的日期： 2019-11-25 12:12:30
 */
export function multiFormatDate(date = new Date(), fmt = "yyyy-MM-dd") {
  if (date instanceof Date) {
  } else if (typeof date === "number") {
    date = new Date(date);
  } else {
    const dateStr = String(date);
    date = new Date(date);

    // 无效时间格式
    if (!isValidDate(date)) {
      let y = M = d = h = m = s = 0;
      if (!isNaN(Number(dateStr))) {
        y = dateStr.substr(0, 4);
        M = dateStr.substr(4, 2) - 1;
        d = dateStr.substr(6, 2);
        h = dateStr.substr(8, 2);
        m = dateStr.substr(10, 2);
        s = dateStr.substr(12, 2);
        date = new Date(y, M, d, h, m, s);
      } else {
        return "- -";
      }
    }
  }

  return formatDate(date, fmt);
}

/**
 * @param date 日期， 只支持 日期格式
 * @param fmt  期望的日期格式，如： yyyy-MM-dd hh:mm:ss => 2019-11-25 12:12:30
 * @return 格式化后的日期： 2019-11-25 12:12:30
 */
export function formatDate(date = new Date(), fmt = "yyyy-MM-dd") {
  if (!(date instanceof Date)) return;

  const o = {
    "(M+)": date.getMonth() + 1,
    "(d+)": date.getDate(),
    "(h+)": date.getHours(),
    "(m+)": date.getMinutes(),
    "(s+)": date.getSeconds()
  };

  if (new RegExp(/(y+)/).exec(fmt)) {
    const year = date.getFullYear() + "";
    const result = RegExp.$1;
    fmt = fmt.replace(result, year.substring(4 - result.length));
  }

  for (let k in o) {
    const reg = new RegExp(k);
    if (reg.exec(fmt)) {
      const result = RegExp.$1;
      fmt = fmt.replace(result, padStart(o[k], result.length));
    }
  }
  return fmt;
}

/**
 *
 * @param  date
 * @return boolean true/false
 */
export function isValidDate(date) {
  if (Object.prototype.toString.call(date) === "[object Date]") {
    // it is a date
    if (isNaN(date.getTime())) {
      // d.valueOf() could also work
      return false; // date is not valid
    }

    return true; // date is valid
  }

  // not a date
  return false;
}

/**
 *
 * @param {*} str 需要填充的目标字符串
 * @param {*} len 截取的长度
 * @param {*} fill 用来填充的字符串
 * @return 填充后的字符串 "123" => "00123"
 */
export function padStart(str, len = 2, fill = "0") {
  str = str + "";
  if (!str || len <= 0) return "";
  if (!fill || str.length >= len) return str;

  while (str.length < len) {
    str = fill + str;
  }

  return str.substring(str.length - len);
}

/**
 * A路寻址法
 * @
 */

const gameMap = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]

export function aSearch(start, end) {
  // let grid = new Grid(start, end, start)
  const openList = new WeakSet()
  const closeList = new WeakSet()
  openList.add(start)
  while (openList.length > 0) {
    const grid = openList[0]
    findNeighbor(grid, openList)
    grid = findMinGrid(openList)
  }
}

function findNeighbor(grid, openList, closeList) {
  if (isValidGrid(grid.x - 1, grid.y, openList, closeList)) {
    openList.add({ x: grid.x - 1, y: grid.y })
  }

  if (isValidGrid(grid.x - 1, grid.y, openList, closeList)) {
    openList.add({ x: grid.x - 1, y: grid.y })
  }

  if (isValidGrid(grid.x - 1, grid.y, openList, closeList)) {
    openList.add({ x: grid.x - 1, y: grid.y })
  }

  if (isValidGrid(grid.x - 1, grid.y, openList, closeList)) {
    openList.add({ x: grid.x - 1, y: grid.y })
  }
}

function findMinGrid() {
  return
}

function isValidGrid(x, y, openList, closeList) {
  if (x < 0 || x >= gameMap[0].length ||
    y < 0 || y >= gameMap.length) {
    return false
  }

  if (openList.has({ x, y })) {
    return false
  }

  if (closeList.has({ x, y })) {
    return false
  }

  return true
}

/**
 * @H G + B
 * @G 距离起点的步数
 * @B 不考虑障碍，到终点的最短距离（步数）
 */

class Grid {
  constructor(start, end, grid) {
    this.start = start
    this.end = end
    this.grid = grid
  }

  initGrid() {
    const grid = this.grid
    if (grid.parent) {
      grid.g = grid.parent.g + 1
    } else {
      grid.g = 1
    }

    grid.b = Math.abs(this.end.y - grid.y) + Math.abs(this.end.x - grid.x)
    grid.h = grid.g + grid.b
    this.grid = grid
  }
}
