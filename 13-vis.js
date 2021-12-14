const { readFileSync } = require('fs')

const { stdout } = process

const FULL_BLOCK = '\x1b[32m█\x1b[0m'
const LIGHT_BLOCK = '░\x1b[0m'
const HORIZONTAL_LINE = '\x1b[34m─\x1b[0m'
const VERTICAL_LINE = '\x1b[34m│\x1b[0m'
const SPACE = '\x1b[0m'
const SLEEP_TIME = 600

// max x: 1310. max y: 894

function sleep() {
	return new Promise(resolve => setTimeout(resolve, SLEEP_TIME))
}

async function go(input) {
	input = input.trim().split('\n').filter(e => e).map(e => e.match(/x|y|\d+/g))
	const coords = []
	const instructions = []
	const axises = 'xy'
	for (const [a, b] of input) {
		if (axises.includes(a)) instructions.push([a, parseInt(b)])
		else coords.push([parseInt(a), parseInt(b)])
	}

	let i = 0;
	const MAGIC_NUMBER = 16;
	for (const [axis, value] of instructions) {
		if (i++ > MAGIC_NUMBER) {
			await sleep()
			printMat(coords, { axis, value })
		}

		const coordIndex = axises.indexOf(axis)
		for (const coord of coords) {
			if (coord[coordIndex] > value) {
				coord[coordIndex] -= 2 * (coord[coordIndex] - value)
			}
		}

		if (i > MAGIC_NUMBER) {
			await sleep()
			printMat(coords)
		}
	}
}

function printMat(coords, line) {
	let maxX = 0
	let maxY = 0
	for (const [x, y] of coords) ([maxX, maxY] = [Math.max(maxX, x), Math.max(maxY, y)])

	const mat = Array.from({ length: maxY + 1 }, () => Array.from({ length: maxX + 1 },() => 0))
	for (const [x, y] of coords) mat[y][x]++

	stdout.cursorTo(0, 0)
	stdout.clearScreenDown()
	stdout.write(
		mat.map(e =>
			e.map(v => v ? FULL_BLOCK : LIGHT_BLOCK)
				.reduce((str, l, i) => str + l + (line && line.axis === 'x' && line.value === i ? VERTICAL_LINE : SPACE), '')
		).reduce((str, l, i) => str + l + (line && line.axis === 'y' && line.value === i ? `\n${HORIZONTAL_LINE.repeat(mat[0].length)}\n` : '\n'), '')
	)
}





const c = readFileSync('./13-big.txt', 'utf8')
go(c)
