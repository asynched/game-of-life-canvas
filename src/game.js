import { enumerate } from './utils.js'

export default class Conway {
  constructor({
    width = 1280,
    height = 720,
    blockSize = 5,
    survivesWith = 3,
    randomFactor = 0.25,
    survivalRange = [2, 3],
  } = {}) {
    this.width = width
    this.height = height
    this.blockSize = blockSize
    this.survivesWith = survivesWith
    this.survivalRange = survivalRange
    this.randomFactor = randomFactor

    this.canvas = document.querySelector('canvas')
    this.context = this.canvas.getContext('2d')
    this.gameMap = this._getGameMap()
  }

  _getMap() {
    return Array(this.height / this.blockSize)
      .fill(Array(this.width / this.blockSize).fill(false))
      .map((row) => row.map(() => false))
  }

  _getGameMap() {
    return this._getMap().map((row) =>
      row.map(() => Math.random() > this.randomFactor)
    )
  }

  _recalculate() {
    const newMap = this._getMap()

    for (let x = 1; x < this.width / this.blockSize - 1; x++) {
      for (let y = 1; y < this.height / this.blockSize - 1; y++) {
        const cell = this.gameMap[y][x]

        const top = this.gameMap[y - 1][x]
        const right = this.gameMap[y][x + 1]
        const bottom = this.gameMap[y + 1][x]
        const left = this.gameMap[y][x - 1]

        const topRight = this.gameMap[y - 1][x + 1]
        const bottomRight = this.gameMap[y + 1][x + 1]
        const bottomLeft = this.gameMap[y + 1][x - 1]
        const topLeft = this.gameMap[y - 1][x - 1]

        const cells = [
          top,
          right,
          bottom,
          left,
          topRight,
          topLeft,
          bottomRight,
          bottomLeft,
        ]

        let sum = 0

        for (let i = 0; i < cells.length; i++) {
          sum += cells[i]
        }

        const isNewCell = !cell && sum === 3
        const [minRange, maxRange] = this.survivalRange
        const doesCellSurvive = cell && sum >= minRange && sum <= maxRange

        if (isNewCell || doesCellSurvive) {
          newMap[y][x] = true
        }
      }
    }

    this.gameMap = newMap
  }

  _update() {
    this.context.fillStyle = '#000'
    this.context.fillRect(0, 0, this.width, this.height)

    for (const [rowIndex, row] of enumerate(this.gameMap)) {
      for (const [columnIndex, column] of enumerate(row)) {
        if (column) {
          this.context.fillStyle = '#fff'
          this.context.fillRect(
            columnIndex * this.blockSize,
            rowIndex * this.blockSize,
            this.blockSize,
            this.blockSize
          )
        }
      }
    }

    this._recalculate()

    requestAnimationFrame(this._update.bind(this))

    return this
  }

  start() {
    this._update()

    return this
  }

  setup() {
    this.canvas.height = this.height
    this.canvas.width = this.width
    return this
  }

  static default() {
    return new Conway()
  }
}
