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


b = require('fs').readFileSync('./25.txt', 'utf8')
// b=document.body.innerText.trim()
const nums = b.trim().split('\n').map(e => e.match(/[.>v]/g).map((e,i) => isNaN(e) ? e : Number(e)))
// first east. then south
function moveeast() {
  let p = copynums()
  let m = false
  for (let i = 0; i < nums.length; i++) {
    for (let j = 0; j < nums[i].length; j++) {
      if (p[i][j] === '>' && p[i][(j + 1) % nums[i].length] === '.') {
        m = true
        nums[i][j] = '.'
        nums[i][(j + 1) % nums[i].length] = '>'
      }
    }
  }
  return m
}
function movesouth() {
  let p = copynums()
  let m = false
  for (let i = 0; i < nums.length; i++) {
    for (let j = 0; j < nums[i].length; j++) {
      if (p[i][j] === 'v' && p[(i + 1) % nums.length][j] === '.') {
        m = true;
        nums[i][j] = '.'
        nums[(i + 1) % nums.length][j] = 'v'
      }
    }
  }
  return m
}
function copynums() {
  return nums.map(row => [...row])
}
function arreq(eqtonums) {
  return nums.every((row, i) => row.every((el, j) => el === eqtonums[i][j]))
}

function go() {
  let steps = 1;
  while (true) {
    let m = false
    m |= moveeast()
    m |= movesouth()
    if (!m) break
    steps++
  }
  return steps
}

console.log(go())