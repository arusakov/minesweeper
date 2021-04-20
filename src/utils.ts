export const MAX_CELLS = 10000

export const CELL_WIDTH = 16

export const TILE_WIDTH = CELL_WIDTH * 50

export type Game = {
	rows: number
	columns: number
	mines: number   
}

export const binarySearch = <T extends string | number>(list: T[], find: T) => {
	let start = 0
	let end = list.length
	while (start < end) {
		const index = start + Math.floor((end - start) / 2)
		const element = list[index]

		if (element === find) {
			return index
		}
		if (element < find) {
			start = index + 1
		} else {
			end = index
		}
	}
	return -1
}