export const MAX_CELLS = 10000

export const CELL_WIDTH = 16

export const TILE_SIZE = 16

export const TILE_WIDTH = CELL_WIDTH * TILE_SIZE

export type GameStatic = {
  rows: number
  columns: number
  mines: number
}

export type TileObj = {
  position: number
  cells: number[]
}

export const numberComparator = (a: number, b: number) => a - b 

export const binarySearch = <T, P>(list: T[], find: P, comparator: ((t1: T, t2: P) => number), start = 0, end = list.length) => {
  while (start < end) {
    const index = start + Math.floor((end - start) / 2)
    const element = list[index]

    const result = comparator(element, find)

    if (!result) {
      return index
    }
    if (result < 0) {
      start = index + 1
    } else {
      end = index
    }
  }
  return -1
}

export const encodePosition = (top: number, left: number) =>
  (top << 16) | left

export const decodePosition = (pos: number) => ({
  top: pos >> 16,
  left: 0xFFFF & pos,
})

export const createPosition = (maxTop: number, maxLeft: number) => encodePosition(
  Math.floor(Math.random() * maxTop),
  Math.floor(Math.random() * maxLeft)
)

export const createPositionsArray = (count: number, probability: number, maxTop: number, maxLeft: number) => {
  const array: number[] = []
  for (let i = 0; i < count; ++i) {
    if (Math.random() < probability) {
      array.push(Math.floor(i / maxTop), Math.floor(i % maxLeft))
    }
  }

  return array
}

export const addToOrderedArray = (array: number[], val: number) => {
  const newArr = [...array]

  newArr.push(val)

  newArr.sort((a, b) => a - b)

  return newArr

  // let i = array.length
  // while (i--) {
  //   if (val < array[i]) {
  //     break
  //   }
  // }
  // const newArr = [...array]
  // newArr.splice(i, 0, val)
  // return newArr
}

export type Sides = {
  top: number
  left: number
  right: number
  bottom: number
}


export const calSides = (el: HTMLDivElement): Sides => {
  const { scrollTop, scrollLeft, clientWidth, clientHeight } = el

  return {
    top: Math.floor(scrollTop / TILE_WIDTH),
    left: Math.floor(scrollLeft / TILE_WIDTH),
    right: Math.floor((scrollLeft + clientWidth) / TILE_WIDTH),
    bottom: Math.floor((scrollTop + clientHeight) / TILE_WIDTH),
  }
}