import { addToOrderedArray, binarySearch, decodePosition, encodePosition, numberComparator } from './utils'


describe('binarySearch()', () => {
	it('empty list', () => {
		expect(binarySearch([], 1, numberComparator)).toStrictEqual(-1)
	})

	it('simple lists', () => {
		expect(binarySearch([1], 1, numberComparator)).toStrictEqual(0)
		expect(binarySearch([0], 1, numberComparator)).toStrictEqual(-1)
		expect(binarySearch([1, 2], 1, numberComparator)).toStrictEqual(0)
		expect(binarySearch([1, 2], 2, numberComparator)).toStrictEqual(1)
		expect(binarySearch([1, 2, 3], 1, numberComparator)).toStrictEqual(0)
		expect(binarySearch([1, 2, 3], 2, numberComparator)).toStrictEqual(1)
		expect(binarySearch([1, 2, 3], 3, numberComparator)).toStrictEqual(2)
	})

	it('long lists', () => {
		expect(binarySearch([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 1, numberComparator)).toStrictEqual(0)
		expect(binarySearch([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 2, numberComparator)).toStrictEqual(1)
		expect(binarySearch([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 3, numberComparator),).toStrictEqual(2)

		expect(binarySearch([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 6, numberComparator)).toStrictEqual(5)
		expect(binarySearch([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 7, numberComparator)).toStrictEqual(6)

		expect(binarySearch([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 10, numberComparator)).toStrictEqual(9)
		expect(binarySearch([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 11, numberComparator)).toStrictEqual(10)
		expect(binarySearch([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 12, numberComparator)).toStrictEqual(11)
	})
})

describe('encodePosistion() & decodePostion()', () => {
	
	it('encodePostion()', () => {
		expect(encodePosition(0, 0)).toStrictEqual(0)
		expect(encodePosition(0, 1)).toStrictEqual(1)
	})

	it('encode to decode', () => {
		expect(decodePosition(encodePosition(1, 2))).toStrictEqual({ top: 1, left: 2})
	})

})

describe('addToOrderedArray()', () => {
	it('addToOrderedArray()', () => {
		expect(addToOrderedArray([1, 2, 3], 4)).toStrictEqual([1, 2, 3, 4])
		expect(addToOrderedArray([1, 2, 3], 0)).toStrictEqual([0, 1, 2, 3])
		expect(addToOrderedArray([1, 3, 4], 2)).toStrictEqual([1, 2, 3, 4])
	})
})