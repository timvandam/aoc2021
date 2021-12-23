pipe=(start=document.body.innerText)=>(...fns)=>fns.reduce((input, fn) => fn(input), start)
function permutator(inputArr) {
    var results = [];
  
    function permute(arr, memo) {
      var cur, memo = memo || [];
  
      for (var i = 0; i < arr.length; i++) {
        cur = arr.splice(i, 1);
        if (arr.length === 0) {
          results.push(memo.concat(cur));
        }
        permute(arr.slice(), memo.concat(cur));
        arr.splice(i, 0, cur[0]);
      }
  
      return results;
    }
  
    return permute(inputArr);
  }
getNums = txt => txt.match(/(\d+)/g).map(Number)
makeFreqArr = nums => nums.reduce((r, c) => ++r[c]&&r, Array(9).fill(0))
repeat = (times, ...fns) => (input) => { for (let i = 0; i < times; i++) input = fns.reduce((input, fn) => fn(input)||input, input); return input }
rotateLeft = (nums) => void(nums.push(nums.shift()))
rotateRight = (nums) => void(nums.unshift(nums.pop()))
sum=a=>a.reduce((x,y)=>x+y,0)
arrwithdefault=(defaultval=()=>0)=>new Proxy([], {
  get(a,i,r) {
    for (let j = a.length; j < i; j++) r[j]; // set prev defaults
    if (a[i] === undefined) {
      a[i] = defaultval()
    }
    return a[i]
  },
  set(a,i,v,r) {
    for (let j = a.length; j < i; j++) r[j]; // set prev defaults
    a[i] =v
  }
})
imat=(dims,defaultval=0)=>{
  res=[()=>defaultval]
  for (let i = 0; i < dims; i++) {
    res.push(()=>arrwithdefault(res[i]))
  }
  return res[res.length-1]()
}
// mat = (dims,fill=()=>0) => dims.length === 1 ? Array(dims[0]).fill(fill()):Array.from({length:dims.splice(-1)}, () => mat(dims,fill))
zip = (a,...r)=> a.map((a,i)=>[a,...r.map(r=>r[i])])
rng = (f, t) => Array.from({length:Math.abs(f-t)+1},(_,i)=>f+i*(f<t?1:-1))
repeat=(arr,cnt)=>Array.from({length:cnt},()=>[...arr]).flat(1)
forcelen=(arr,len)=>repeat(arr,Math.ceil(len/arr.length)).slice(0, len)

f = {
  numberlist: /(\d+)/g,
  number: /(\d+)$/g,
  digits: /(\d)/g,
  chars: /(\w)/g,
  things: /(.)/g,
  rlines: '',//document.body.innerText.trim().split('\n'),
  lines: ()=>f.rlines.map(e=>e.trim()).filter(e=>e),
  read: (r=f.numberlist,lines=f.lines())=>lines.map(l=>[...l.matchAll(r)].map(e=>e.slice(1).map(e=>isNaN(e)?e:Number(e))).flat(Infinity)),
  // reads matrix based on given size (height)
  readmatsCS: (size,lines=f.lines()) => f.read(f.numberlist,lines).reduce((mats, row, i, a) => i%size==0?[...mats,Array.from({length:size},(_,j)=>a[i + j])]:mats, []),
  // reads matrix based on empty lines
  readmatsEL: (lines=f.rlines) => lines.reduce((r, line) => line.trim().length ? [r, r[1].push([...line.matchAll(f.numberlist)].map(e=>e.slice(1).map(e=>isNaN(e)?e:Number(e))).flat(Infinity))][0] : [r, r[0].push(r[1]), r[1] = []][0], [[], []])[0]
}
Set.prototype.union = function (...sets) {
  return new Set([...this, ...sets.flatMap(set => [...set])])
}
Set.prototype.intersect = function (...sets) {
  return new Set([...this].filter(e => sets.every(set => set.has(e))))
}
Set.prototype.difference = function (b) {
  return new Set([...this].filter(e => !b.has(e)))
}
Set.prototype.xor = function (b) {
  return this.union(this.difference(b), b.difference(this))
}
set = (...elements) => new Set(elements)


b = `
#############
#...........#
###B#C#B#D###
  #A#D#C#A#
  #########
`
c=
`
#############
#...........#
###B#C#B#D###
  #D#C#B#A#
  #D#B#A#C#
  #A#D#C#A#
  #########
`
b=
`
#############
#...........#
###D#A#B#C###
  #D#C#B#A#
  #D#B#A#C#
  #B#A#D#C#
  #########
`
// b=document.body.innerText.trim()
const halls = b.trim().split('\n').slice(2, -1).map(e => e.match(/\w+/g))
// console.log(halls)


const spots = ['','','X','','X','','X','','X','',''] // X can not be occupied
// 0 => 2
// 1 => 4
// 2 => 6
// 3 => 8
halls.unshift(spots)

function done(halls) {
  return halls[1].every((val, i) => val === halls[2][i]) && halls[1].toString() === ['A','B','C','D'].toString()
}

function halldone(halls, index) {
  const char = indexChar(index)
  const done = halls[1][index] === char && halls[2][index] === char
  // console.log(char,done,halls[1],halls[2])
  if (done) {
    // print(halls)
    // console.log('done')
  }
  return done
}

function move(halls, fromHall, fromIndex, toHall, toIndex) {
  // console.log('Moving',halls[fromHall][fromIndex],'to',toHall,toIndex,` (${String.fromCharCode('A'.charCodeAt() + toIndex)})`)
  halls = halls.map(hall => [...hall])
  const char = halls[fromHall][fromIndex]
  halls[fromHall][fromIndex] = ''
  halls[toHall][toIndex] = char
  return halls
}

function indexChar(index) {
  return String.fromCharCode('A'.charCodeAt() + index)
}

function sumN1(...nums) {
  if (nums.some(num => num === -1)) return -1
  return nums.reduce((x, y) => x + y, 0)
}

function getSteps(halls, fromHall, fromIndex, toHall, toIndex) {
  if (fromHall === 0 && toHall === 0) {
    // we are in the hallway
    // console.log(rng(fromIndex,toIndex).slice(1).map(i => halls[0][i]))
    const isBlocked = rng(fromIndex,toIndex).slice(1).map(i => halls[0][i]).some(spot => spot !== 'X' && spot !== '')
    if (isBlocked) return -1
    return Math.abs(toIndex - fromIndex)
  } else if (fromHall >= 1 && toHall === 0 && (2 + fromIndex * 2 === toIndex)) {
    // check if obstruction
    for (let i = 1; i < fromHall; i++) {
      if (halls[i][fromIndex] !== '') return -1
    }
    return fromHall // the index is eq to the depth, so that will be the amount fo steps
  } else if (fromHall >= 1 && toHall === 0) {
    return sumN1(
      getSteps(halls, fromHall, fromIndex, 0, 2 + fromIndex * 2), // move to hall
      getSteps(halls, 0, 2 + fromIndex * 2, 0, toIndex) // move in hall
    )
  } else if (fromHall >= 1 && toHall >= 1) {
    return sumN1(
      getSteps(halls, fromHall, fromIndex, 0, 2 + fromIndex * 2), // move to hall
      getSteps(halls, 0, 2 + fromIndex * 2, 0, 2 + toIndex * 2), // move in hall
      getSteps(halls, toHall, toIndex, 0, 2 + toIndex * 2), // move to hall again (in opposite way because idk if its supported)
    )
  } else if (fromHall === 0) {
    halls = halls.map(hall => [...hall])
    ;[halls[fromHall][fromIndex], halls[toHall][toIndex]] = [halls[toHall][toIndex], halls[fromHall][fromIndex]]
    return getSteps(halls, toHall, toIndex, fromHall, fromIndex)
  }
}

function createStr(halls) {
  let str = `
  #############
  #${halls[0].map(val => val === '' || val === 'X' ? '.' : `${val}`).join('')}#
  ###${halls[1][0]||' '}#${halls[1][1]||' '}#${halls[1][2]||' '}#${halls[1][3]||' '}###`
  
  for (let i = 2; i < halls.length; i++) {
    str += `\n    #${halls[i][0]||' '}#${halls[i][1]||' '}#${halls[i][2]||' '}#${halls[i][3]||' '}#`
  }


  str += '\n    #########'

  return str
}

function strset(str, index, stuff) {
  return str.slice(0, index) + stuff + str.slice(index + 1)
}

const BG = '\x1b[0;90m'
const RESET = '\x1b[0m'
const BLUE = '\x1b[1;96m'
function print(halls, prevState, details = '') {
  let str = createStr(halls)

  if (prevState) {
    let prev = createStr(prevState)
    let index = -1
    for (let i = 0; i < str.length && i < prev.length; i++) {
      if (str[i] !== prev[i]) {
        if ([...'ABCD'].includes(str[i])) {
          index = i
          break
        }
      }
    }

    // str = strinsert(str, index + 1, BG) // reset
    str = strset(str, index, [...'TIM!'][str.charCodeAt(index) - 'A'.charCodeAt()])
    // str = strinsert(str, index, `\x1b[1;96m`) // color
  }

  str = str.replace(/[ABCD]/g, m => `\x1b[1;97m${m}${RESET}`)
  str = str.replace(/#/g, c => `${BG}${c}${RESET}`)
  str = str.replace(/\./g, m => `${BG}${m}${RESET}`)
  str = str.replace(/[TIM!]/g, m => `${BLUE}${indexChar('TIM!'.indexOf(m))}${BG}`)

	process.stdout.cursorTo(0, 0)
	process.stdout.clearScreenDown()
  console.log(str + details)
}

function charEnergy(char) {
  return 10 ** (char.charCodeAt() - 'A'.charCodeAt())
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

let minEnergy = Infinity
const mem = {}
const hist = {} // shows consecutive states in the solution
function backTrack(halls) {
  if (mem[halls]) return mem[halls]
  let e = Infinity;
  let nextHalls = []
  if (done(halls)) {
    // console.log(`Done! min(${minEnergy}, ${energy})`)
    return 0
  }
  const movers = [0, 1, 2, 3].filter(i => !halldone(halls, i)).map(i => {
    // this hall is not yet done. 
    // if the hall contains every correct, but just missing, then nothing can be moved
    // if the hall contains an incorrect, then the top one can be moved

    const char = indexChar(i)
    let hasIncorrect = false
    let top = -1;
    for (let j = halls.length - 1; j >= 1; j--) {
      if (halls[j][i] !== '') {
        if (halls[j][i] !== char) hasIncorrect = true
        top = j
      }
    }
    if (hasIncorrect) {
      return [top, i]
    }
    return null
  }).filter(e => e).concat([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(i => !['', 'X'].includes(halls[0][i])).map(i => [0, i]))
  for (const [hall, index] of movers) {
    const char = halls[hall][index]
    const destinationIndex = char.charCodeAt() - 'A'.charCodeAt()

    // find the first empty spot in the destination and put it there
    for (let i = halls.length - 1; i >= 1; i--) {
      if (halls[i][destinationIndex] === '') {
        // Destination is empty, move in!
        const en = charEnergy(char) * getSteps(halls, hall, index, i, destinationIndex)
        if (en > 0) {
          const newHalls = move(halls, hall, index, i, destinationIndex)
          const newEnergy = en + backTrack(newHalls)
          if (newEnergy < e) {
            e = newEnergy;
            nextHalls = newHalls
          }
        }
        break
      } else if (halls[i][destinationIndex] !== char) {
        break
      }
    }

    if (hall !== 0) {
      // move to the hall (because we already tried moving directly)
      const indices = spots.map((val, i) => val === 'X' ? -1 : i).filter(i => i !== -1)
      for (const destinationIndex of indices) {
        const en = charEnergy(char) * getSteps(halls, hall, index, 0, destinationIndex)
        if (en > 0) {
          const newHalls = move(halls, hall, index, 0, destinationIndex)
          const newEnergy = en + backTrack(newHalls)
          if (newEnergy < e) {
            e = newEnergy;
            nextHalls = newHalls
          }
        }
      }
    }
  }

  // set in mem
  mem[halls] = e
  hist[halls] = nextHalls.toString()
  return e
}

const test = [
  ['', '', '', '', '', '', '', '', '', 'D', 'B'],
  [        '',     '',      'C',     'D'],
  [        'A',     'B',      'C',     'A'],
]
// console.log('en', getEnergy(test, 0, 10, 0, 9))
// process.exit()


// console.log('MinEnergy:', backTrack(halls))

function stateToHalls(state) {
  // takes a string used in mem and hist as keys, and converts it back to an ND array
  const els = state.split(',')
  const hallway = els.splice(0, 11)
  const rows = els.length / 4
  const res = [hallway]
  for (let i = 0; i < rows; i++) {
    res.push(els.splice(0, 4))
  }
  return res
}

async function visualize() {
  print(halls)
  console.log('\n      Hmm 🤔')
  const energy = backTrack(halls)
  
  let prevState = undefined
  let state = halls.toString()
  while (state) {
    let details = `

      Aha 😃
   Energy: ${energy - (mem[state] ?? 0)}`
    print(stateToHalls(state), prevState ? stateToHalls(prevState) : undefined, details)
    await sleep(750)
    prevState = state
    state = hist[state]
  }
}

visualize()