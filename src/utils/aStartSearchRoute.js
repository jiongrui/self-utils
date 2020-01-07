/**
 * A星寻路法
 *
 * @G 距离起点的步数
 * @H 不考虑障碍，到终点的最短距离（步数）
 * @F G + H
 */
// 迷宫地图
const MAZE = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 1, 0, 1, 0, 0],
  [0, 1, 0, 0, 0, 1, 0, 1, 0, 0],
  [0, 0, 0, 0, 1, 1, 0, 0, 1, 0],
  [0, 0, 1, 0, 1, 1, 0, 0, 0, 0],
  [0, 0, 1, 0, 1, 0, 0, 1, 0, 0],
  [0, 0, 1, 0, 1, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]

export function aSearch(start, end) {
  // 可到达的格子
  const openList = new Set()
  // 已到达的格子
  const closeList = new Set()
  openList.add(start)
  while (openList.size > 0) {
    // 在openList中查找F值最小的节点，将其作为当前节点
    const currentGrid = findMinGrid(openList)

    // 将当前节点在openList中删除
    openList.delete(currentGrid)
    // 将当前节点添加到closeList中
    closeList.add(currentGrid)

    const neighbors = findNeighbors(currentGrid, openList, closeList)

    for (let grid of neighbors) {
      if (!openList.has(grid)) {
        // 临近节点不在openList，标记父节点parent、G、H、F，并放入openList
        grid.initGrid(currentGrid, end)
        openList.add(grid)
      }
    }

    // 如果终点在openList中，直接返回终点
    for (let grid of openList) {
      if (grid.x === end.x && grid.y === end.y) {
        return grid
      }
    }
  }
  // openList用尽，仍然找不到终点，说明终点不可达，返回空
  return null
}

function findMinGrid(openList) {
  let tempGrid = Array.from(openList)[0]
  for (let grid of openList) {
    if (grid.f < tempGrid.f) {
      tempGrid = grid
    }
  }
  return tempGrid
}

function findNeighbors(grid, openList, closeList) {
  const gridList = new Set()
  if (isValidGrid(grid.x - 1, grid.y, openList, closeList)) {
    gridList.add(new Grid(grid.x - 1, grid.y))
  }

  if (isValidGrid(grid.x + 1, grid.y, openList, closeList)) {
    gridList.add(new Grid(grid.x + 1, grid.y))
  }

  if (isValidGrid(grid.x, grid.y - 1, openList, closeList)) {
    gridList.add(new Grid(grid.x - 1, grid.y))
  }

  if (isValidGrid(grid.x, grid.y + 1, openList, closeList)) {
    gridList.add(new Grid(grid.x, grid.y + 1))
  }
  return gridList
}

function isValidGrid(x, y, openList, closeList) {
  if (x < 0 || x >= MAZE[0].length || y < 0 || y >= MAZE.length) {
    return false
  }

  if (MAZE[y][x] === 1) {
    return false
  }

  if (containGrid(openList, x, y)) {
    return false
  }

  if (containGrid(closeList, x, y)) {
    return false
  }

  return true
}

function containGrid(gridList, x, y) {
  for (let grid of gridList) {
    if (grid.x === x && grid.y === y) {
      return true
    }
  }
  return false
}

class Grid {
  x;
  y;
  f;
  g;
  h;
  parent;

  constructor(x, y) {
    this.x = x
    this.y = y
  }

  initGrid(parent, end) {
    this.parent = parent
    if (parent.g) {
      this.g = parent.g + 1
    } else {
      this.g = 1
    }

    this.h = Math.abs(end.y - this.y) + Math.abs(end.x - this.x)
    this.f = this.g + this.h
  }
}

// example

export function example(s, e) {
  const start = new Grid(s.x, s.y)
  const end = new Grid(e.x, e.y)
  let resultGrid = aSearch(start, end)
  const path = new Set()
  while (resultGrid) {
    path.add(new Grid(resultGrid.x, resultGrid.y))
    resultGrid = resultGrid.parent
  }

  let str = ''
  for (let y = 0; y < MAZE.length; y++) {
    str += '\n'
    for (let x = 0; x < MAZE[0].length; x++) {
      if (containGrid(path, x, y)) {
        str += '* '
      } else {
        str += MAZE[y][x] + ' '
      }
    }
  }
  if (path.size) {
    console.log(`example: start(${s.x}, ${s.y}), end(${e.x}, ${e.y})\n`, str)
  } else {
    console.log(`example: start(${s.x}, ${s.y}), end(${e.x}, ${e.y})\n\n终点无效`)
  }
}
