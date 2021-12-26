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

b = require('fs').readFileSync('./24.txt', { encoding: 'utf8' })
// b=document.body.innerText.trim()
const lines = b.trim().split('\n').map(e => e.match(/\w+|-?\d+/g).map((e,i) => isNaN(e) ? e : Number(e)))

let env = {}
// a is always var. b is var or number
const action = {
  add(a, b) {
    env[a] += b
  },
  mul(a, b) {
    env[a] *= b
  },
  inp(name, val) {
    env[name] = val
  },
  div(a, b) {
    if (b === 0) throw new Error('shouldnt happen div')
    env[a] /= b
    env[a] = Math.floor(env[a])
  },
  mod(a, b) {
    if (a < 0 || b < 0) throw new Error('shouldnt happen mod')
    env[a] = env[a] % b
  },
  eql(a, b) {
    env[a] = Number(env[a] === b)
  }
}
function exec(lines, inputs, z = 0) {
  env.x = 0
  env.y = 0
  env.z = z
  env.w = 0

  inputs = [...inputs].map(Number)
  for (let [command, a, b] of lines) {
    if (b) {
      if (isNaN(b)) b = env[b]
      else b = parseInt(b)
    }
    
    if (command === 'inp') {
      console.log('z',env.z)
      if (inputs.length === 0) throw new Error('not enough inputs')
      action.inp(a, inputs.shift())
    } else action[command](a, b)
  }

  return env
}

// get program for a specific digit (digit index is left to right, 0 indexed)
function getProgramForDigitIndex(digitIndex) {
  let newLines = []

  let count = 0
  for (let i = lines.length - 1; i >= 0; i--) {
    newLines.push(lines[i])
    if (lines[i][0] === 'inp') {
      if (++count === 14 - digitIndex) {
        break
      } else {
        newLines = []
      }
    }
  }
  
  return newLines.reverse()
}

// maps [digitIndex, startZ] to => [allDigits, endsWith0]
const mem = {}

function solve(digitIndex, z = 0) {
  if (digitIndex > 13) return ['', z === 0]
  if (mem[[digitIndex, z]]) return mem[[digitIndex, z]]

  // for (let i = 9; i >= 1; i--) {
  for (let i = 1; i <= 9; i++) {
    const { z: startZ } = exec(getProgramForDigitIndex(digitIndex), [i], z)
    const [allDigits, endsWithZero] = solve(digitIndex + 1, startZ)
    if (endsWithZero) {
      mem[[digitIndex, z]] = [i.toString() + allDigits, true]
      return mem[[digitIndex, z]]
    }
  }
  
  mem[[digitIndex, z]] ??= ['', false]
  return mem[[digitIndex, z]]
}


const start = 0 // at which index to start (just to make sure it works on small examples)
// const [p1, z] = solve(start)
// console.log(p1, z)
console.log('z', exec(rng(start, 13).flatMap(i => getProgramForDigitIndex(i)), '59996912981939', 0))


// highest: 59996912981939 (no time, too long in js)
// lowest: 17241911811915 (1m08s)

// total time in cpp: 3m54s