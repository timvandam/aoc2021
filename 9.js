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
  rlines: document.body.innerText.trim().split('\n'),
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
  return union(difference(this, b), difference(b, this))
}
set = (...elements) => new Set(elements)


// b=`
// 2199943210
// 3987894921
// 9856789892
// 8767896789
// 9899965678`.trim().split('\n')
// mat = f.read(f.digits, b)
// mat = f.read(f.digits)




// islow = (i, j,s = new Set()) => {
//     const current = mat[i][j]
//     return (i==0 || s.has(`${i-1}-${j}`) || mat[i-1][j] > current) && (i==mat.length-1|| s.has(`${i+1}-${j}`)||mat[i+1][j]>current) && (j==0|| s.has(`${i}-${j-1}`)||mat[i][j-1]>current)&&(j==mat[i].length-1|| s.has(`${i}-${j+1}`)||mat[i][j+1]>current)
// }

// known = new Set()

// getbasinsize = (i, j, s = new Set()) => {
//     if (mat[i][j]==9) return s
//     if (known.has(`${i}-${j}`)) return s
//     s.add(`${i}-${j}`)
//     known.add(`${i}-${j}`)
//     const dirs = [[1,0],[-1,0],[0,1],[0,-1]]
//     for (const [dy, dx] of dirs) {
//         const [y, x] = [i + dy, j+ dx]
//         if (y < 0 || x < 0 || y >= mat.length || x >= mat[y].length) {
//             continue
//         }
//         if (mat[y][x] !== 9 && !s.has(`${y}-${x}`) && !known.has(`${y}-${x}`)) {
//             getbasinsize(y, x, s)
//         }
//     }
//     return s
// }

// // 3 largest basin sizes and multiply
// sizes = []
// sets = []
// for (let i = 0; i < mat.length; i++) {
//     for (let j = 0; j < mat[i].length; j++) {
//         if (mat[i][j] !== 9 && !known.has(`${i}-{j}`)) {
//             sets.push(getbasinsize(i, j))
//             sizes.push(sets[sets.length-1].size)
//         }
//     }
// }
// res =sizes.sort((x,y)=>y-x).slice(0,3).reduce((x,y)=>x*y,1)
// console.log('result:' ,res)


// cleaner:
mat = f.read(f.digits)
known = new Set()
let [a,b,c] = [0,0,0]
str=(i,j)=>`${i}-${j}`
getbasinsize = (i,j) => {
    if (mat[i][j] == 9 || known.has(str(i,j))) return 0
    const startsize = known.size
    known.add(str(i,j))
    const dirs = [[-1,0],[1,0],[0,-1],[0,1]]
    for (const [dy,dx] of dirs) {
        const [y,x] = [i+dy,j+dx]
        if (y < 0 || x < 0 || y >= mat.length || x >= mat[y].length) continue
        if (mat[y][x] !== 9 && !known.has(str(y,x))) {
            getbasinsize(y,x)
        }
    }
    return known.size - startsize
}
for (let i = 0; i < mat.length; i++) {
    for (let j = 0; j < mat[i].length; j++) {
        const size = getbasinsize(i,j)
        if (size > a) ([a,b,c]=[size,a,b])
        else if (size > b) ([a,b,c] = [a,size,b])
        else if (size > c) ([a,b,c] = [a,b,size])
    }
}
console.log('result:', a*b*c)
