pipe=(start=document.body.innerText)=>(...fns)=>fns.reduce((input, fn) => fn(input), start);
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



b=document.body.innerText
c=`6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`
l=b.trim().split('\n').filter(e=>e).map(e=>e.match(/x|y|\d+/g));
coords = []
instructions = [];
for (const [x,y] of l) {
	if (isNaN(x)) instructions.push([x,parseInt(y)])
	else coords.push([parseInt(x),parseInt(y)])
}

// document.body.innerText.trim().split('\n\n').map(e=>e.split('\n').map(x=>x.match(/x|y|\d+/g))).reduce(())

for (const [axis, val] of instructions) {
	coordIndex = 'xy'.indexOf(axis)

	for (const coord of coords) {
		if (coord[coordIndex] > val) {
			coord[coordIndex] -= 2 * (coord[coordIndex]-val)
		}
	}
}

result = new Set(coords.map(([x,y])=>`${x}-${y}`))

maxX = 0
maxY = 0
for (const [x,y] of coords) {
	maxX = Math.max(x, maxX)
	maxY = Math.max(y, maxY)
}

mat = Array.from({length:maxY+1}, () => Array.from({length:maxX+1}, () => '  '))
for (const [x,y] of coords) {
	mat[y][x] = '11'
}
