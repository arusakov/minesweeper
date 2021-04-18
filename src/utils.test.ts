import { binarySearch } from './utils'


describe('binarySearch()', () => {
	it('empty list', () => {
		expect(binarySearch([], 1)).toStrictEqual(-1)
	})

	it('simple lists', () => {
		expect(binarySearch([1], 1)).toStrictEqual(0)
		expect(binarySearch([0], 1)).toStrictEqual(-1)
		expect(binarySearch([1, 2], 1)).toStrictEqual(0)
		expect(binarySearch([1, 2], 2)).toStrictEqual(1)
		expect(binarySearch([1, 2, 3], 1)).toStrictEqual(0)
		expect(binarySearch([1, 2, 3], 2)).toStrictEqual(1)
		expect(binarySearch([1, 2, 3], 3)).toStrictEqual(2)
	})

	it('long lists', () => {
		expect(binarySearch([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 1)).toStrictEqual(0)
		expect(binarySearch([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 2)).toStrictEqual(1)
		expect(binarySearch([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 3)).toStrictEqual(2)

		expect(binarySearch([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 6)).toStrictEqual(5)
		expect(binarySearch([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 7)).toStrictEqual(6)

		expect(binarySearch([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 10)).toStrictEqual(9)
		expect(binarySearch([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 11)).toStrictEqual(10)
		expect(binarySearch([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 12)).toStrictEqual(11)
	})
})