"use strict";

/**
 *
 * @param date 日期，支持 日期、时间戳、字符串格式
 * @param fmt  期望的日期格式，如： yyyy-MM-dd hh:mm:ss => 2019-11-25 12:12:30
 * @return 格式化后的日期： 2019-11-25 12:12:30
 */
function multiFormatDate(date = new Date(), fmt = "yyyy-MM-dd") {
  if (date instanceof Date) {
  } else if (typeof date === "number") {
    date = new Date(date);
  } else {
    const dateStr = String(date);
    date = new Date(date);

    // 无效时间格式
    if (!isValidDate(date)) {
      let y = (M = d = h = m = s = 0);
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
function formatDate(date = new Date(), fmt = "yyyy-MM-dd") {
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
function isValidDate(date) {
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
function padStart(str, len = 2, fill = "0") {
  str = str + "";
  if (!str || len <= 0) return "";
  if (!fill || str.length >= len) return str;

  while (str.length < len) {
    str = fill + str;
  }

  return str.substring(str.length - len);
}

/**
 * A星寻路法
 *
 * @G 距离起点的步数
 * @H 不考虑障碍，到终点的最短距离（步数）
 * @F G + H
 */
//迷宫地图
const MAZE = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

function aSearch(start, end) {
  //可到达的格子
  const openList = new Set();
  //已到达的格子
  const closeList = new Set();
  openList.add(start);
  while (openList.length > 0) {
    //在openList中查找F值最小的节点，将其作为当前节点
    const currentGrid = findMinGrid(openList);

    //将当前节点在openList中删除
    openList.delete(currentGrid);
    // 将当前节点添加到closeList中
    closeList.add(currentGrid);

    const neighbors = findNeighbors(currentGrid, openList, closeList);

    for (let grid of neighbors) {
      if (!openList.has(grid)) {
        // 临近节点不在openList，标记父节点parent、G、H、F，并放入openList
        grid.initGrid(currentGrid, end);
        openList.add(grid);
      }
    }

    // 如果终点在openList中，直接返回终点
    for (let grid of openList) {
      if (grid.x === end.x && grid.y === end.y) {
        return grid;
      }
    }
  }
  // openList用尽，仍然找不到终点，说明终点不可达，返回空
  return null;
}

function findMinGrid(openList) {
  let tempGrid = openList[0];
  for (let grid of openList) {
    if (grid.f < tempGrid) {
      tempGrid = grid.f;
    }
  }
  return tempGrid;
}

function findNeighbors(grid, openList, closeList) {
  const gridList = new Set();
  if (isValidGrid(grid.x - 1, grid.y, openList, closeList)) {
    gridList.add(new Grid(grid.x - 1, grid.y));
  }

  if (isValidGrid(grid.x + 1, grid.y, openList, closeList)) {
    gridList.add(new Grid(grid.x + 1, grid.y));
  }

  if (isValidGrid(grid.x, grid.y - 1, openList, closeList)) {
    gridList.add(new Grid(grid.x - 1, grid.y));
  }

  if (isValidGrid(grid.x, grid.y + 1, openList, closeList)) {
    gridList.add(new Grid(grid.x, grid.y + 1));
  }
  return gridList;
}

function isValidGrid(x, y, openList, closeList) {
  if (x < 0 || x >= gameMap[0].length || y < 0 || y >= gameMap.length) {
    return false;
  }

  if (MAZE[x][y] === 1) {
    return false;
  }

  if (containGrid(openList, x, y)) {
    return false;
  }

  if (containGrid(closeList, x, y)) {
    return false;
  }

  return true;
}

function containGrid(gridList, x, y) {
  for (let grid of gridList) {
    if (grid.x === x && grid.y === y) {
      return true;
    }
  }
  return false;
}

class Grid {
  x;
  y;
  f;
  g;
  h;
  parent;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  initGrid(parent, end) {
    this.parent = parent;
    if (parent) {
      this.g = parent.g + 1;
    } else {
      this.g = 1;
    }

    this.h = Math.abs(end.y - this.y) + Math.abs(end.x - this.x);
    this.f = this.g + this.h;
  }
}

// example

function example() {
  const start = new Grid(2, 1);
  const end = new Grid(7, 4);
  let resultGrid = aSearch(start, end);
  const path = new Set();
  while (resultGrid) {
    path.add(new Grid(resultGrid.x, resultGrid.y));
    resultGrid = resultGrid.parent;
  }

  let str = "";
  for (let y = 0; y < MAZE.length; y++) {
    if (y > 0) {
      str += "/n";
    }
    for (let x = 0; x < MAZE[0].length; x++) {
      if (containGrid(path, x, y)) {
        str += "*";
      } else {
        str += MAZE[x][y] + "";
      }
    }
  }
  console.log("example /n", str);
}
