((r=(a,b)=>Array.from({length:Math.abs(a-b)+1},(_,i)=>a+i*(a>b?-1:1)))=>document.body.innerText.trim().split('\n').map(e=>e.match(/(\d+),(\d+) -> (\d+),(\d+)/).slice(1,5).map(e=>parseInt(e))).reduce((g,[a,b,c,d])=>[(a==c ?r(b,d).forEach((i)=>g[i][a]++):b==d?r(a,c).forEach((i)=>g[d][i]++) :Math.abs(a-c)==Math.abs(b-d) ?((x,y)=>x.map((x,i)=>[x,y[i]]))(r(a,c),r(b,d)).forEach(([x,y])=>g[y][x]++) :g),g][1], Array.from({length:1000},()=>Array(1000).fill(0))).flat(1).filter(x=>x>=2).length)()


l=b.trim().split("\n").map(e=>e.split('->').map(e=>e.trim().split(',').map(e=>parseInt(e))))

let maxX = 0
let maxY = 0

for(let i =0; i < l.length; i++) {
  maxX = Math.max(maxX, l[i][0][0], l[i][1][0])
  maxY = Math.max(maxY, l[i][0][1], l[i][1][1])
}

grid = Array.from({length:maxY+1},()=>Array.from({length:maxX+1},()=>0))


for (let i = 0; i < l.length; i++) {
  let [[fromX, fromY], [toX, toY]] = l[i]
  if (!(fromX===toX||fromY===toY||Math.abs(fromY-toY)===Math.abs(fromX-toX))) continue
  let dx = Math.sign(toX-fromX)
  if (dx==0)dx=1
  let dy = Math.sign(toY-fromY)
  if (dy==0)dy=1
  for (let x = fromX; x != toX + dx; x += dx) {
    for (let y = fromY; y != toY + dy; y += dy) {
// remove this block for part 1
      if (Math.abs(fromY-toY)===Math.abs(fromX-toX)) {
        if (Math.abs(fromX-x) === Math.abs(fromY-y)) {
          grid[y][x]++
        }
      } else {
        grid[y][x]++
      }
    }
  }
}

m = 0
for (const r of grid) {
  for (const e of r) {
    m = Math.max(m,e)
  }
}
c=0
for (let i = 0; i <= maxX; i++) {
  for (let j = 0; j <= maxY; j++) {
    if(grid[j][i]>=2)c++
  }
}


/// with the new tools:
mat = (dims,fill=()=>0) => dims.length === 1 ? Array(dims[0]).fill(fill()):Array.from({length:dims.splice(-1)}, () => mat(dims,fill))
zip = (a,...r)=> a.map((a,i)=>[a,...r.map(r=>r[i])])
rng = (f, t) => Array.from({length:Math.abs(f-t)+1},(_,i)=>f+i*(f<t?1:-1))
repeat=(arr,cnt)=>Array.from({length:cnt},()=>[...arr]).flat(Infinity)
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


lines = f.read()
grid = mat([1000,1000])
for (const [x1,y1,x2,y2] of lines) {
  x=Math.abs(x1-x2)+1
  y=Math.abs(y1-y2)+1
  len = Math.max(x,y)
  if (x1==x2||y1==y2||x==y) { // remove last condition for part 1
    zip(forcelen(rng(x1,x2),len), forcelen(rng(y1,y2),len)).forEach(([x,y])=>grid[y][x]++)
  }
}
c=grid.flat(2).filter(x=>x>=2).length