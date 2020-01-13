/**
 * A星寻路法 2
 *
 * @G 距离起点的步数
 * @H 不考虑障碍，到终点的最短距离（步数）
 * @F G + H
 */
// 迷宫地图
const MAZE = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  [0, 1, 0, 0, 0, 1, 0, 1, 0, 0],
  [0, 1, 0, 0, 0, 1, 0, 1, 0, 0],
  [0, 0, 0, 0, 1, 1, 0, 0, 1, 0],
  [0, 0, 1, 0, 1, 1, 0, 0, 0, 0],
  [0, 0, 1, 0, 1, 0, 0, 1, 0, 0],
  [0, 0, 1, 0, 1, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]

function* aSearch(start, end) {
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
    yield currentGrid.setStep()

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
  if (isValidNeighborGrid(grid.x - 1, grid.y, openList, closeList)) {
    gridList.add(new Grid(grid.x - 1, grid.y))
  }

  if (isValidNeighborGrid(grid.x + 1, grid.y, openList, closeList)) {
    gridList.add(new Grid(grid.x + 1, grid.y))
  }

  if (isValidNeighborGrid(grid.x, grid.y - 1, openList, closeList)) {
    gridList.add(new Grid(grid.x, grid.y - 1))
  }

  if (isValidNeighborGrid(grid.x, grid.y + 1, openList, closeList)) {
    gridList.add(new Grid(grid.x, grid.y + 1))
  }
  return gridList
}

function isValidNeighborGrid(x, y, openList, closeList) {
  if (!isValidGrid(x, y)) {
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

function isValidGrid(x, y) {
  if (x < 0 || x >= MAZE[0].length || y < 0 || y >= MAZE.length) {
    return false
  }

  if (MAZE[y][x] === 1) {
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

let step = 0
class Grid {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  setStep() {
    this.step = ++step
    return this
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

export default function start(s, e, canvas) {
  const start = new Grid(s.x, s.y)
  const end = new Grid(e.x, e.y)
  const canvasCtx = new Canvas(canvas, start, end)

  if (start.x === end.x && start.y === end.y) {
    return '起点与终点重叠！'
  }

  if (!isValidGrid(start.x, start.y) && !isValidGrid(end.x, end.y)) {
    return '起点与终点不可到达！'
  }

  if (!isValidGrid(start.x, start.y)) {
    return '起点不可到达！'
  }

  if (!isValidGrid(end.x, end.y)) {
    return '终点不可到达！'
  }

  let search = aSearch(start, end)
  let result = search.next()
  console.log('first', result)
  if (result.value || !result.done) {
    let duration = 500
    const timer = () => {
      setTimeout(() => {
        result = search.next()
        canvasCtx.drawStep(result.value)
        console.log(result)
        if (!result.done) {
          timer()
        } else {
          canvasCtx.drawPath(getPath(result.value))
        }
      }, duration)
    }
    timer()
    return '起点和终点可到达！'
  } else {
    console.log('what')
    return '起点或终点不可到达！'
  }
}

function getPath(searchResult) {
  const path = new Set()
  while (searchResult) {
    const newGrid = JSON.parse(JSON.stringify(searchResult))
    newGrid.parent = null
    path.add(newGrid)
    searchResult = searchResult.parent
  }
  return path
}

class Canvas {
  constructor(canvas, start, end) {
    step = 0
    let { width, height } = canvas
    this.canvas = canvas
    this.start = start
    this.end = end
    this.rectWidth = width / MAZE[0].length
    this.rectHeight = height / MAZE.length
    this.halfRectWidth = this.rectWidth / 2
    this.halfRectHeight = this.rectHeight / 2
    this.drawMap()
  }

  drawMap() {
    let color
    for (let y = 0; y < MAZE.length; y++) {
      for (let x = 0; x < MAZE[0].length; x++) {
        color = '#e5e5e5'
        if (MAZE[y][x] === 1) {
          color = '#000'
        }
        this.drawCanvas({ x, y }, color)
      }
    }
  }

  drawPath(path) {
    if (path.size) {
      for (let grid of path) {
        this.drawCanvas(grid, 'blue')
      }
    }
  }

  drawStep(grid, color) {
    this.drawCanvas({ x: grid.x, y: grid.y, step: grid.step }, color)
  }

  drawCanvas(grid, color) {
    const ctx = this.canvas.getContext('2d')
    const { x, y, step } = grid
    const startX = this.rectWidth * x
    const startY = this.rectHeight * y
    const isStart = this.start.x === grid.x && this.start.y === grid.y
    const isEnd = this.end.x === grid.x && this.end.y === grid.y

    if (isStart || isEnd) {
      color = 'red'
    }

    ctx.fillStyle = color || 'green'
    ctx.fillRect(startX, startY, this.rectWidth, this.rectHeight)

    if (step || isStart || isEnd) {
      ctx.fillStyle = '#fff'
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'center'

      let txt
      if (isStart) {
        txt = 'start'
      } else if (isEnd) {
        txt = 'end'
      } else if (step) {
        txt = step
      }
      ctx.fillText(txt, startX + this.halfRectWidth, startY + this.halfRectHeight)
    }
  }
}

// function drawStep(canvas, path) {
//   for (let y = 0; y < MAZE.length; y++) {
//     for (let x = 0; x < MAZE[0].length; x++) {
//       if (path && containGrid(path, x, y)) {
//         drawCanvas(canvas, { x, y })
//       } else {
//         let color = '#e5e5e5'
//         if (MAZE[y][x] === 1) {
//           color = '#000'
//         }
//         drawCanvas(canvas, { x, y }, color)
//       }
//     }
//   }
// }
