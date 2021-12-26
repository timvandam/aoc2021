/*
Explanation of the MONAD code:
w is always the input
x and y are used for computation (they are reset each time an input is handled)
z carries some state

z is used as a stack that can store numbers between 0 and 25 (inclusive)

z = 0
push(10)    -> z = z * 26 + 10 = 10
push(15)    -> z = z * 26 + 15 = 275
top()       -> z % 26 = 15
pop()       -> z = floor(z / 26) = 10
top()       -> z % 26 = 10
push(0)     -> z = z * 26 + 0 = 260
top()       -> z % 26 = 0
pop()       -> z = floor(z / 26) = 10
top()       -> z % 26 = 0
*/


// Each input is handled in the same way, but with different constants
/* A block:
inp w
mul x 0
add x z
mod x 26  x = top()
div z A   A is either 1 (do nothing) or 26 (pop)
add x B   B is an integer (can be negative)
eql x w --| x = input() == top() + B
eql x 0   | x = input() != top() + B
mul y 0   | 
add y 25  | 
mul y x   |
add y 1   | if (x) y = 26 else y = 1
mul z y --| if (x) push()
mul y 0
add y w
add y C   C is an integer. This offsets what is added to the stack
mul y x   | if (x) push(w + C)
add z y   | else push(0)  # equivalent to doing nothing

stack = []
for (i = 0..13) {
    if (pop[i]) {
        stack.pop()
    }
    if (input[i] != stack.top() + B[i]) {
        stack.push(input[i] + C[i])
    }
}
return stack == 0
*/
const blockRegex = new RegExp(`
inp w
mul x 0
add x z
mod x 26
div z (?<A>1|26)
add x (?<B>-?\\d+)
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y (?<C>\\d+)
mul y x
add z y
`.trim(), 'g')

function getConstants() {
    const file = require('fs').readFileSync('24.txt', 'utf8')
    const matches = file.matchAll(blockRegex)
    const constants = {
        pop: [], // 1 => do nothing. 26 => pop
        B: [], // offset for top(). if(input() != top() + B) push(input() + C)
        C: [], // offset for what is pushed
    }
    for (const {groups:{A, B, C}} of matches) {
        constants.pop.push(A === '26')
        constants.B.push(parseInt(B))
        constants.C.push(parseInt(C))
    }
    return constants
}

class ZStack {
    constructor(stack = []) {
        this.stack = stack
    }
    
    get length() {
        return this.stack.length
    }
    
    push(num) {
        if (this.length === 0 && num === 0) return // this wouldnt change z
        this.stack.push(num)
    }

    top() {
        return this.stack[this.length - 1]
    }

    pop() {
        this.stack.pop()
    }

    copy() {
        return new ZStack([...this.stack])
    }
}

const constants = getConstants()

function findAll(zstack = new ZStack(), num = 0, digitIndex = 0, popsRemaining = constants.pop.reduce((count, pop) => count + pop, 0)) {
    // To make sure that the stack is empty at the end,
    // so make sure that this is still possible. If not, abort
    if (popsRemaining < zstack.length) return []
    if (digitIndex === 14) {
        if (zstack.length === 0) return [num]
        return []
    }

    const top = zstack.top()
    if (constants.pop[digitIndex]) {
        zstack.pop()
        popsRemaining--
    }

    const solutions = []
    for (let i = 1; i <= 9; i++) {
        const stack = zstack.copy()
        
        if (i !== top + constants.B[digitIndex]) {
            stack.push(i + constants.C[digitIndex])
        }
        
        solutions.push(...findAll(stack, num * 10 + i, digitIndex + 1, popsRemaining))
    }

    return solutions
}

function findOne(biggest, zstack = new ZStack(), num = 0, digitIndex = 0, popsRemaining = constants.pop.reduce((count, pop) => count + pop, 0)) {
    // To make sure that the stack is empty at the end,
    // we need to make sure pops >= pushes (and that their order is good ofc)
    if (popsRemaining < zstack.length) return null
    if (digitIndex === 14) {
        if (zstack.length === 0) return num
        return null
    }

    const top = zstack.top()
    if (constants.pop[digitIndex]) {
        zstack.pop()
        popsRemaining--
    }

    for (let i = biggest ? 9 : 1; i >= 1 && i <= 9; i += biggest ? -1 : 1) {
        const stack = zstack.copy()
        
        if (i !== top + constants.B[digitIndex]) {
            stack.push(i + constants.C[digitIndex])
        }
        
        const solution = findOne(biggest, stack, num * 10 + i, digitIndex + 1, popsRemaining)
        if (solution !== null) {
            return solution
        }
    }

    return null
}

const arg = process.argv[2]
if (arg === undefined) {
    const part1 = findOne(true)
    const part2 = findOne(false)
    console.log(`
Part 1: ${part1}
Part 2: ${part2}
`)
} else if (arg === 'all') {
    const part1 = findOne(true)
    const part2 = findOne(false)
    const all = findAll()
    console.log(`
Part 1: ${part1}
Part 2: ${part2}
Total count: ${all.length}
`)
} else {
    console.log(`
Unknown argument '${arg}'
Either provide 'all' to get part 1, part 2, and total count or provide nothing to get only part 1 and part 2
`)
}