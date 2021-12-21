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
mat = (dims,fill=()=>0) => dims.length === 1 ? Array(dims[0]).fill(fill()):Array.from({length:dims.splice(-1)}, () => mat(dims,fill))
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


b = `Player 1 starting position: 7
Player 2 starting position: 8`.trim()
// b=document.body.innerText.trim()
let [p1, p2] = b.match(/\d+/g).map(Number).filter((_, i) => i % 2 === 1).map(x => x - 1) // index on board
const board = Array(10).fill(0).map((_, i) => i + 1)
// scores
let p1s = 0 
let p2s = 0
let universeFreq = {[[p1,p2,0,0]]:1} // [p1, p2, p1s, p2s] => count

function movePlayer(pos, amount) {
  return (pos + amount) % 10
}

function * deterministicdie() {
  while(true) for (let i = 1; i <= 1000; i++) yield i
} 

const die = deterministicdie()
let rolls = 0
while (p1s < 1000 && p2s < 1000) {
  const p1roll = die.next().value + die.next().value + die.next().value
  rolls += 3
  // console.log('p1 rolled ', p1roll, 'moving from', p1, 'to', movePlayer(p1, p1roll))
  p1 = movePlayer(p1, p1roll)
  p1s += board[p1]
  if (p1s >= 1000) break
  const p2roll = die.next().value + die.next().value + die.next().value
  rolls += 3
  p2 = movePlayer(p2, p2roll)
  p2s += board[p2]
  if (p2s >= 1000) break
}
console.log(`min(${p1s}, ${p2s}) * ${rolls} = ${Math.min(p1s, p2s) * rolls}`)

const throwFreq = {} // freq of 3 throws
for (let i = 1; i <= 3; i++) {
  for (let j = 1; j <= 3; j++) {
    for (let k = 1; k <= 3; k++) {
      throwFreq[i+j+k] ||= 0
      throwFreq[i+j+k]++
    }
  }
}

let wins = [0, 0]
function go2() {
  while (Object.keys(universeFreq).length) {
    // bfs grow universeFreq
    let n = {}
    for (const [k, v] of Object.entries(universeFreq)) {
      let [p1, p2, p1s, p2s] = k.split(',').map(Number)
      for (let [num, freq] of Object.entries(throwFreq)) {
          num = Number(num) // dont forget this!!!!!!1
          const newp1 = movePlayer(p1, num)
          const newp1s = p1s + newp1 + 1
          if (newp1s >= 21) {
            wins[0] += v * freq
            continue
          }

          n[[newp1,p2,newp1s,p2s]] ||= 0
          n[[newp1,p2,newp1s,p2s]] += v * freq
      }
    }
    universeFreq = n
    n = {}
    for (const [k, v] of Object.entries(universeFreq)) {
      let [p1, p2, p1s, p2s] = k.split(',').map(Number)
      for (let [num, freq] of Object.entries(throwFreq)) {
          num = Number(num) // dont forget this!!!!!!1
          const newp2 = movePlayer(p2, num)
          const newp2s = p2s + newp2 + 1
          if (newp2s >= 21) {
            wins[1] += v * freq
            continue
          }

          n[[p1,newp2,p1s,newp2s]] ||= 0
          n[[p1,newp2,p1s,newp2s]] += v * freq
      }
    }
    universeFreq = n
  }
}

go2()
console.log('most wins in', Math.max(...wins), 'universes')
/* player turn:
- roll dice 3x, add results
- pawn goes that many times fdorward (clockwise)
- score increases by the value of the pawn where they stop
-- player above 1000 instantly wins
*/