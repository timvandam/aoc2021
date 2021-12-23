const input = `
#############
#...........#
###D#A#B#C###
  #D#C#B#A#
  #D#B#A#C#
  #B#A#D#C#
  #########
`
const hallway = Array(11).fill('') // there are 11 hallway spaces (only 7 can be occupied!)
const siderooms = [[], [], [], []] // each index is a letter (A, B, C, D respectively)

for (const line of input.trim().split('\n').slice(2, -1)) {
  const letters = line.match(/[ABCD]/g)
  for (let i = 0; i < letters.length; i++) {
    siderooms[i].push(letters[i])
  }
}

function sideroomIndexToChar(i) {
  return String.fromCharCode('A'.charCodeAt() + i)
}

function charToSideroomIndex(c) {
  return c.charCodeAt() - 'A'.charCodeAt()
}

function charEnergy(c) {
  return 10 ** charToSideroomIndex(c)
}

function isSolved(hallway, siderooms) {
  return hallway.every(x => x == '') && siderooms.every((room, i) => room.every(char => char === sideroomIndexToChar(i)))
}

function hallwayIndexIsOccupiable(i) {
  return i % 2 === 1 || i === 0 || i === 10
}

function sideroomIndexToHallwayIndex(i) {
  return 2 + 2 * i;
}

function isHallwayBlocked(hallway, l, r) {
  if (l > r) ([l, r] = [r, l])
  l = Math.max(0, l)
  r = Math.min(hallway.length - 1, r)
  for (let i = l; i <= r; i++) {
    if (hallway[i] !== '') {
      return true
    }
  }
  return false
}

function moveSideroomToHall(hallway, i, siderooms, j) {
  if (!hallwayIndexIsOccupiable(i)) return [null, null, -1]
  if (hallway[i] !== '') return [null, null, -1]
  // TODO: Don tmove if correct
  
  hallway = [...hallway] // copy
  siderooms = siderooms.map(room => [...room]) // copy

  const currentRoom = siderooms[j]
  const roomChar = sideroomIndexToChar(j)

  // Find the top character, and move it if there is any incorrect char
  let top = -1
  let incorrectChar = false
  for (let k = currentRoom.length - 1; k >= 0; k--) {
    if (currentRoom[k] === '') break
    if (currentRoom[k] !== roomChar) incorrectChar = true;
    top = k
  }
  if (!incorrectChar || top === -1) return [null, null, -1]
  
  const char = currentRoom[top]
  
  const l = sideroomIndexToHallwayIndex(j)
  if (isHallwayBlocked(hallway, i, l)) return [null, null, -1]

  hallway[i] = char
  currentRoom[top] = ''

  let energy = 0
  energy += top + 1 // move to hallway
  energy += Math.abs(l - i) // move to correct hallway position
  energy *= charEnergy(char)

  return [hallway, siderooms, energy]
}

function moveHallToSideroom(hallway, i, siderooms) {
  hallway = [...hallway] // copy
  siderooms = siderooms.map(room => [...room]) // copy

  const char = hallway[i]

  const destinationIndex = charToSideroomIndex(char)
  const destinationRoom = siderooms[destinationIndex]
  let insertIndex = destinationRoom.length - 1;
  for (; insertIndex >= 0; insertIndex--) {
    if (destinationRoom[insertIndex] === '') break; // insert the char here (the first empty spot from the bottom up)
    if (destinationRoom[insertIndex] !== char) return [null, null, -1] // room has an invalid char, cant insert yet
  }
  if (insertIndex === -1) return [null, null, -1] // sideroom is full

  hallway[i] = ''
  const j = sideroomIndexToHallwayIndex(destinationIndex)
  if (isHallwayBlocked(hallway, i, j)) return [null, null, -1];
  destinationRoom[insertIndex] = char

  let energy = 0
  energy += Math.abs(i - j) // move to correct hallway position
  energy += insertIndex + 1 // move to correct room position
  energy *= charEnergy(char)

  return [hallway, siderooms, energy]
}

const mem = {}
const next = {}
function solve(hallway, siderooms) {
  if (mem[[hallway, siderooms]]) return mem[[hallway, siderooms]]
  if (isSolved(hallway, siderooms)) return 0
  let energy = Number.MAX_SAFE_INTEGER
  let nxt = []

  for (let i = 0; i < hallway.length; i++) {
    if (hallway[i] === '') {
      // Move from sideroom to hall
      for (let j = 0; j < 4; j++) {
        const [newHallway, newSiderooms, extraEnergy] = moveSideroomToHall(hallway, i, siderooms, j)
        if (extraEnergy !== -1) {
          const totalEnergy = extraEnergy + solve(newHallway, newSiderooms)
          if (totalEnergy < energy) {
            energy = totalEnergy
            nxt = [newHallway, newSiderooms]
          }
        }
      }
    } else {
      // Move from hall to sideroom
      const [newHallway, newSiderooms, extraEnergy] = moveHallToSideroom(hallway, i, siderooms)
      if (extraEnergy !== -1) {
        const totalEnergy = extraEnergy + solve(newHallway, newSiderooms)
        if (totalEnergy < energy) {
          energy = totalEnergy
          nxt = [newHallway, newSiderooms]
        }
      }
    }
  }

  mem[[hallway, siderooms]] = energy
  next[[hallway, siderooms]] = nxt
  return energy
}

function print(hallway, siderooms) {
  let str = '#############'

  str += `\n#${hallway.map(val => val || '.').join('')}#`
  str += `\n###${siderooms.map(room => room[0] || ' ').join('#')}###`
  for (let i = 1; i < siderooms[0].length; i++) {
    str += `\n  #${siderooms.map(room => room[i] || ' ').join('#')}#`
  }
  str += '\n  #########'
  
  process.stdout.cursorTo(0, 0)
	process.stdout.clearScreenDown()
  console.log(str)
}

const sleep = ms => new Promise(r => setTimeout(r, ms))
async function visual() {
  const energy = solve(hallway, siderooms)
  let state = [hallway, siderooms]
  let p = energy

  while (state) {
    print(...state)
    const diff = p - mem[state]
    console.log(diff,energy)
    await sleep(1000)
    state = next[state]
    p -= diff
  }
}

visual()
